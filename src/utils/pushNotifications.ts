import { supabase } from '@/integrations/supabase/client';

export interface SendNotificationParams {
  title: string;
  body: string;
  userId?: string;
  token?: string;
  data?: Record<string, string>;
}

export const sendPushNotification = async (params: SendNotificationParams) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('send-push-notification', {
      body: params,
    });

    if (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }

    console.log('Push notification sent:', data);
    return data;
  } catch (error) {
    console.error('Failed to send push notification:', error);
    throw error;
  }
};

// Send notification to a specific user
export const notifyUser = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  return sendPushNotification({ userId, title, body, data });
};

// Send notification to a specific device token
export const notifyDevice = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  return sendPushNotification({ token, title, body, data });
};
