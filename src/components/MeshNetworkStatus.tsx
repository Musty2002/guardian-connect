import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Radio, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { meshNetwork, EmergencyBroadcast } from '@/utils/meshNetwork';
import { useToast } from '@/hooks/use-toast';

export const MeshNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activePeers, setActivePeers] = useState(0);
  const [recentBroadcasts, setRecentBroadcasts] = useState<EmergencyBroadcast[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize mesh network
    meshNetwork.initialize();

    // Listen for broadcasts
    meshNetwork.onBroadcast((broadcast) => {
      toast({
        title: 'Emergency Broadcast Received',
        description: broadcast.message,
        variant: 'destructive',
      });
      setRecentBroadcasts(meshNetwork.getAllBroadcasts().slice(0, 5));
    });

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Offline Mode',
        description: 'Emergency mesh network active',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update peer count periodically
    const interval = setInterval(() => {
      setActivePeers(meshNetwork.getActivePeers());
      setRecentBroadcasts(meshNetwork.getAllBroadcasts().slice(0, 5));
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
      meshNetwork.disconnect();
    };
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-orange-500" />
          )}
          Mesh Network Status
        </CardTitle>
        <CardDescription>
          {isOnline ? 'Connected to internet' : 'Offline - Mesh network active'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            <span className="text-sm">Active Peers</span>
          </div>
          <Badge variant={activePeers > 0 ? 'default' : 'secondary'}>
            {activePeers}
          </Badge>
        </div>

        {recentBroadcasts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Recent Emergency Broadcasts
            </h4>
            <div className="space-y-2">
              {recentBroadcasts.map((broadcast) => (
                <div
                  key={broadcast.id}
                  className="text-xs p-2 bg-muted rounded-lg"
                >
                  <div className="font-medium">{broadcast.type}</div>
                  <div className="text-muted-foreground">{broadcast.message}</div>
                  <div className="text-muted-foreground">
                    {new Date(broadcast.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {isOnline
            ? 'Emergency broadcasts will be sent via internet and mesh network'
            : 'Emergency broadcasts will be shared via local mesh network to nearby devices'}
        </p>
      </CardContent>
    </Card>
  );
};
