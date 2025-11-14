import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useThreatDetection } from '@/hooks/useThreatDetection';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

interface ThreatDetectionCardProps {
  latitude?: number;
  longitude?: number;
  autoAnalyze?: boolean;
}

export const ThreatDetectionCard = ({ 
  latitude, 
  longitude,
  autoAnalyze = false 
}: ThreatDetectionCardProps) => {
  const { user } = useAuth();
  const { isAnalyzing, currentThreat, analyzeThreat } = useThreatDetection(user?.id);

  useEffect(() => {
    if (autoAnalyze && latitude && longitude) {
      analyzeThreat(latitude, longitude);
    }
  }, [latitude, longitude, autoAnalyze]);

  const getThreatIcon = () => {
    if (!currentThreat) return <Shield className="h-5 w-5" />;
    
    switch (currentThreat.threat_level) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'high':
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getThreatBadgeVariant = () => {
    if (!currentThreat) return 'secondary';
    
    switch (currentThreat.threat_level) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
      case 'critical':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getThreatIcon()}
          AI Threat Detection
        </CardTitle>
        <CardDescription>
          {isAnalyzing ? 'Analyzing current location...' : 'Real-time safety analysis'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentThreat ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Threat Level</span>
              <Badge variant={getThreatBadgeVariant()}>
                {currentThreat.threat_level.toUpperCase()}
              </Badge>
            </div>

            {currentThreat.threats.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Detected Threats:</h4>
                <ul className="space-y-1">
                  {currentThreat.threats.map((threat, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {threat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentThreat.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommendations:</h4>
                <ul className="space-y-1">
                  {currentThreat.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Location data required for threat analysis
          </p>
        )}
      </CardContent>
    </Card>
  );
};
