'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType: 'passenger' | 'admin' | 'driver';
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, requiredUserType, fallback }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('🛡️ AuthGuard: Checking authentication...');
        
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        const userData = localStorage.getItem('user');

        console.log('🛡️ AuthGuard: Auth data:', { 
          hasToken: !!token, 
          userType, 
          hasUserData: !!userData,
          requiredUserType 
        });

        if (!token || !userType || !userData) {
          console.log('🛡️ AuthGuard: Missing auth data, redirecting to login');
          router.push(`/${requiredUserType}/login`);
          return;
        }

        if (userType !== requiredUserType) {
          console.log('🛡️ AuthGuard: Wrong user type, redirecting');
          router.push(`/${requiredUserType}/login`);
          return;
        }

        // Verify user data is valid JSON
        JSON.parse(userData);
        
        console.log('🛡️ AuthGuard: Authentication successful');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('🛡️ AuthGuard: Auth check failed:', error);
        router.push(`/${requiredUserType}/login`);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure localStorage is available
    setTimeout(checkAuth, 100);
  }, [requiredUserType, router]);

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}