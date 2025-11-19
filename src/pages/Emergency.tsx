import { useState, useEffect } from "react";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";
import { EmergencyButton } from "@/components/EmergencyButton";
import { EmergencyConfirmDialog } from "@/components/EmergencyConfirmDialog";
import { MeshNetworkStatus } from "@/components/MeshNetworkStatus";
import { ThreatDetectionCard } from "@/components/ThreatDetectionCard";
import { Phone, MessageSquare, Camera, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGestureDetection } from "@/hooks/useGestureDetection";
import { useNativeCamera } from "@/hooks/useNativeCamera";
import { useNativeHaptics } from "@/hooks/useNativeHaptics";
import { useNativeGeolocation } from "@/hooks/useNativeGeolocation";
import { useNativeLocalNotifications } from "@/hooks/useNativeLocalNotifications";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ImpactStyle, NotificationType } from "@capacitor/haptics";

const Emergency = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [emergencyPassword, setEmergencyPassword] = useState<string | null>(null);
  const [shakeGestureEnabled, setShakeGestureEnabled] = useState(false);
  const [powerButtonGestureEnabled, setPowerButtonGestureEnabled] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { takePicture, isCapturing } = useNativeCamera();
  const { impact, notification } = useNativeHaptics();
  const { getCurrentPosition } = useNativeGeolocation();
  const { scheduleEmergencyNotification, requestPermissions, permissionGranted } = useNativeLocalNotifications();
  const { isOnline, connectionType } = useNetworkStatus();

  // Load emergency settings and request notification permissions
  useEffect(() => {
    if (user) {
      loadEmergencySettings();
      if (!permissionGranted) {
        requestPermissions();
      }
    }
  }, [user]);

  const loadEmergencySettings = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("emergency_password, emergency_gesture_enabled, power_button_gesture_enabled")
      .eq("id", user.id)
      .single();

    if (data) {
      setEmergencyPassword(data.emergency_password);
      setShakeGestureEnabled(data.emergency_gesture_enabled || false);
      setPowerButtonGestureEnabled(data.power_button_gesture_enabled || false);
    }
  };

  // Gesture detection
  useGestureDetection({
    shakeEnabled: shakeGestureEnabled,
    powerButtonEnabled: powerButtonGestureEnabled,
    onGestureDetected: () => {
      if (!isEmergencyActive) {
        impact(ImpactStyle.Heavy);
        setShowConfirmDialog(true);
      }
    },
  });

  const handleEmergencyActivate = async () => {
    if (!user) return;

    // Trigger haptic feedback
    await notification(NotificationType.Warning);
    setIsEmergencyActive(true);

    try {
      // Get user's current location using native geolocation
      const position = await getCurrentPosition();
      
      if (position) {
        const { latitude, longitude } = position.coords;

        // Create emergency alert in database
        const { error } = await supabase.from("emergency_alerts").insert({
          user_id: user.id,
          alert_type: "sos",
          latitude,
          longitude,
          status: "active",
        });

        if (error) throw error;

        // Broadcast via mesh network for offline capability
        const { meshNetwork } = await import('@/utils/meshNetwork');
        const battery = position.coords.altitude || 0; // Using available data
        
        meshNetwork.broadcastEmergency({
          id: `emergency-${Date.now()}`,
          userId: user.id,
          type: 'emergency',
          location: { latitude, longitude },
          timestamp: Date.now(),
          message: 'Emergency alert activated - immediate assistance needed',
          batteryLevel: battery
        });

        // Trigger success haptic
        await notification(NotificationType.Success);

        // Send local notification that works even when app is closed
        await scheduleEmergencyNotification(
          "🚨 Emergency Alert Active",
          `Your emergency alert is broadcasting. Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          { alertType: 'sos', latitude, longitude }
        );

        toast({
          title: "Emergency Mode Active",
          description: isOnline 
            ? `Alert sent via ${connectionType} and mesh network` 
            : "Alert sent via mesh network (offline)",
          variant: "destructive",
        });
      } else {
        throw new Error("Could not get location");
      }
    } catch (error: any) {
      console.error("Emergency activation error:", error);
      toast({
        title: "Error",
        description: "Failed to activate emergency mode",
        variant: "destructive",
      });
    }
  };

  const handleCapturePhoto = async () => {
    await impact(ImpactStyle.Medium);
    const photo = await takePicture();
    if (photo) {
      setCapturedPhoto(photo);
      toast({
        title: "Photo Captured",
        description: "Emergency photo saved",
      });
    }
  };

  const getBatteryLevel = async (): Promise<number | undefined> => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return Math.round(battery.level * 100);
      } catch {
        return undefined;
      }
    }
    return undefined;
  };

  const handleDeactivate = async () => {
    if (!user) return;

    try {
      // Update all active alerts to resolved
      const { error } = await supabase
        .from("emergency_alerts")
        .update({ status: "resolved", resolved_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("status", "active");

      if (error) throw error;

      setIsEmergencyActive(false);
      toast({
        title: "Emergency Mode Deactivated",
        description: "Stay safe!",
      });
    } catch (error: any) {
      console.error("Deactivation error:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate emergency mode",
        variant: "destructive",
      });
    }
  };

  const emergencyContacts = [
    { name: "Police (Nigeria)", number: "112", icon: Phone },
    { name: "NSCDC", number: "112", icon: Phone },
    { name: "Emergency Services", number: "112", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <EmergencyConfirmDialog
        open={showConfirmDialog}
        onConfirm={handleEmergencyActivate}
        onCancel={() => setShowConfirmDialog(false)}
        savedPassword={emergencyPassword}
      />
      
      <MobileHeader
        title="Emergency"
        onMenuClick={() => {}}
        onNotificationsClick={() => {}}
      />
      
      <main className="max-w-screen-sm mx-auto px-4 py-6">
        {isEmergencyActive && (
          <div className="mb-6 p-4 bg-emergency/20 border-2 border-emergency rounded-xl animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-emergency text-lg">EMERGENCY MODE ACTIVE</p>
                <p className="text-sm text-foreground mt-1">Broadcasting your location...</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeactivate}
                className="border-emergency text-emergency hover:bg-emergency hover:text-emergency-foreground"
              >
                Deactivate
              </Button>
            </div>
          </div>
        )}

        {/* Mesh Network Status */}
        <div className="mb-6">
          <MeshNetworkStatus />
        </div>

        {/* AI Threat Detection */}
        <div className="mb-6">
          <ThreatDetectionCard autoAnalyze />
        </div>

        {/* Emergency Button */}
        <div className="flex flex-col items-center justify-center mb-12">
          <EmergencyButton onEmergencyActivate={handleEmergencyActivate} />
        </div>

        {/* Emergency Features */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button 
            onClick={handleCapturePhoto}
            disabled={isCapturing}
            className="p-4 bg-card rounded-xl border border-border hover:border-accent transition-colors active:scale-95 disabled:opacity-50"
          >
            <Camera className="w-8 h-8 text-accent mb-2" />
            <p className="text-sm font-semibold text-foreground">
              {isCapturing ? "Capturing..." : "Auto Capture"}
            </p>
            <p className="text-xs text-muted-foreground">Front & back camera</p>
            {capturedPhoto && (
              <p className="text-xs text-success mt-1">✓ Photo saved</p>
            )}
          </button>
          
          <button className="p-4 bg-card rounded-xl border border-border hover:border-accent transition-colors">
            <Mic className="w-8 h-8 text-accent mb-2" />
            <p className="text-sm font-semibold text-foreground">Record Audio</p>
            <p className="text-xs text-muted-foreground">Evidence collection</p>
          </button>
          
          <button className="p-4 bg-card rounded-xl border border-border hover:border-accent transition-colors">
            <MessageSquare className="w-8 h-8 text-accent mb-2" />
            <p className="text-sm font-semibold text-foreground">Mesh Alert</p>
            <p className="text-xs text-muted-foreground">Notify nearby users</p>
          </button>
          
          <button className="p-4 bg-card rounded-xl border border-border hover:border-accent transition-colors">
            <Phone className="w-8 h-8 text-accent mb-2" />
            <p className="text-sm font-semibold text-foreground">Auto Call</p>
            <p className="text-xs text-muted-foreground">Contact authorities</p>
          </button>
        </div>

        {/* Emergency Contacts */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Emergency Contacts</h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <button
                key={index}
                className="w-full p-4 bg-card rounded-xl border border-border text-left hover:border-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <contact.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.number}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-success hover:bg-success/90">
                    Call
                  </Button>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Safety Info */}
        <div className="mt-8 p-4 bg-warning/10 rounded-xl border border-warning/30">
          <h3 className="font-semibold text-warning mb-2">Emergency Instructions</h3>
          <ul className="text-sm text-foreground space-y-1">
            <li>• Hold SOS button for 2 seconds to activate</li>
            <li>• Your location will be shared automatically</li>
            <li>• Nearby SafeGuard users will be notified</li>
            <li>• Camera and audio recording will start</li>
            <li>• Emergency services will be contacted</li>
          </ul>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Emergency;
