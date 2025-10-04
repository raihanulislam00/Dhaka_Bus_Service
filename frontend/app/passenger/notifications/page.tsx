'use client';

import { useState, useEffect } from 'react';
import PassengerLayout from '../../components/PassengerLayout';
import { useNotifications, requestNotificationPermission, sendTestNotification } from '../../hooks/useNotifications';

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [user, setUser] = useState<any>(null);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  
  // Use custom notifications hook
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isConnected
  } = useNotifications({
    userId: user?.id || user?.username,
    enabled: realTimeEnabled
  });

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Notifications', count: notifications.length },
    { value: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { value: 'booking', label: 'Bookings', count: notifications.filter(n => n.type === 'booking').length },
    { value: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { value: 'travel', label: 'Travel Updates', count: notifications.filter(n => n.type === 'travel').length },
    { value: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
  ];

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }

    // Request notification permission
    requestNotificationPermission();

    // Load mock notifications for demo
    loadMockNotifications();
    setLoading(false);
  }, []);

  const loadMockNotifications = () => {
    // Add some mock notifications for demo
    const mockNotifications = [
      {
        title: 'Booking Confirmed! 🎉',
        message: 'Your ticket for Dhaka to Chittagong route has been confirmed. Departure: Tomorrow 8:00 AM',
        type: 'booking' as const,
        category: 'Booking Confirmation',
        relatedData: { bookingId: 'BK001', route: 'Dhaka to Chittagong', seat: 'A1' }
      },
      {
        title: 'Payment Successful 💳',
        message: 'Payment of ৳450 has been processed successfully via bKash. Transaction ID: TXN123456789',
        type: 'payment' as const,
        category: 'Payment Confirmation',
        relatedData: { amount: 450, method: 'bKash', transactionId: 'TXN123456789' }
      },
      {
        title: 'System Maintenance Notice 🔧',
        message: 'Our booking system will undergo maintenance on Friday, 11 PM - 1 AM. Online booking will be temporarily unavailable.',
        type: 'system' as const,
        category: 'System Notice',
        relatedData: { maintenanceStart: 'Friday 11 PM', maintenanceEnd: 'Friday 1 AM' }
      }
    ];

    // Add mock notifications with delay
    setTimeout(() => {
      mockNotifications.forEach((mockNotification, index) => {
        setTimeout(() => {
          addNotification(mockNotification);
        }, index * 1000);
      });
    }, 500);
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    switch (selectedFilter) {
      case 'unread':
        filtered = notifications.filter(n => !n.read);
        break;
      case 'booking':
        filtered = notifications.filter(n => n.type === 'booking');
        break;
      case 'payment':
        filtered = notifications.filter(n => n.type === 'payment');
        break;
      case 'travel':
        filtered = notifications.filter(n => n.type === 'travel');
        break;
      case 'system':
        filtered = notifications.filter(n => n.type === 'system');
        break;
      default:
        filtered = notifications;
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getNotificationIcon = (type: string) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case 'booking':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-blue-600`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"/>
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-green-600`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
            </svg>
          </div>
        );
      case 'travel':
        return (
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-orange-600`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-purple-600`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
          </div>
        );
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString();
  };

  // Simulate receiving new notifications
  const simulateNotification = () => {
    sendTestNotification(addNotification);
  };

  const toggleRealTime = () => {
    setRealTimeEnabled(!realTimeEnabled);
  };

  if (loading) {
    return (
      <PassengerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
        </div>
      </PassengerLayout>
    );
  }

  const filteredNotifications = getFilteredNotifications();

  return (
    <PassengerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Notifications</h1>
                <p className="text-purple-100 text-lg">Stay updated with your travel information</p>
                {unreadCount > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-200 font-semibold">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Real-time toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Real-time</span>
                  <button
                    onClick={toggleRealTime}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      realTimeEnabled ? 'bg-green-400' : 'bg-gray-400'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        realTimeEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Simulate notification button */}
                <button
                  onClick={simulateNotification}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Test Notification
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedFilter === option.value
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
                {option.count > 0 && (
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedFilter === option.value
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25"
            >
              Mark All Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {selectedFilter === 'all' 
                  ? "You're all caught up! No notifications to display."
                  : `No ${selectedFilter} notifications found.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  !notification.read 
                    ? 'border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/50' 
                    : 'border-gray-100'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 relative">
                      {getNotificationIcon(notification.type)}
                      {!notification.read && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`text-lg font-semibold ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.type === 'booking' ? 'bg-blue-100 text-blue-700' :
                              notification.type === 'payment' ? 'bg-green-100 text-green-700' :
                              notification.type === 'travel' ? 'bg-orange-100 text-orange-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {notification.category}
                            </span>
                          </div>

                          {/* Message */}
                          <p className={`text-sm mb-3 ${
                            !notification.read ? 'text-gray-700' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>

                          {/* Action Required Badge */}
                          {notification.actionRequired && (
                            <div className="inline-flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                              </svg>
                              <span>Action Required</span>
                            </div>
                          )}

                          {/* Metadata */}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{getTimeAgo(notification.timestamp)}</span>
                            {notification.relatedData && (
                              <>
                                <span>•</span>
                                {notification.relatedData?.bookingId && (
                                  <span>Booking: {notification.relatedData.bookingId}</span>
                                )}
                                {notification.relatedData?.transactionId && (
                                  <span>TXN: {notification.relatedData.transactionId}</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                              title="Mark as read"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete notification"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Real-time Status */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isConnected && realTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                Real-time notifications: {isConnected && realTimeEnabled ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              {isConnected && realTimeEnabled ? 'Connected to Pusher service' : 'Offline mode'}
            </div>
          </div>
        </div>
      </div>
    </PassengerLayout>
  );
}