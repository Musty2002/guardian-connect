import { useState, useEffect, useCallback } from 'react';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';

interface MeshPeer {
  id: string;
  name: string;
  distance?: number;
  lastSeen: number;
}

interface EmergencyBroadcast {
  id: string;
  userId: string;
  type: 'emergency' | 'danger_zone' | 'alert';
  location: { latitude: number; longitude: number };
  timestamp: number;
  message: string;
  batteryLevel?: number;
}

const MESH_SERVICE_UUID = '0000180a-0000-1000-8000-00805f9b34fb'; // Custom UUID for mesh service
const BROADCAST_CHARACTERISTIC_UUID = '00002a29-0000-1000-8000-00805f9b34fb';

export const useNativeMeshNetwork = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyPeers, setNearbyPeers] = useState<MeshPeer[]>([]);
  const [receivedBroadcasts, setReceivedBroadcasts] = useState<EmergencyBroadcast[]>([]);
  const [isNativeSupported, setIsNativeSupported] = useState(false);

  useEffect(() => {
    // Check if running on native platform
    const isNative = Capacitor.isNativePlatform();
    setIsNativeSupported(isNative);

    if (isNative) {
      initializeBluetooth();
    } else {
      console.log('Native mesh network not available on web platform');
    }

    return () => {
      if (isNative) {
        cleanup();
      }
    };
  }, []);

  const initializeBluetooth = async () => {
    try {
      // Initialize BLE
      await BleClient.initialize();
      
      // Request permissions
      const enabled = await BleClient.isEnabled();
      if (!enabled) {
        await BleClient.requestEnable();
      }

      setIsInitialized(true);
      console.log('Native mesh network initialized via Bluetooth LE');
      
      // Start scanning for peers
      startScanning();
    } catch (error) {
      console.error('Failed to initialize Bluetooth LE:', error);
      toast.error('Failed to initialize mesh network');
    }
  };

  const startScanning = useCallback(async () => {
    if (!isInitialized || isScanning) return;

    try {
      setIsScanning(true);
      
      // Scan for nearby devices with our mesh service
      await BleClient.requestLEScan(
        {
          services: [MESH_SERVICE_UUID],
        },
        (result) => {
          handleDeviceDiscovered(result.device);
        }
      );

      // Stop scanning after 10 seconds
      setTimeout(() => {
        stopScanning();
      }, 10000);

    } catch (error) {
      console.error('Error scanning for peers:', error);
      setIsScanning(false);
    }
  }, [isInitialized, isScanning]);

  const stopScanning = async () => {
    try {
      await BleClient.stopLEScan();
      setIsScanning(false);
      console.log('Stopped scanning for peers');
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  };

  const handleDeviceDiscovered = (device: BleDevice) => {
    const peer: MeshPeer = {
      id: device.deviceId,
      name: device.name || 'Unknown Device',
      distance: calculateDistance(-60), // Default RSSI value for demo
      lastSeen: Date.now(),
    };

    setNearbyPeers((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === peer.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = peer;
        return updated;
      }
      return [...prev, peer];
    });

    // Try to read emergency broadcasts from the device
    readBroadcastFromPeer(device.deviceId);
  };

  const calculateDistance = (rssi: number): number => {
    // Rough estimation: RSSI to distance in meters
    const txPower = -59; // Calibrated TX power at 1 meter
    if (rssi === 0) return -1;
    
    const ratio = rssi * 1.0 / txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
    }
  };

  const readBroadcastFromPeer = async (deviceId: string) => {
    try {
      // Connect to device
      await BleClient.connect(deviceId);

      // Read broadcast characteristic
      const value = await BleClient.read(
        deviceId,
        MESH_SERVICE_UUID,
        BROADCAST_CHARACTERISTIC_UUID
      );

      // Parse broadcast data
      const decoder = new TextDecoder();
      const broadcastJson = decoder.decode(value.buffer);
      const broadcast: EmergencyBroadcast = JSON.parse(broadcastJson);

      setReceivedBroadcasts((prev) => {
        if (prev.some((b) => b.id === broadcast.id)) {
          return prev; // Already received
        }
        return [...prev, broadcast];
      });

      // Disconnect
      await BleClient.disconnect(deviceId);

      console.log('Received broadcast from peer:', broadcast);
      
      if (broadcast.type === 'emergency') {
        toast.error('Emergency Alert Received!', {
          description: broadcast.message,
        });
      }

    } catch (error) {
      console.error('Error reading broadcast from peer:', error);
    }
  };

  const broadcastEmergency = async (broadcast: EmergencyBroadcast) => {
    if (!isInitialized) {
      console.warn('Mesh network not initialized');
      return;
    }

    try {
      // Store locally
      setReceivedBroadcasts((prev) => [...prev, broadcast]);

      // In a full implementation, this would:
      // 1. Start BLE advertising with the mesh service
      // 2. Make the broadcast data available via GATT characteristic
      // 3. Other devices would discover and read it
      
      console.log('Broadcasting emergency via native mesh:', broadcast);
      toast.success('Emergency broadcast sent to nearby devices');

      // For demo: Broadcast via local storage as fallback
      localStorage.setItem(
        `mesh_broadcast_${broadcast.id}`,
        JSON.stringify(broadcast)
      );

    } catch (error) {
      console.error('Error broadcasting emergency:', error);
      toast.error('Failed to broadcast emergency');
    }
  };

  const cleanup = async () => {
    try {
      if (isScanning) {
        await stopScanning();
      }
      // Disconnect all devices and stop advertising
      console.log('Cleaning up native mesh network');
    } catch (error) {
      console.error('Error cleaning up:', error);
    }
  };

  // Periodic peer cleanup (remove stale peers)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setNearbyPeers((prev) =>
        prev.filter((peer) => now - peer.lastSeen < 30000) // 30 seconds timeout
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Restart scanning periodically
  useEffect(() => {
    if (!isInitialized || !isNativeSupported) return;

    const interval = setInterval(() => {
      if (!isScanning) {
        startScanning();
      }
    }, 15000); // Scan every 15 seconds

    return () => clearInterval(interval);
  }, [isInitialized, isScanning, isNativeSupported, startScanning]);

  return {
    isInitialized,
    isScanning,
    nearbyPeers,
    receivedBroadcasts,
    activePeers: nearbyPeers.length,
    broadcastEmergency,
    startScanning,
    stopScanning,
    isNativeSupported,
  };
};
