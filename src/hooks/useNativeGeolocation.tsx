import { useState, useEffect } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { toast } from 'sonner';

export const useNativeGeolocation = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      setPosition(position);
      setLoading(false);
      return position;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      toast.error('Failed to get location');
      return null;
    }
  };

  const watchPosition = (callback: (position: Position) => void) => {
    const watchId = Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
      (position, err) => {
        if (err) {
          setError(err.message);
          toast.error('Location tracking error');
          return;
        }
        if (position) {
          setPosition(position);
          callback(position);
        }
      }
    );

    return watchId;
  };

  const clearWatch = async (watchId: string) => {
    await Geolocation.clearWatch({ id: watchId });
  };

  const checkPermissions = async () => {
    const permissions = await Geolocation.checkPermissions();
    return permissions.location;
  };

  const requestPermissions = async () => {
    const permissions = await Geolocation.requestPermissions();
    return permissions.location;
  };

  return {
    position,
    error,
    loading,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    checkPermissions,
    requestPermissions,
  };
};
