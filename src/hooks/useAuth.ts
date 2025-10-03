import { useState, useEffect, createContext, useContext } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  accessToken: string | null;
  isNewUser: boolean;
  markUserAsOnboarded: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Initialize demo users if they don't exist
    const existingUsers = localStorage.getItem('demo_users');
    if (!existingUsers) {
      const demoUsers = [
        {
          id: 'user_demo1',
          email: 'demo@example.com',
          password: 'password',
          name: 'Demo User',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('demo_users', JSON.stringify(demoUsers));
    }

    // Check for existing session
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setAccessToken(token);
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // For now, use simple local authentication for demo
      // This will be replaced with actual Supabase auth once the server is running
      
      // Check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      const user = existingUsers.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name
        };
        
        setUser(userData);
        setAccessToken('demo_token_' + user.id);
        setIsNewUser(false); // This is a returning user
        localStorage.setItem('access_token', 'demo_token_' + user.id);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Sign in failed' };
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // For now, use simple local storage for demo
      // This will be replaced with actual Supabase auth once the server is running
      
      const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      
      // Check if user already exists
      if (existingUsers.find((u: any) => u.email === email)) {
        return { success: false, error: 'User already exists with this email' };
      }
      
      const newUser = {
        id: 'user_' + Date.now(),
        email,
        password,
        name,
        createdAt: new Date().toISOString()
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('demo_users', JSON.stringify(existingUsers));
      
      // Automatically sign in the new user
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      };
      
      setUser(userData);
      setAccessToken('demo_token_' + newUser.id);
      setIsNewUser(true); // This is a new user who just signed up
      localStorage.setItem('access_token', 'demo_token_' + newUser.id);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Sign up failed' };
    }
  };

  const signOut = () => {
    setUser(null);
    setAccessToken(null);
    setIsNewUser(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  };

  const markUserAsOnboarded = () => {
    setIsNewUser(false);
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    accessToken,
    isNewUser,
    markUserAsOnboarded
  };
};

export { AuthContext };