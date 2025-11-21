import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Radio, Zap, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmergencyBroadcast } from '@/utils/meshNetwork';

interface SimulatedPeer {
  id: string;
  name: string;
  distance: number;
  lastBroadcast?: number;
}

export const MeshNetworkDemo = () => {
  const [simulatedPeers, setSimulatedPeers] = useState<SimulatedPeer[]>([]);
  const [broadcastCount, setBroadcastCount] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const { toast } = useToast();

  // Generate simulated peers
  useEffect(() => {
    const peers: SimulatedPeer[] = [
      { id: '1', name: 'Device-Alpha', distance: 25 },
      { id: '2', name: 'Device-Beta', distance: 45 },
      { id: '3', name: 'Device-Gamma', distance: 78 },
    ];
    setSimulatedPeers(peers);
  }, []);

  const addActivity = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setRecentActivity(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const simulateEmergencyBroadcast = () => {
    setIsSimulating(true);
    setBroadcastCount(prev => prev + 1);
    
    addActivity('🚨 Emergency broadcast initiated');

    // Simulate propagation through peers
    simulatedPeers.forEach((peer, index) => {
      setTimeout(() => {
        setSimulatedPeers(prev => 
          prev.map(p => 
            p.id === peer.id 
              ? { ...p, lastBroadcast: Date.now() }
              : p
          )
        );
        addActivity(`📡 Broadcast reached ${peer.name} (~${peer.distance}m)`);

        // Last peer reached
        if (index === simulatedPeers.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            toast({
              title: "Mesh Broadcast Complete",
              description: `Emergency alert propagated to ${simulatedPeers.length} nearby devices`,
              variant: "default",
            });
            addActivity('✅ All reachable peers notified');
          }, 500);
        }
      }, (index + 1) * 800);
    });
  };

  const simulatePeerJoin = () => {
    const newPeer: SimulatedPeer = {
      id: String(Date.now()),
      name: `Device-${String.fromCharCode(65 + simulatedPeers.length)}`,
      distance: Math.floor(Math.random() * 80) + 20,
    };
    
    setSimulatedPeers(prev => [...prev, newPeer]);
    addActivity(`🔵 New peer joined: ${newPeer.name} (~${newPeer.distance}m)`);
    
    toast({
      title: "New Device Discovered",
      description: `${newPeer.name} joined the mesh network`,
    });
  };

  const simulatePeerLeave = () => {
    if (simulatedPeers.length === 0) return;
    
    const leavingPeer = simulatedPeers[simulatedPeers.length - 1];
    setSimulatedPeers(prev => prev.slice(0, -1));
    addActivity(`🔴 Peer left: ${leavingPeer.name}`);
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className={`h-5 w-5 text-primary ${isSimulating ? 'animate-pulse' : ''}`} />
          Mesh Network Demo
        </CardTitle>
        <CardDescription>
          Hackathon visualization - Shows how emergency broadcasts propagate through the mesh
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-muted rounded-lg text-center">
            <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
            <div className="text-2xl font-bold">{simulatedPeers.length}</div>
            <div className="text-xs text-muted-foreground">Active Peers</div>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <Zap className="h-4 w-4 mx-auto mb-1 text-warning" />
            <div className="text-2xl font-bold">{broadcastCount}</div>
            <div className="text-xs text-muted-foreground">Broadcasts</div>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-emergency" />
            <div className="text-2xl font-bold">
              {simulatedPeers.reduce((sum, p) => sum + p.distance, 0)}m
            </div>
            <div className="text-xs text-muted-foreground">Coverage</div>
          </div>
        </div>

        {/* Simulated Peers */}
        {simulatedPeers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Connected Devices</h4>
            <div className="space-y-2">
              {simulatedPeers.map((peer) => (
                <div
                  key={peer.id}
                  className={`p-3 rounded-lg border transition-all ${
                    peer.lastBroadcast && Date.now() - peer.lastBroadcast < 3000
                      ? 'bg-primary/10 border-primary animate-pulse'
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{peer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        ~{peer.distance}m
                      </Badge>
                      {peer.lastBroadcast && Date.now() - peer.lastBroadcast < 3000 && (
                        <Badge variant="default" className="text-xs animate-pulse">
                          Broadcasting
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={simulateEmergencyBroadcast}
            disabled={isSimulating || simulatedPeers.length === 0}
            variant="destructive"
            size="sm"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Test Emergency
          </Button>
          <Button
            onClick={simulatePeerJoin}
            variant="outline"
            size="sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Add Peer
          </Button>
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
          <strong>Demo Mode:</strong> This visualization shows how mesh broadcasts would propagate in production. 
          In the real implementation, devices communicate via Bluetooth LE within ~100m range.
        </div>
      </CardContent>
    </Card>
  );
};
