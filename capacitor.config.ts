import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.287323531c0546f7b52fd55fd1f81951',
  appName: 'SafeGuard Nigeria',
  webDir: 'dist',
  // Remove the server config for production builds
  // server: {
  //   url: 'https://28732353-1c05-46f7-b52f-d55fd1f81951.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#FFFFFF',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      iosSplashResourceName: 'Splash'
    }
  }
};

export default config;
