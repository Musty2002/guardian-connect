import { useState } from "react";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";
import { EmergencyButton } from "@/components/EmergencyButton";
import { StatusCard } from "@/components/StatusCard";
import { Shield, Users, MapPin, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

const Home = () => {
  const [nearbyUsers, setNearbyUsers] = useState(12);
  const [safetyScore, setSafetyScore] = useState(85);
  const { toast } = useToast();

  const handleRefresh = async () => {
    // Simulate fetching new data
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Update data
    setNearbyUsers(Math.floor(Math.random() * 20) + 5);
    setSafetyScore(Math.floor(Math.random() * 30) + 70);
    
    toast({
      title: "Refreshed",
      description: "Location and safety data updated",
    });
  };

  const { containerRef, pullDistance, isRefreshing, threshold } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  const handleEmergencyActivate = () => {
    console.log("Emergency mode activated");
    // TODO: Implement emergency mode logic
    // - Start mesh network broadcast
    // - Begin location tracking
    // - Auto-call emergency services
    // - Capture photos/audio
  };

  const handleMenuClick = () => {
    toast({
      title: "Menu",
      description: "Menu functionality coming soon",
    });
  };

  const handleNotificationsClick = () => {
    toast({
      title: "Notifications",
      description: "You have 2 new safety alerts",
    });
  };

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const showRefreshIndicator = pullDistance > 0 || isRefreshing;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary pb-24">
      <MobileHeader
        title="SafeGuard Nigeria"
        onMenuClick={handleMenuClick}
        onNotificationsClick={handleNotificationsClick}
      />
      
      {/* Pull to Refresh Indicator */}
      {showRefreshIndicator && (
        <div 
          className="fixed top-16 left-0 right-0 z-30 flex justify-center transition-all duration-300"
          style={{
            transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
            opacity: pullProgress,
          }}
        >
          <div className="bg-card/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-border/50 flex items-center gap-2">
            <RefreshCw 
              className={`w-4 h-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: `rotate(${pullProgress * 360}deg)`,
              }}
            />
            <span className="text-xs font-medium text-foreground">
              {isRefreshing ? 'Refreshing...' : pullProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}
      
      <main 
        ref={containerRef}
        className="max-w-screen-sm mx-auto px-4 py-6 space-y-6 overflow-y-auto"
        style={{ height: 'calc(100vh - 4rem - 5rem)' }}
      >
        {/* Hero Status Section */}
        <div className="p-6 bg-gradient-to-br from-card to-card/50 rounded-3xl border-2 border-border/50 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src="/logo.png" 
              alt="SafeGuard Nigeria" 
              className="w-16 h-16 object-contain"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Welcome back</h2>
              <p className="text-sm text-muted-foreground font-medium">You're in a safe area</p>
            </div>
          </div>
          
          {/* Status Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <StatusCard
              icon={Users}
              title="Nearby"
              value={nearbyUsers}
              status="safe"
            />
            <StatusCard
              icon={Shield}
              title="Safety"
              value={`${safetyScore}%`}
              status="safe"
            />
            <StatusCard
              icon={MapPin}
              title="Location"
              value="Active"
              status="safe"
            />
            <StatusCard
              icon={Clock}
              title="Updated"
              value="Now"
              status="safe"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground/70 mb-4 uppercase tracking-wider">Quick Actions</h3>
          <button className="w-full p-5 bg-card rounded-2xl border-2 border-border/50 text-left hover:border-primary hover:shadow-md transition-all duration-200 active:scale-[0.98] backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground text-base mb-1">View Danger Zones</p>
                <p className="text-sm text-muted-foreground">See unsafe areas near you</p>
              </div>
              <MapPin className="w-6 h-6 text-warning" strokeWidth={2.5} />
            </div>
          </button>
          
          <button className="w-full p-5 bg-card rounded-2xl border-2 border-border/50 text-left hover:border-primary hover:shadow-md transition-all duration-200 active:scale-[0.98] backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground text-base mb-1">Share Location</p>
                <p className="text-sm text-muted-foreground">Let family know where you are</p>
              </div>
              <Users className="w-6 h-6 text-accent" strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
