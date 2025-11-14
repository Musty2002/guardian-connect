import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, locationData, userLocations, dangerZones } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an AI safety analyst. Analyze location patterns, nearby danger zones, movement speed, and time of day to detect potential threats. Respond with a threat assessment.`;

    const userPrompt = `Analyze this data:
Current Location: ${JSON.stringify(locationData)}
Recent Location History: ${JSON.stringify(userLocations.slice(-10))}
Nearby Danger Zones: ${JSON.stringify(dangerZones)}
Current Time: ${new Date().toISOString()}

Assess threat level (low/medium/high/critical) and provide specific reasons.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          name: "assess_threat",
          description: "Assess threat level and provide recommendations",
          parameters: {
            type: "object",
            properties: {
              threat_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
              threats: { 
                type: "array",
                items: { type: "string" }
              },
              recommendations: {
                type: "array",
                items: { type: "string" }
              },
              alert_emergency_contacts: { type: "boolean" }
            },
            required: ["threat_level", "threats", "recommendations", "alert_emergency_contacts"]
          }
        }],
        tool_choice: { type: "function", function: { name: "assess_threat" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const assessment = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    console.log("Threat assessment:", assessment);

    // Store threat assessment
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (assessment && assessment.threat_level !== 'low') {
      await supabase.from('threat_assessments').insert({
        user_id: userId,
        threat_level: assessment.threat_level,
        threats: assessment.threats,
        recommendations: assessment.recommendations,
        location_data: locationData,
        alert_contacts: assessment.alert_emergency_contacts
      });
    }

    return new Response(JSON.stringify({ assessment }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
