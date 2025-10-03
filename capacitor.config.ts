import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ninetydaychallenge.app',
  appName: '90-Day Challenge',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'NinetyDayChallenge',
    backgroundColor: '#ffffff',
    allowsLinkPreview: false,
    scrollEnabled: true,
    disableLogs: false,
    minVersion: '14.0',
    preferredContentMode: 'mobile',
    presentationStyle: 'fullscreen'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff'
    },
    Keyboard: {
      resize: 'ionic',
      style: 'dark',
      resizeOnFullScreen: true
    },
    App: {
      deepLinkingEnabled: false
    },
    Haptics: {},
    Device: {},
    Share: {}
  }
};

export default config;