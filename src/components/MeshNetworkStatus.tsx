import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Radio, AlertTriangle, Bluetooth } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { meshNetwork, EmergencyBroadcast } from '@/utils/meshNetwork';
import { useNativeMeshNetwork } from '@/hooks/useNativeMeshNetwork';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';

export const MeshNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [recentBroadcasts, setRecentBroadcasts] = useState<EmergencyBroadcast[]>([]);
  const { toast } = useToast();
  
  // Use native mesh on mobile, fallback to web mesh on browser
  const isNative = Capacitor.isNativePlatform();
  const nativeMesh = useNativeMeshNetwork();
  const [webActivePeers, setWebActivePeers] = useState(0);
  
  // Choose active peers based on platform
  const activePeers = isNative ? nativeMesh.activePeers : webActivePeers;
  const isScanning = isNative ? nativeMesh.isScanning : false;

  useEffect(() => {
    if (!isNative) {
      // Initialize web-based mesh network
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

      // Update peer count periodically for web
      const interval = setInterval(() => {
        setWebActivePeers(meshNetwork.getActivePeers());
        setRecentBroadcasts(meshNetwork.getAllBroadcasts().slice(0, 5));
      }, 5000);

      return () => {
        clearInterval(interval);
        meshNetwork.disconnect();
      };
    }
  }, [toast, isNative]);

  // Update broadcasts from native mesh
  useEffect(() => {
    if (isNative) {
      setRecentBroadcasts(nativeMesh.receivedBroadcasts.slice(0, 5));
    }
  }, [nativeMesh.receivedBroadcasts, isNative]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Offline Mode',
        description: isNative 
          ? 'Bluetooth mesh network active' 
          : 'Emergency mesh network active',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast, isNative]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isNative ? (
            <Bluetooth className={`h-5 w-5 ${nativeMesh.isInitialized ? 'text-blue-500' : 'text-gray-400'}`} />
          ) : isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-orange-500" />
          )}
          {isNative ? 'Bluetooth Mesh Network' : 'Mesh Network Status'}
        </CardTitle>
        <CardDescription>
          {isNative 
            ? (nativeMesh.isInitialized ? 'Native Bluetooth mesh active' : 'Initializing...')
            : (isOnline ? 'Connected to internet' : 'Offline - Mesh network active')
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className={`h-4 w-4 ${isScanning ? 'animate-pulse' : ''}`} />
            <span className="text-sm">
              {isNative ? 'Nearby Devices' : 'Active Peers'}
              {isScanning && ' (Scanning...)'}
            </span>
          </div>
          <Badge variant={activePeers > 0 ? 'default' : 'secondary'}>
            {activePeers}
          </Badge>
        </div>

        {isNative && nativeMesh.nearbyPeers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Discovered Devices</h4>
            <div className="space-y-1">
              {nativeMesh.nearbyPeers.slice(0, 3).map((peer) => (
                <div
                  key={peer.id}
                  className="text-xs p-2 bg-muted rounded-lg flex justify-between items-center"
                >
                  <span className="font-medium">{peer.name}</span>
                  {peer.distance && (
                    <span className="text-muted-foreground">
                      ~{Math.round(peer.distance)}m
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
          {isNative
            ? 'Bluetooth mesh network allows device-to-device communication within ~100m range'
            : isOnline
              ? 'Emergency broadcasts will be sent via internet and mesh network'
              : 'Emergency broadcasts will be shared via local mesh network to nearby devices'}
        </p>
      </CardContent>
    </Card>
  );
};
