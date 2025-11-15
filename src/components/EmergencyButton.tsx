import { useState } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EmergencyButtonProps {
  onEmergencyActivate: () => void;
}

export const EmergencyButton = ({ onEmergencyActivate }: EmergencyButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handlePressStart = () => {
    setIsPressed(true);
    const timer = setTimeout(() => {
      onEmergencyActivate();
      toast({
        title: "Emergency Mode Activated",
        description: "Alerting nearby users and authorities...",
        variant: "destructive",
      });
    }, 2000); // Hold for 2 seconds
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        className={`relative w-52 h-52 rounded-full transition-all duration-300 ${
          isPressed
            ? "bg-gradient-to-br from-emergency to-emergency/80 scale-90 shadow-2xl"
            : "bg-gradient-to-br from-emergency to-emergency/90 hover:scale-105 shadow-xl hover:shadow-2xl"
        }`}
        style={{
          boxShadow: isPressed ? '0 0 60px rgba(239, 68, 68, 0.6)' : '0 20px 60px rgba(239, 68, 68, 0.3)'
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isPressed ? (
            <AlertTriangle className="w-24 h-24 text-emergency-foreground animate-pulse" strokeWidth={2.5} />
          ) : (
            <Shield className="w-24 h-24 text-emergency-foreground" strokeWidth={2.5} />
          )}
          <span className="text-emergency-foreground font-extrabold text-2xl mt-3 tracking-wider">
            {isPressed ? "HOLD..." : "SOS"}
          </span>
        </div>
        {isPressed && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-emergency-foreground/20 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
          </>
        )}
        {!isPressed && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
        )}
      </button>
      <div className="text-center space-y-1 max-w-xs">
        <p className="text-foreground font-semibold text-base">
          Emergency SOS
        </p>
        <p className="text-muted-foreground text-sm">
          Press and hold for 2 seconds to activate
        </p>
      </div>
    </div>
  );
};
