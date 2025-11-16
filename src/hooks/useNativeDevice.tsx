import { useState, useEffect } from 'react';
import { Device, DeviceInfo } from '@capacitor/device';
import { Network, ConnectionStatus } from '@capacitor/network';

export const useNativeDevice = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [networkStatus, setNetworkStatus] = useState<ConnectionStatus | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    let listenerHandle: any;

    const loadDeviceInfo = async () => {
      const info = await Device.getInfo();
      setDeviceInfo(info);

      const battery = await Device.getBatteryInfo();
      setBatteryLevel(battery.batteryLevel || null);

      const status = await Network.getStatus();
      setNetworkStatus(status);

      // Listen for network changes
      listenerHandle = await Network.addListener('networkStatusChange', (status) => {
        setNetworkStatus(status);
      });
    };

    loadDeviceInfo();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, []);

  const getDeviceId = async () => {
    const id = await Device.getId();
    return id.identifier;
  };

  const getBatteryInfo = async () => {
    const battery = await Device.getBatteryInfo();
    setBatteryLevel(battery.batteryLevel || null);
    return battery;
  };

  const getNetworkStatus = async () => {
    const status = await Network.getStatus();
    setNetworkStatus(status);
    return status;
  };

  return {
    deviceInfo,
    networkStatus,
    batteryLevel,
    getDeviceId,
    getBatteryInfo,
    getNetworkStatus,
  };
};
