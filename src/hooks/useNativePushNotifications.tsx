import { useEffect, useState } from 'react';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Capacitor } from '@capacitor/core';

export const useNativePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const saveFCMToken = async (fcmToken: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const deviceType = Capacitor.getPlatform();
      
      // Check if token already exists
      const { data: existing } = await supabase
        .from('fcm_tokens')
        .select('id')
        .eq('token', fcmToken)
        .single();

      if (!existing) {
        // Insert new token
        const { error } = await supabase
          .from('fcm_tokens')
          .insert({
            user_id: user.id,
            token: fcmToken,
            device_type: deviceType,
          });

        if (error) {
          console.error('Error saving FCM token:', error);
        } else {
          console.log('FCM token saved successfully');
        }
      } else {
        console.log('FCM token already exists');
      }
    } catch (error) {
      console.error('Error in saveFCMToken:', error);
    }
  };

  const initializePushNotifications = async () => {
    try {
      // Request permission
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        await PushNotifications.register();
        setIsRegistered(true);
      } else {
        toast.error('Push notification permission denied');
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  };

  useEffect(() => {
    // On success, get token
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      setToken(token.value);
      saveFCMToken(token.value);
    });

    // Error listener
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Show notification when app is in foreground
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
      toast.info(notification.title || 'New notification', {
        description: notification.body,
      });
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push notification action performed', notification);
    });

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, []);

  const sendLocalNotification = async (title: string, body: string) => {
    try {
      await PushNotifications.createChannel({
        id: 'safeguard',
        name: 'SafeGuard Alerts',
        importance: 5,
        visibility: 1,
      });

      // Note: Local notifications require a separate plugin
      // This is a placeholder for the structure
      console.log('Local notification:', title, body);
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  };

  return {
    token,
    isRegistered,
    initializePushNotifications,
    sendLocalNotification,
  };
};
