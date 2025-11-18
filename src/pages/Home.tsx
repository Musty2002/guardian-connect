import { useState } from "react";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";
import { EmergencyButton } from "@/components/EmergencyButton";
import { StatusCard } from "@/components/StatusCard";
import { Shield, Users, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [nearbyUsers, setNearbyUsers] = useState(12);
  const [safetyScore, setSafetyScore] = useState(85);
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary pb-24">
      <MobileHeader
        title="SafeGuard Nigeria"
        onMenuClick={handleMenuClick}
        onNotificationsClick={handleNotificationsClick}
      />
      
      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
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
          <div className="grid grid-cols-2 gap-4">
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
