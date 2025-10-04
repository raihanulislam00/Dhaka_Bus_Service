'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface PassengerSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function PassengerSidebar({ isCollapsed = false, onToggle }: PassengerSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    
    if (userData && storedUserType === 'passenger') {
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
      href: '/passenger/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
        </svg>
      ),
      badge: null,
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      href: '/passenger/book-ticket',
      label: 'Book Ticket',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"/>
        </svg>
      ),
      badge: 'New',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      href: '/passenger/my-tickets',
      label: 'My Tickets',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h2a2 2 0 002-2V3a2 2 0 012 2v6h-3a4 4 0 01-8 0H4V5z" clipRule="evenodd"/>
        </svg>
      ),
      badge: '3',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      href: '/passenger/route-maps',
      label: 'Route Maps',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"/>
        </svg>
      ),
      badge: null,
      gradient: 'from-orange-500 to-red-600'
    },
    {
      href: '/passenger/notifications',
      label: 'Notifications',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
        </svg>
      ),
      badge: '2',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      href: '/passenger/profile',
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
        className={`fixed top-4 left-4 z-50 lg:hidden p-3 bg-indigo-900/90 backdrop-blur-sm text-white rounded-xl shadow-lg transition-all duration-300 ${
          !isCollapsed ? 'translate-x-72' : 'translate-x-0'
        }`}
      >
        <svg className={`w-6 h-6 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
        </svg>
      </button>

      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 border-r border-white/10 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20 lg:w-20' : 'w-80 lg:w-80'
      } ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-indigo-600/10 to-pink-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-purple-400/5 to-pink-400/5 blur-3xl"></div>

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link href="/passenger/dashboard" className="flex items-center space-x-3 group">
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
                  <h1 className="text-white font-bold text-lg">Passenger Portal</h1>
                  <p className="text-purple-200 text-sm">Dhaka Bus Service</p>
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
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-indigo-900 animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{getGreeting()}</p>
                  <p className="text-white font-bold truncate">{user?.fullName || user?.username || 'Passenger'}</p>
                  <p className="text-purple-200 text-xs">Passenger • Active</p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Link 
                  href="/passenger/book-ticket" 
                  className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/40 hover:to-cyan-500/40 rounded-lg p-2 text-center transition-all duration-300 border border-blue-500/30"
                >
                  <p className="text-white text-sm font-bold">Book Now</p>
                  <p className="text-blue-200 text-xs">Quick Booking</p>
                </Link>
                <Link 
                  href="/passenger/my-tickets" 
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/40 hover:to-emerald-500/40 rounded-lg p-2 text-center transition-all duration-300 border border-green-500/30"
                >
                  <p className="text-white text-sm font-bold">3</p>
                  <p className="text-green-200 text-xs">Active Tickets</p>
                </Link>
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
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-purple-500/20`
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`relative flex-shrink-0 ${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`}>
                  {item.icon}
                  {item.badge && (
                    <span className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] text-xs font-bold rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'bg-white text-purple-600' 
                        : item.badge === 'New'
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                        : 'bg-red-500 text-white'
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

        {/* Quick Travel Info */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {!isCollapsed && (
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-3 border border-purple-500/30">
              <div className="text-center">
                <p className="text-white text-sm font-semibold">Next Trip</p>
                <p className="text-purple-300 text-xs">Tomorrow • Dhaka to Chittagong</p>
                <p className="text-purple-300 text-xs">8:00 AM • Seat A1</p>
              </div>
            </div>
          )}

          {!isCollapsed && (
            <div className="text-center">
              <p className="text-white/60 text-xs">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-purple-300 text-sm font-mono">
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