import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App, AppState } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [appState, setAppState] = useState<AppState>({ isActive: true });

  useEffect(() => {
    const native = Capacitor.isNativePlatform();
    setIsNative(native);

    // Only set up native listeners on iOS/Android (not in browser)
    if (!native) {
      return; // Skip listener setup in browser
    }

    // Listen for app state changes (iOS/Android only)
    const appStateListener = App.addListener('appStateChange', (state) => {
      setAppState(state);
    });

    // Handle back button on Android
    const backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });

    return () => {
      // Cleanup listeners (only runs on iOS/Android)
      appStateListener.then(listener => listener.remove());
      backButtonListener.then(listener => listener.remove());
    };
  }, []);

  const triggerHapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.log('Haptics not available');
      }
    }
  };

  const exitApp = async () => {
    if (isNative) {
      await App.exitApp();
    }
  };

  const shareContent = async (shareData: {
    title?: string;
    text?: string;
    url?: string;
    dialogTitle?: string;
    files?: File[];
  }) => {
    try {
      // Try native sharing first
      if (isNative) {
        await Share.share({
          title: shareData.title || '',
          text: shareData.text || '',
          url: shareData.url || '',
          dialogTitle: shareData.dialogTitle || 'Share'
        });
        return true;
      }
      
      // Web sharing API fallback
      if (navigator.share && shareData.files) {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          files: shareData.files
        });
        return true;
      } else if (navigator.share) {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url
        });
        return true;
      }
      
      return false; // No sharing available, caller should handle fallback
    } catch (error) {
      console.log('Sharing failed:', error);
      return false;
    }
  };

  return {
    isNative,
    appState,
    triggerHapticFeedback,
    exitApp,
    shareContent,
    platform: Capacitor.getPlatform()
  };
};