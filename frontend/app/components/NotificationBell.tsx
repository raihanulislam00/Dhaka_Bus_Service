'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationBellProps {
  userId?: string;
  className?: string;
  showPreview?: boolean;
}

export default function NotificationBell({ 
  userId, 
  className = "relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200",
  showPreview = false 
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    isConnected
  } = useNotifications({
    userId: userId || user?.id || user?.username,
    enabled: true
  });

  useEffect(() => {
    // Get user data from localStorage if not provided
    if (!userId) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [userId]);

  const recentNotifications = notifications
    .filter(n => !n.read)
    .slice(0, 5)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return time.toLocaleDateString();
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'text-blue-600 bg-blue-50';
      case 'payment':
        return 'text-green-600 bg-green-50';
      case 'travel':
        return 'text-orange-600 bg-orange-50';
      case 'system':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={className}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
        </svg>
        
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection status indicator */}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
          isConnected ? 'bg-green-500' : 'bg-gray-400'
        }`}></div>
      </button>

      {/* Dropdown Preview */}
      {showPreview && isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-20 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                  <Link
                    href="/passenger/notifications"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    View All
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">No new notifications</p>
                </div>
              ) : (
                recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      markAsRead(notification.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Type indicator */}
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.type === 'booking' ? 'bg-blue-500' :
                        notification.type === 'payment' ? 'bg-green-500' :
                        notification.type === 'travel' ? 'bg-orange-500' :
                        'bg-purple-500'
                      }`}></div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationTypeColor(notification.type)}`}>
                            {notification.category}
                          </span>
                          
                          {notification.actionRequired && (
                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                              Action Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {recentNotifications.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100">
                <Link
                  href="/passenger/notifications"
                  className="block w-full text-center text-indigo-600 hover:text-indigo-700 font-medium text-sm py-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Simplified version for mobile
export function NotificationBellMobile({ userId, unreadCount: externalCount }: { 
  userId?: string; 
  unreadCount?: number;
}) {
  const { unreadCount: hookCount } = useNotifications({
    userId,
    enabled: true
  });

  const count = externalCount !== undefined ? externalCount : hookCount;

  return (
    <Link
      href="/passenger/notifications"
      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
      </svg>
      
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}