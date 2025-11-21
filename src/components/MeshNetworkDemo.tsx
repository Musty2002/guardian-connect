import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Radio, Zap, Users, AlertTriangle, Bluetooth, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNativeMeshNetwork } from '@/hooks/useNativeMeshNetwork';
import { useAuth } from '@/hooks/useAuth';
import { Capacitor } from '@capacitor/core';

export const MeshNetworkDemo = () => {
  const [broadcastCount, setBroadcastCount] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Use native mesh network for real device discovery
  const {
    isInitialized,
    isScanning,
    nearbyPeers,
    receivedBroadcasts,
    broadcastEmergency,
    startScanning,
    isNativeSupported
  } = useNativeMeshNetwork();

  // Track when new peers are discovered
  useEffect(() => {
    if (nearbyPeers.length > 0) {
      const latestPeer = nearbyPeers[nearbyPeers.length - 1];
      const timeSinceDiscovery = Date.now() - latestPeer.lastSeen;
      
      if (timeSinceDiscovery < 2000) {
        addActivity(`🔵 Discovered: ${latestPeer.name} (~${Math.round(latestPeer.distance || 0)}m)`);
      }
    }
  }, [nearbyPeers.length]);

  // Track received broadcasts
  useEffect(() => {
    if (receivedBroadcasts.length > 0) {
      const latest = receivedBroadcasts[receivedBroadcasts.length - 1];
      addActivity(`📥 Received ${latest.type} broadcast from peer`);
    }
  }, [receivedBroadcasts.length]);

  const addActivity = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setRecentActivity(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const sendTestBroadcast = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to send broadcasts",
        variant: "destructive",
      });
      return;
    }

    setIsSimulating(true);
    setBroadcastCount(prev => prev + 1);
    
    addActivity('🚨 Emergency broadcast initiated');

    // Send real broadcast via native mesh
    await broadcastEmergency({
      id: `test-emergency-${Date.now()}`,
      userId: user.id,
      type: 'emergency',
      location: { latitude: 6.5244, longitude: 3.3792 }, // Lagos coordinates
      timestamp: Date.now(),
      message: 'TEST: Emergency alert - This is a hackathon demo',
      batteryLevel: 85
    });

    // Simulate propagation visualization
    if (nearbyPeers.length > 0) {
      nearbyPeers.forEach((peer, index) => {
        setTimeout(() => {
          addActivity(`📡 Broadcasting to ${peer.name} (~${Math.round(peer.distance || 0)}m)`);

          if (index === nearbyPeers.length - 1) {
            setTimeout(() => {
              setIsSimulating(false);
              toast({
                title: "Broadcast Sent",
                description: `Alert sent to ${nearbyPeers.length} nearby device(s)`,
              });
              addActivity(`✅ Broadcast complete - ${nearbyPeers.length} peer(s) reached`);
            }, 500);
          }
        }, (index + 1) * 600);
      });
    } else {
      setTimeout(() => {
        setIsSimulating(false);
        addActivity('ℹ️ No peers detected - broadcast stored locally');
        toast({
          title: "Broadcast Stored",
          description: "No nearby devices found. Broadcast saved for when peers connect.",
        });
      }, 1000);
    }
  };

  const handleRescan = async () => {
    addActivity('🔍 Scanning for nearby devices...');
    await startScanning();
    
    toast({
      title: "Scanning for Devices",
      description: "Looking for nearby Bluetooth LE devices",
    });
  };

  const totalCoverage = nearbyPeers.reduce((sum, p) => sum + (p.distance || 0), 0);

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isNativeSupported ? (
            <Bluetooth className={`h-5 w-5 text-primary ${isScanning ? 'animate-pulse' : ''}`} />
          ) : (
            <Radio className="h-5 w-5 text-muted-foreground" />
          )}
          {isNativeSupported ? 'Native Mesh Network' : 'Mesh Network (Web Demo)'}
        </CardTitle>
        <CardDescription>
          {isNativeSupported 
            ? 'Real-time Bluetooth LE device discovery and emergency broadcasting'
            : 'Native features available only on Android/iOS apps'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Banner */}
        {isNativeSupported && !isInitialized && (
          <div className="p-3 bg-muted border rounded-lg text-sm">
            <strong>Initializing Bluetooth...</strong> Please ensure Bluetooth and Location permissions are granted.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-muted rounded-lg text-center">
            <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
            <div className="text-2xl font-bold">{nearbyPeers.length}</div>
            <div className="text-xs text-muted-foreground">
              {isNativeSupported ? 'BLE Devices' : 'Demo Peers'}
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <Zap className="h-4 w-4 mx-auto mb-1 text-warning" />
            <div className="text-2xl font-bold">{broadcastCount}</div>
            <div className="text-xs text-muted-foreground">Sent</div>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-success" />
            <div className="text-2xl font-bold">{receivedBroadcasts.length}</div>
            <div className="text-xs text-muted-foreground">Received</div>
          </div>
        </div>

        {/* Discovered Devices */}
        {nearbyPeers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Discovered Devices (BLE)</h4>
              {isScanning && (
                <Badge variant="outline" className="text-xs animate-pulse">
                  Scanning...
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              {nearbyPeers.map((peer) => {
                const timeSinceSeen = Date.now() - peer.lastSeen;
                const isRecent = timeSinceSeen < 5000;
                
                return (
                  <div
                    key={peer.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isRecent
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bluetooth className={`h-4 w-4 ${isRecent ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-medium text-sm">{peer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {peer.distance !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            ~{Math.round(peer.distance)}m
                          </Badge>
                        )}
                        {isRecent && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isNativeSupported && nearbyPeers.length === 0 && !isScanning && (
          <div className="p-4 bg-muted/50 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
            No nearby devices found. Make sure other devices have the app running and Bluetooth enabled.
          </div>
        )}

        {/* Demo Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={sendTestBroadcast}
            disabled={isSimulating || (isNativeSupported && !isInitialized)}
            variant="destructive"
            size="sm"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Test Broadcast
          </Button>
          {isNativeSupported && (
            <Button
              onClick={handleRescan}
              disabled={isScanning}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
              Scan Devices
            </Button>
          )}
        </div>

        {/* Activity Log */}
        {recentActivity.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Recent Activity</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRecentActivity([])}
                className="h-6 text-xs"
              >
                Clear
              </Button>
            </div>
            <div className="bg-muted rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-xs space-y-1">
              {recentActivity.map((activity, i) => (
                <div key={i} className="text-muted-foreground">
                  {activity}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/20">
          <strong>Native Bluetooth Mesh:</strong> Discovering nearby devices via BLE. 
          Coverage range: ~100m outdoors, 10-30m indoors. Emergency broadcasts propagate through discovered peers.
        </div>
      </CardContent>
    </Card>
  );
};
