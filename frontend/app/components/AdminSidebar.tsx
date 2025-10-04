'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    
    if (userData && storedUserType === 'admin') {
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
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
        </svg>
      ),
      badge: null,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      href: '/admin/manage-drivers',
      label: 'Manage Drivers',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      badge: '12',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      href: '/admin/manage-passengers',
      label: 'Manage Passengers',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
        </svg>
      ),
      badge: '248',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      href: '/admin/routes',
      label: 'Manage Routes',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
        </svg>
      ),
      badge: '6',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      href: '/admin/schedules',
      label: 'Manage Schedules',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
        </svg>
      ),
      badge: '24',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      href: '/admin/reports',
      label: 'Reports & Analytics',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
        </svg>
      ),
      badge: null,
      gradient: 'from-teal-500 to-cyan-600'
    },
    {
      href: '/admin/settings',
      label: 'System Settings',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
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
        className={`fixed top-4 left-4 z-50 lg:hidden p-3 bg-slate-900/90 backdrop-blur-sm text-white rounded-xl shadow-lg transition-all duration-300 ${
          !isCollapsed ? 'translate-x-72' : 'translate-x-0'
        }`}
      >
        <svg className={`w-6 h-6 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
        </svg>
      </button>

      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 border-r border-white/10 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20 lg:w-20' : 'w-80 lg:w-80'
      } ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-400/5 to-purple-400/5 blur-3xl"></div>

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
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
                  <h1 className="text-white font-bold text-lg">Admin Portal</h1>
                  <p className="text-blue-200 text-sm">Dhaka Bus Service</p>
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{getGreeting()}</p>
                  <p className="text-white font-bold truncate">{user?.fullName || user?.username || 'Admin'}</p>
                  <p className="text-blue-200 text-xs">Administrator • Online</p>
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
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-blue-500/20`
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`relative flex-shrink-0 ${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`}>
                  {item.icon}
                  {item.badge && (
                    <span className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] text-xs font-bold rounded-full flex items-center justify-center ${
                      isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
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

        {/* Time & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {!isCollapsed && (
            <div className="text-center">
              <p className="text-white/60 text-xs">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-blue-300 text-sm font-mono">
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