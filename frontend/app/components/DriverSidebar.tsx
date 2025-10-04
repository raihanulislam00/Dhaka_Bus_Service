'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface DriverSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function DriverSidebar({ isCollapsed = false, onToggle }: DriverSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    
    if (userData && storedUserType === 'driver') {
      setUser(JSON.parse(userData));
    }

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    router.push('/');
  };

  const sidebarItems = [
    {
      href: '/driver/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
        </svg>
      ),
      badge: null,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      href: '/driver/routes',
      label: 'My Routes',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
        </svg>
      ),
      badge: '3',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      href: '/driver/schedules',
      label: 'My Schedules',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
        </svg>
      ),
      badge: '8',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      href: '/driver/trips',
      label: 'My Trips',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
        </svg>
      ),
      badge: '5',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      href: '/driver/earnings',
      label: 'Earnings',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
        </svg>
      ),
      badge: null,
      gradient: 'from-teal-500 to-cyan-600'
    },
    {
      href: '/driver/profile',
      label: 'My Profile',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
        </svg>
      ),
      badge: null,
      gradient: 'from-gray-500 to-slate-600'
    }
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className={`fixed top-4 left-4 z-50 lg:hidden p-3 bg-emerald-900/90 backdrop-blur-sm text-white rounded-xl shadow-lg transition-all duration-300 ${
          !isCollapsed ? 'translate-x-72' : 'translate-x-0'
        }`}
      >
        <svg className={`w-6 h-6 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
        </svg>
      </button>

      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-emerald-900 via-green-900 to-teal-900 border-r border-white/10 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20 lg:w-20' : 'w-80 lg:w-80'
      } ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-600/10 via-emerald-600/10 to-teal-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-green-400/5 to-emerald-400/5 blur-3xl"></div>

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link href="/driver/dashboard" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 p-1">
                  <Image 
                    src="/logo.svg" 
                    alt="Dhaka Bus Service Logo" 
                    width={40} 
                    height={40}
                    className="w-10 h-10"
                  />
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">Driver Portal</h1>
                  <p className="text-green-200 text-sm">Dhaka Bus Service</p>
                </div>
              </Link>
            )}
            
            {isCollapsed && (
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg mx-auto p-1">
                <Image 
                  src="/logo.svg" 
                  alt="Dhaka Bus Service Logo" 
                  width={40} 
                  height={40}
                  className="w-10 h-10"
                />
              </div>
            )}

            <button
              onClick={onToggle}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-6 border-b border-white/10">
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-emerald-900 animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{getGreeting()}</p>
                  <p className="text-white font-bold truncate">{user?.fullName || user?.username || 'Driver'}</p>
                  <p className="text-green-200 text-xs">Driver • On Duty</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <p className="text-white text-lg font-bold">5</p>
                  <p className="text-green-200 text-xs">Today's Trips</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <p className="text-white text-lg font-bold">৳2,400</p>
                  <p className="text-green-200 text-xs">Today's Earning</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-green-500/20`
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`relative flex-shrink-0 ${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`}>
                  {item.icon}
                  {item.badge && (
                    <span className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] text-xs font-bold rounded-full flex items-center justify-center ${
                      isActive ? 'bg-white text-green-600' : 'bg-red-500 text-white'
                    } ${isCollapsed ? 'animate-bounce' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <span className="font-medium flex-1">{item.label}</span>
                )}

                {!isCollapsed && isActive && (
                  <div className="flex-shrink-0 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className={`absolute ${isCollapsed ? 'right-0 top-1/2 transform -translate-y-1/2 translate-x-1' : 'right-2 top-1/2 transform -translate-y-1/2'} w-1 h-8 bg-white rounded-full`}></div>
                )}

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            );
          })}
        </div>

        {/* Time & Status */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {!isCollapsed && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-3 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-semibold">Status</p>
                  <p className="text-green-300 text-xs">On Duty</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {!isCollapsed && (
            <div className="text-center">
              <p className="text-white/60 text-xs">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-green-300 text-sm font-mono">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full group bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500 hover:to-pink-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 border border-red-500/30 hover:border-red-400 ${
              isCollapsed ? 'p-3' : 'px-4 py-3'
            } flex items-center ${isCollapsed ? 'justify-center' : 'justify-center space-x-2'}`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
            </svg>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}