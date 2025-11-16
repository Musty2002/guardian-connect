import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const useNativeHaptics = () => {
  const impact = async (style: ImpactStyle = ImpactStyle.Medium) => {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.log('Haptics not available');
    }
  };

  const notification = async (type: NotificationType = NotificationType.Success) => {
    try {
      await Haptics.notification({ type });
    } catch (error) {
      console.log('Haptics not available');
    }
  };

  const vibrate = async (duration: number = 100) => {
    try {
      await Haptics.vibrate({ duration });
    } catch (error) {
      console.log('Haptics not available');
    }
  };

  const selectionStart = async () => {
    try {
      await Haptics.selectionStart();
    } catch (error) {
      console.log('Haptics not available');
    }
  };

  const selectionChanged = async () => {
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      console.log('Haptics not available');
    }
  };

  const selectionEnd = async () => {
    try {
      await Haptics.selectionEnd();
    } catch (error) {
      console.log('Haptics not available');
    }
  };

  return {
    impact,
    notification,
    vibrate,
    selectionStart,
    selectionChanged,
    selectionEnd,
  };
};
