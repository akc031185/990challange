import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

interface HealthData {
  calories: {
    burned: number;
    consumed: number;
  } | null;
  sleep: {
    hours: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  } | null;
  heartRate: {
    resting: number;
    active: number;
  } | null;
  steps: number | null;
}

interface HealthKitPermissions {
  calories: boolean;
  sleep: boolean;
  heartRate: boolean;
  steps: boolean;
}

export const useHealthKit = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    calories: null,
    sleep: null,
    heartRate: null,
    steps: null
  });
  const [permissions, setPermissions] = useState<HealthKitPermissions>({
    calories: false,
    sleep: false,
    heartRate: false,
    steps: false
  });
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    checkHealthKitAvailability();
  }, []);

  const checkHealthKitAvailability = async () => {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
      setIsAvailable(true);
      // Check existing permissions
      await checkPermissions();
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (!isAvailable) return false;

    try {
      setLoading(true);
      
      // For demo purposes, we'll simulate the HealthKit permissions
      // In a real app, you'd use @capacitor-community/health-kit plugin
      const mockPermissions = {
        calories: true,
        sleep: true,
        heartRate: true,
        steps: true
      };
      
      setPermissions(mockPermissions);
      localStorage.setItem('healthkit_permissions', JSON.stringify(mockPermissions));
      
      return true;
    } catch (error) {
      console.error('Failed to request HealthKit permissions:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    const stored = localStorage.getItem('healthkit_permissions');
    if (stored) {
      setPermissions(JSON.parse(stored));
    }
  };

  const fetchTodaysHealthData = async (): Promise<boolean> => {
    if (!isAvailable || !permissions.calories || !permissions.sleep) {
      return false;
    }

    try {
      setLoading(true);
      
      // For demo purposes, generate realistic health data
      // In a real app, you'd query HealthKit for today's data
      const today = new Date();
      const mockHealthData: HealthData = {
        calories: {
          burned: Math.floor(Math.random() * 800) + 1800, // 1800-2600 calories burned
          consumed: Math.floor(Math.random() * 600) + 1800 // 1800-2400 calories consumed
        },
        sleep: {
          hours: Math.random() * 3 + 6, // 6-9 hours
          quality: ['good', 'fair', 'excellent'][Math.floor(Math.random() * 3)] as any
        },
        heartRate: {
          resting: Math.floor(Math.random() * 20) + 60, // 60-80 bpm
          active: Math.floor(Math.random() * 40) + 120 // 120-160 bpm
        },
        steps: Math.floor(Math.random() * 8000) + 4000 // 4000-12000 steps
      };
      
      setHealthData(mockHealthData);
      
      // Cache the data for today
      const cacheKey = `healthkit_data_${today.toISOString().split('T')[0]}`;
      localStorage.setItem(cacheKey, JSON.stringify(mockHealthData));
      
      return true;
    } catch (error) {
      console.error('Failed to fetch HealthKit data:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCalorieGoal = (): number => {
    // Calculate suggested calorie goal based on burned calories
    if (healthData?.calories?.burned) {
      // Simple formula: maintenance calories = burned calories + 200-300
      return Math.round(healthData.calories.burned + 250);
    }
    return 2000; // Default
  };

  const getSleepRecommendation = (): string => {
    if (healthData?.sleep) {
      const hours = healthData.sleep.hours;
      if (hours < 6) return 'Try to get more sleep tonight';
      if (hours > 8) return 'Good sleep! Maybe aim for 7-8 hours';
      return 'Perfect sleep duration!';
    }
    return 'Track your sleep for personalized recommendations';
  };

  return {
    healthData,
    permissions,
    loading,
    isAvailable,
    requestPermissions,
    fetchTodaysHealthData,
    getCalorieGoal,
    getSleepRecommendation
  };
};