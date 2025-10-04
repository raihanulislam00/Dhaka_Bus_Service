'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  fullName?: string;
  name?: string;
  status?: string;
  mail?: string;
}

export const useAuth = (requiredUserType?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!hasInitialized) {
      checkAuth();
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  const checkAuth = () => {
    try {
      console.log('🔍 useAuth: Checking authentication...');
      
      const token = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');
      const userData = localStorage.getItem('user');

      console.log('🔍 useAuth: Auth data:', { 
        hasToken: !!token, 
        storedUserType, 
        hasUserData: !!userData,
        requiredUserType,
        currentPath: typeof window !== 'undefined' ? window.location.pathname : 'server'
      });

      if (!token || !storedUserType || !userData) {
        console.log('❌ useAuth: Missing auth data');
        setIsAuthenticated(false);
        setLoading(false);
        
        // Only redirect if we're not already on a login page and a user type is required
        if (requiredUserType && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          console.log(`🔄 useAuth: Redirecting to /${requiredUserType}/login`);
          router.push(`/${requiredUserType}/login`);
        }
        return;
      }

      if (requiredUserType && storedUserType !== requiredUserType) {
        console.log(`❌ useAuth: User type mismatch. Required: ${requiredUserType}, Stored: ${storedUserType}`);
        setIsAuthenticated(false);
        setLoading(false);
        
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          router.push(`/${requiredUserType}/login`);
        }
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ useAuth: Authentication successful', parsedUser);
        setUser(parsedUser);
        setUserType(storedUserType);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (parseError) {
        console.error('❌ useAuth: Error parsing user data:', parseError);
        setIsAuthenticated(false);
        setLoading(false);
        
        if (requiredUserType && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          console.log(`🔄 useAuth: Parse error, redirecting to /${requiredUserType}/login`);
          router.push(`/${requiredUserType}/login`);
        }
      }
      
    } catch (error) {
      console.error('❌ useAuth: Error checking authentication:', error);
      setIsAuthenticated(false);
      setLoading(false);
      
      if (requiredUserType && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        console.log(`🔄 useAuth: Error occurred, redirecting to /${requiredUserType}/login`);
        router.push(`/${requiredUserType}/login`);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return {
    user,
    userType,
    loading,
    isAuthenticated,
    logout,
    updateUser,
    checkAuth
  };
};