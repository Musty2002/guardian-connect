import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ThreatAssessment {
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  threats: string[];
  recommendations: string[];
  alert_emergency_contacts: boolean;
}

export const useThreatDetection = (userId?: string) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentThreat, setCurrentThreat] = useState<ThreatAssessment | null>(null);
  const { toast } = useToast();

  const analyzeThreat = async (latitude: number, longitude: number) => {
    if (!userId) return;

    setIsAnalyzing(true);
    try {
      // Get recent location history
      const { data: locations } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(10);

      // Get nearby danger zones (within 5km)
      const { data: dangerZones } = await supabase
        .from('danger_zones')
        .select('*')
        .gte('latitude', latitude - 0.045)
        .lte('latitude', latitude + 0.045)
        .gte('longitude', longitude - 0.045)
        .lte('longitude', longitude + 0.045);

      const { data, error } = await supabase.functions.invoke('detect-threats', {
        body: {
          userId,
          locationData: { latitude, longitude },
          userLocations: locations || [],
          dangerZones: dangerZones || []
        }
      });

      if (error) throw error;

      const assessment = data.assessment as ThreatAssessment;
      setCurrentThreat(assessment);

      if (assessment && assessment.threat_level !== 'low') {
        toast({
          title: `${assessment.threat_level.toUpperCase()} Threat Detected`,
          description: assessment.threats[0],
          variant: assessment.threat_level === 'critical' ? 'destructive' : 'default',
        });
      }

      return assessment;
    } catch (error) {
      console.error('Threat detection error:', error);
      toast({
        title: 'Analysis Error',
        description: 'Could not analyze current threat level',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    currentThreat,
    analyzeThreat
  };
};
