import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { App } from '@capacitor/app';

export const MobileOptimizations = () => {
  useEffect(() => {
    // Initialize Capacitor plugins for iOS
    const initializeCapacitor = async () => {
      try {
        // Set status bar style
        await StatusBar.setStyle({ style: Style.Default });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });

        // Configure keyboard
        await Keyboard.setAccessoryBarVisible({ isVisible: false });
        await Keyboard.setStyle({ style: 'dark' });
        await Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });

        // Handle app state changes
        App.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active?', isActive);
        });

      } catch (error) {
        console.log('Capacitor plugins not available - running in web mode');
      }
    };

    // Handle iOS safe area
    const updateSafeArea = () => {
      const safeAreaTop = getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)');
      if (safeAreaTop) {
        document.documentElement.style.setProperty('--safe-area-top', safeAreaTop);
      }
    };

    // Prevent pull-to-refresh on iOS (native apps don't need this but keeping for consistency)
    const preventPullToRefresh = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (touch.clientY > 0 && window.scrollY === 0) {
          e.preventDefault();
        }
      }
    };

    initializeCapacitor();
    updateSafeArea();
    
    document.addEventListener('touchstart', preventPullToRefresh, { passive: false });
    window.addEventListener('resize', updateSafeArea);

    return () => {
      document.removeEventListener('touchstart', preventPullToRefresh);
      window.removeEventListener('resize', updateSafeArea);
    };
  }, []);

  return null;
};