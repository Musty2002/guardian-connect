import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const useNativeLocalNotifications = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isNativeSupported, setIsNativeSupported] = useState(false);

  useEffect(() => {
    setIsNativeSupported(Capacitor.isNativePlatform());
    
    if (Capacitor.isNativePlatform()) {
      checkPermissions();
    }
  }, []);

  const checkPermissions = async () => {
    try {
      const result = await LocalNotifications.checkPermissions();
      setPermissionGranted(result.display === 'granted');
    } catch (error) {
      console.error('Error checking notification permissions:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const result = await LocalNotifications.requestPermissions();
      const granted = result.display === 'granted';
      setPermissionGranted(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const scheduleEmergencyNotification = async (
    title: string,
    body: string,
    data?: any
  ) => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Local notifications only work on native platforms');
      return;
    }

    try {
      if (!permissionGranted) {
        const granted = await requestPermissions();
        if (!granted) {
          throw new Error('Notification permission not granted');
        }
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) }, // 1 second delay
            sound: 'default',
            attachments: undefined,
            actionTypeId: '',
            extra: data,
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#FF0000',
          },
        ],
      });

      console.log('Emergency notification scheduled');
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const scheduleInstantNotification = async (
    title: string,
    body: string,
    data?: any
  ) => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Local notifications only work on native platforms');
      return;
    }

    try {
      if (!permissionGranted) {
        const granted = await requestPermissions();
        if (!granted) {
          throw new Error('Notification permission not granted');
        }
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 100) },
            sound: 'default',
            attachments: undefined,
            actionTypeId: '',
            extra: data,
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#FF0000',
          },
        ],
      });
    } catch (error) {
      console.error('Error scheduling instant notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await LocalNotifications.cancel({
        notifications: await LocalNotifications.getPending().then(r => r.notifications),
      });
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  };

  return {
    isNativeSupported,
    permissionGranted,
    requestPermissions,
    scheduleEmergencyNotification,
    scheduleInstantNotification,
    cancelAllNotifications,
  };
};
