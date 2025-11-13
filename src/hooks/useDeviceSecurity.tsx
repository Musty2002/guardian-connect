import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeviceSecurity = (userId?: string) => {
  const [deviceStatus, setDeviceStatus] = useState<'active' | 'stolen' | 'recovered'>('active');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    // Fetch current device status
    const fetchDeviceStatus = async () => {
      const { data } = await supabase
        .from('device_tracking')
        .select('device_status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setDeviceStatus(data.device_status as any);
      }
    };

    fetchDeviceStatus();
  }, [userId]);

  const markAsStolen = async () => {
    if (!userId) return;

    try {
      // Get current location
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          // Insert tracking record with stolen status
          const { error } = await supabase.from('device_tracking').insert({
            user_id: userId,
            latitude,
            longitude,
            accuracy,
            battery_level: await getBatteryLevel(),
            network_info: await getNetworkInfo(),
            device_status: 'stolen',
          });

          if (error) throw error;

          // Log security event
          await supabase.from('device_security_events').insert({
            user_id: userId,
            event_type: 'marked_as_stolen',
            event_data: { timestamp: new Date().toISOString() },
          });

          setDeviceStatus('stolen');
          startIntensiveTracking();

          toast({
            title: "Device marked as stolen",
            description: "Intensive tracking mode activated. Your family has been notified.",
          });
        });
      }
    } catch (error) {
      console.error('Error marking device as stolen:', error);
      toast({
        title: "Error",
        description: "Failed to mark device as stolen. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markAsRecovered = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase.from('device_tracking').insert({
        user_id: userId,
        latitude: 0,
        longitude: 0,
        device_status: 'recovered',
      });

      if (error) throw error;

      await supabase.from('device_security_events').insert({
        user_id: userId,
        event_type: 'marked_as_recovered',
        event_data: { timestamp: new Date().toISOString() },
      });

      setDeviceStatus('recovered');
      stopIntensiveTracking();

      toast({
        title: "Device marked as recovered",
        description: "Tracking has returned to normal mode.",
      });
    } catch (error) {
      console.error('Error marking device as recovered:', error);
    }
  };

  const startIntensiveTracking = () => {
    if (isTracking) return;

    setIsTracking(true);

    // Track location every 5 minutes
    const interval = window.setInterval(() => {
      trackLocation();
    }, 5 * 60 * 1000); // 5 minutes

    setTrackingInterval(interval);

    // Track immediately
    trackLocation();
  };

  const stopIntensiveTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }
    setIsTracking(false);
  };

  const trackLocation = async () => {
    if (!userId) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        await supabase.from('device_tracking').insert({
          user_id: userId,
          latitude,
          longitude,
          accuracy,
          battery_level: await getBatteryLevel(),
          network_info: await getNetworkInfo(),
          device_status: deviceStatus,
        });
      });
    }
  };

  const logSecurityEvent = async (eventType: string, eventData?: any) => {
    if (!userId) return;

    await supabase.from('device_security_events').insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData || {},
    });
  };

  const exportData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('export-user-data');

      if (error) throw error;

      // Create blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `safeguard-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: "Your backup file has been downloaded.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    deviceStatus,
    isTracking,
    markAsStolen,
    markAsRecovered,
    trackLocation,
    logSecurityEvent,
    exportData,
  };
};

// Helper functions
const getBatteryLevel = async (): Promise<number | null> => {
  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      return Math.round(battery.level * 100);
    } catch {
      return null;
    }
  }
  return null;
};

const getNetworkInfo = async (): Promise<any> => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
    };
  }
  
  return null;
};
