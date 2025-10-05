import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ninetydaychallenge.app',
  appName: '990 Challenge',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'NinetyDayChallenge',
    backgroundColor: '#16202c',  // Dark navy background
    allowsLinkPreview: false,
    scrollEnabled: true,
    disableLogs: false,
    minVersion: '14.0',
    preferredContentMode: 'mobile',
    presentationStyle: 'fullscreen',
    teamId: '5PCJV8QVA7'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#16202c',  // Dark navy to match theme
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',  // Dark status bar for dark theme
      backgroundColor: '#16202c'
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