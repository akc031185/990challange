// Backend configuration for seamless demo -> production migration

export const BACKEND_CONFIG = {
  // Environment detection
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  USE_BACKEND: process.env.REACT_APP_USE_BACKEND === 'true',
  
  // API configuration
  API_BASE_URL: process.env.REACT_APP_API_URL || 'https://your-90-day-challenge.vercel.app/api',
  
  // Feature flags for gradual rollout
  FEATURES: {
    REAL_AUTH: process.env.REACT_APP_USE_BACKEND === 'true',
    CLOUD_SYNC: process.env.REACT_APP_USE_BACKEND === 'true',
    REAL_TEAMS: process.env.REACT_APP_USE_BACKEND === 'true',
    ANALYTICS: process.env.REACT_APP_USE_BACKEND === 'true',
  },
  
  // Demo mode configuration
  DEMO_MODE: {
    ENABLED: process.env.REACT_APP_USE_BACKEND !== 'true',
    MIGRATION_AVAILABLE: true, // Always allow users to upgrade
  }
};

// Helper to determine data source
export const getDataSource = (accessToken?: string | null) => {
  // If backend is disabled, always use demo
  if (!BACKEND_CONFIG.USE_BACKEND) {
    return 'demo';
  }
  
  // If no token or demo token, use demo
  if (!accessToken || accessToken.startsWith('demo_')) {
    return 'demo';
  }
  
  // Otherwise use backend
  return 'backend';
};

// API helper with automatic fallback
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  if (!BACKEND_CONFIG.USE_BACKEND) {
    throw new Error('Backend not available in demo mode');
  }
  
  const url = `${BACKEND_CONFIG.API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
};