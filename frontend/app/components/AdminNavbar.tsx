'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface AdminNavbarProps {
  username?: string;
}

export default function AdminNavbar({ username }: AdminNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3); // Mock notification count

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    
    if (userData && storedUserType === 'admin') {
      setUser(JSON.parse(userData));
    }

    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    
    // Redirect to home page
    router.push('/');
  };

  const navLinks = [
    { 
      href: '/admin/dashboard', 
      label: 'Dashboard',
      shortLabel: 'Dashboard',
      badge: null,
      gradient: 'from-blue-500 to-blue-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
        </svg>
      )
    },
    { 
      href: '/admin/manage-drivers', 
      label: 'Drivers',
      shortLabel: 'Drivers',
      badge: '12',
      gradient: 'from-emerald-500 to-green-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    { 
      href: '/admin/manage-passengers', 
      label: 'Passengers',
      shortLabel: 'Passengers', 
      badge: '248',
      gradient: 'from-purple-500 to-indigo-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
        </svg>
      )
    },
    { 
      href: '/admin/routes', 
      label: 'Routes',
      shortLabel: 'Routes',
      badge: '6',
      gradient: 'from-orange-500 to-red-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
        </svg>
      )
    },
    { 
      href: '/admin/schedules', 
      label: 'Schedules',
      shortLabel: 'Schedules',
      badge: '24',
      gradient: 'from-cyan-500 to-blue-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
        </svg>
      )
    },
    { 
      href: '/admin/reports', 
      label: 'Reports',
      shortLabel: 'Reports',
      badge: null,
      gradient: 'from-teal-500 to-cyan-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h2a2 2 0 002-2V3a2 2 0 012 2v6h-3a4 4 0 01-8 0H4V5z" clipRule="evenodd"/>
        </svg>
      )
    },
    { 
      href: '/admin/settings', 
      label: 'Settings',
      shortLabel: 'Settings',
      badge: null,
      gradient: 'from-gray-500 to-slate-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
        </svg>
      )
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl backdrop-blur-sm border-b border-white/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="bg-white text-white p-4 rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-blue-500/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Image 
                    src="/logo.svg" 
                    alt="Dhaka Bus Service Logo" 
                    width={32} 
                    height={32}
                    className="w-8 h-8 relative z-10"
                  />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="group-hover:translate-x-2 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold text-2xl tracking-wide bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Admin Portal
                  </span>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-blue-200 text-sm font-medium">Dhaka Bus Service</p>
                  <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">
                    {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-2">
            {navLinks.slice(0, 5).map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative group px-4 py-3 rounded-2xl text-sm font-semibold flex items-center space-x-3 transition-all duration-500 hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg shadow-blue-500/30`
                      : 'text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`relative ${isActive ? 'animate-bounce' : 'group-hover:rotate-12'} transition-transform duration-300`}>
                    {link.icon}
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    )}
                  </div>
                  <span className="hidden xl:block">{link.shortLabel}</span>
                  {link.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center animate-pulse">
                      {link.badge}
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-white rounded-full"></div>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              );
            })}
          </div>

          {/* Compact Navigation for Large screens */}
          <div className="hidden lg:flex xl:hidden items-center space-x-1">
            {navLinks.slice(0, 4).map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative group p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isActive
                      ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg`
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title={link.label}
                >
                  <div className={`${isActive ? 'animate-pulse' : 'group-hover:rotate-12'} transition-transform duration-300`}>
                    {link.icon}
                  </div>
                  {link.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                      {parseInt(link.badge) > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu & Notifications */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 group">
              <svg className="w-6 h-6 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center animate-pulse font-bold shadow-lg">
                  {notifications}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="hidden xl:block">
                  <div className="flex items-center space-x-2">
                    <p className="text-white text-sm font-bold">{getGreeting()}</p>
                    <span className="text-yellow-300">👋</span>
                  </div>
                  <p className="text-white/90 text-base font-semibold">{user?.fullName || user?.username || username || 'Admin'}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-blue-200 text-xs">Administrator</p>
                    <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                    <p className="text-blue-200 text-xs">Online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Logout Button */}
            <button
              onClick={handleLogout}
              className="group relative bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm text-white hover:from-red-500 hover:to-pink-500 px-6 py-3 rounded-2xl font-semibold transition-all duration-500 border border-red-500/30 hover:border-red-400 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 flex items-center space-x-3"
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
              </svg>
              <span className="hidden xl:block">Logout</span>
              
              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Notification */}
            <button className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative group text-white hover:bg-white/10 focus:outline-none p-3 rounded-2xl transition-all duration-300 hover:scale-110"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-1'}`}></span>
                <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'translate-y-2.5'}`}></span>
                <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-4'}`}></span>
              </div>
              
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden animate-fade-in-up">
            <div className="px-6 pt-4 pb-8 bg-gradient-to-b from-slate-800 via-purple-900 to-slate-900 backdrop-blur-xl border-t border-white/10 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              {/* User Profile Section */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl mb-6 border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-white text-lg font-bold">{getGreeting()}</p>
                      <span className="text-yellow-300">👋</span>
                    </div>
                    <p className="text-white/90 text-xl font-semibold">{user?.fullName || user?.username || username || 'Admin'}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-blue-200 text-sm">Administrator</p>
                      <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                      <p className="text-blue-200 text-sm">Online</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-3 mb-6">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`group relative block px-6 py-4 rounded-2xl font-semibold transition-all duration-500 ${
                        isActive
                          ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg transform scale-105`
                          : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`relative ${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`}>
                          {link.icon}
                          {link.badge && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center animate-bounce">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-lg">{link.label}</span>
                      </div>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  );
                })}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full group relative bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm hover:from-red-500 hover:to-pink-500 text-white px-6 py-4 rounded-2xl text-lg font-semibold transition-all duration-500 border border-red-500/30 hover:border-red-400 flex items-center justify-center space-x-3 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                </svg>
                <span>Logout</span>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              {/* Time Display */}
              <div className="text-center mt-6 pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-blue-300 text-lg font-mono">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}