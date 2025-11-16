import { useEffect, useState } from 'react';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { toast } from 'sonner';

export const useNativePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

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
