import { useEffect } from 'react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

export const useNativeApp = (onUrlOpen?: (url: string) => void) => {
  useEffect(() => {
    let urlListenerHandle: any;
    let stateListenerHandle: any;
    let backButtonListenerHandle: any;

    const initialize = async () => {
      // Configure status bar
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
      } catch (error) {
        console.log('Status bar configuration not available');
      }

      // Handle app URL open events (deep links)
      urlListenerHandle = await App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        console.log('App opened with URL:', event.url);
        if (onUrlOpen) {
          onUrlOpen(event.url);
        }
      });

      // Handle app state changes
      stateListenerHandle = await App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active:', isActive);
      });

      // Handle back button
      backButtonListenerHandle = await App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });
    };

    initialize();

    return () => {
      if (urlListenerHandle) urlListenerHandle.remove();
      if (stateListenerHandle) stateListenerHandle.remove();
      if (backButtonListenerHandle) backButtonListenerHandle.remove();
    };
  }, [onUrlOpen]);

  const exitApp = () => {
    App.exitApp();
  };

  const getAppInfo = async () => {
    const info = await App.getInfo();
    return info;
  };

  return {
    exitApp,
    getAppInfo,
  };
};
