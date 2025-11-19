import { useState, useEffect } from 'react';
import { Network, ConnectionStatus } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [isNativeSupported, setIsNativeSupported] = useState(false);

  useEffect(() => {
    setIsNativeSupported(Capacitor.isNativePlatform());
    
    if (Capacitor.isNativePlatform()) {
      initializeNetworkListener();
    } else {
      // Fallback to browser API
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const initializeNetworkListener = async () => {
    try {
      // Get initial status
      const status = await Network.getStatus();
      handleNetworkChange(status);

      // Listen for changes
      Network.addListener('networkStatusChange', handleNetworkChange);
    } catch (error) {
      console.error('Error initializing network listener:', error);
    }
  };

  const handleNetworkChange = (status: ConnectionStatus) => {
    setIsOnline(status.connected);
    setConnectionType(status.connectionType);
    console.log('Network status changed:', status);
  };

  const getCurrentStatus = async () => {
    if (Capacitor.isNativePlatform()) {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
      return status;
    }
    return { connected: navigator.onLine, connectionType: 'unknown' };
  };

  return {
    isOnline,
    connectionType,
    isNativeSupported,
    getCurrentStatus,
  };
};
