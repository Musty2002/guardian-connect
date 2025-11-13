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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    console.log('Exporting data for user:', user.id);

    // Fetch all user data
    const [profile, familyConnections, safeZones, emergencyAlerts, appUsage, 
           screenTimeSessions, parentalControls, blockedApps, userLocations,
           deviceTracking, securityEvents, backupLogs] = await Promise.all([
      supabaseClient.from('profiles').select('*').eq('id', user.id).single(),
      supabaseClient.from('family_connections').select('*').or(`parent_id.eq.${user.id},child_id.eq.${user.id}`),
      supabaseClient.from('safe_zones').select('*').or(`parent_id.eq.${user.id},child_id.eq.${user.id}`),
      supabaseClient.from('emergency_alerts').select('*').eq('user_id', user.id),
      supabaseClient.from('app_usage').select('*').eq('user_id', user.id),
      supabaseClient.from('screen_time_sessions').select('*').eq('user_id', user.id),
      supabaseClient.from('parental_controls').select('*').or(`parent_id.eq.${user.id},child_id.eq.${user.id}`),
      supabaseClient.from('blocked_apps').select('*').or(`parent_id.eq.${user.id},child_id.eq.${user.id}`),
      supabaseClient.from('user_locations').select('*').eq('user_id', user.id),
      supabaseClient.from('device_tracking').select('*').eq('user_id', user.id),
      supabaseClient.from('device_security_events').select('*').eq('user_id', user.id),
      supabaseClient.from('backup_logs').select('*').eq('user_id', user.id),
    ]);

    const exportData = {
      export_date: new Date().toISOString(),
      user_id: user.id,
      user_email: user.email,
      data: {
        profile: profile.data,
        family_connections: familyConnections.data,
        safe_zones: safeZones.data,
        emergency_alerts: emergencyAlerts.data,
        app_usage: appUsage.data,
        screen_time_sessions: screenTimeSessions.data,
        parental_controls: parentalControls.data,
        blocked_apps: blockedApps.data,
        user_locations: userLocations.data,
        device_tracking: deviceTracking.data,
        device_security_events: securityEvents.data,
        backup_logs: backupLogs.data,
      }
    };

    // Log the export
    await supabaseClient.from('backup_logs').insert({
      user_id: user.id,
      backup_type: 'export',
      status: 'completed',
      file_size: JSON.stringify(exportData).length,
    });

    console.log('Export completed successfully');

    return new Response(
      JSON.stringify(exportData),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="safeguard-backup-${new Date().toISOString().split('T')[0]}.json"`
        },
      }
    );
  } catch (error) {
    console.error('Error exporting data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to export data' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
