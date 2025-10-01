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
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');
      const userData = localStorage.getItem('user');

      if (!token || !storedUserType || !userData) {
        setIsAuthenticated(false);
        setLoading(false);
        if (requiredUserType) {
          router.push(`/${requiredUserType}/login`);
        }
        return;
      }

      if (requiredUserType && storedUserType !== requiredUserType) {
        setIsAuthenticated(false);
        setLoading(false);
        router.push(`/${requiredUserType}/login`);
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUserType(storedUserType);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      if (requiredUserType) {
        router.push(`/${requiredUserType}/login`);
      }
    } finally {
      setLoading(false);
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