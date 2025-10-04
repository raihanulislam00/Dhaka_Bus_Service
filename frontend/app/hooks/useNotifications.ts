'use client';

import { useEffect, useState, useRef } from 'react';
import { pusherService, NotificationData } from '../lib/pusher';

interface UseNotificationsProps {
  userId?: string;
  enabled?: boolean;
}

interface NotificationHook {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Partial<Notification>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  isConnected: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'booking' | 'payment' | 'travel' | 'system';
  read: boolean;
  timestamp: string;
  category: string;
  actionRequired?: boolean;
  relatedData?: any;
}

export function useNotifications({ userId, enabled = true }: UseNotificationsProps = {}): NotificationHook {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventListenersRef = useRef<(() => void)[]>([]);
  const pusherInitialized = useRef(false);

  useEffect(() => {
    if (!enabled || !userId) return;

    // Initialize Pusher connection
    initializePusherConnection(userId);

    // Cleanup function
    return () => {
      cleanupEventListeners();
    };
  }, [userId, enabled]);

  const initializePusherConnection = (userId: string) => {
    if (pusherInitialized.current) return;

    try {
      // Subscribe to booking notifications
      pusherService.subscribeToBookingNotifications(userId);
      setIsConnected(true);
      pusherInitialized.current = true;

      // Setup event listeners
      setupEventListeners();
      
    } catch (error) {
      console.error('Failed to initialize Pusher connection:', error);
      setIsConnected(false);
    }
  };

  const setupEventListeners = () => {
    // Clear existing listeners
    cleanupEventListeners();

    // Notification received listener
    const handleNotificationReceived = (event: Event) => {
      const customEvent = event as CustomEvent;
      const notificationData = customEvent.detail;
      addNotification(notificationData);
    };

    // Bus location update listener
    const handleBusLocationUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { busId, location, estimatedTime } = customEvent.detail;
      
      addNotification({
        title: 'Bus Location Update 🚌',
        message: `Your bus is approaching! Estimated arrival: ${estimatedTime}`,
        type: 'travel',
        category: 'Bus Tracking',
        actionRequired: false,
        relatedData: { busId, location, estimatedTime }
      });
    };

    // Bus status change listener
    const handleBusStatusChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { busId, status, message } = customEvent.detail;
      
      let notificationType: 'success' | 'warning' | 'error' | 'info' = 'info';
      let icon = '';
      
      switch (status) {
        case 'delayed':
          notificationType = 'warning';
          icon = '⏰';
          break;
        case 'cancelled':
          notificationType = 'error';
          icon = '🚫';
          break;
        case 'arrived':
          notificationType = 'success';
          icon = '✅';
          break;
        case 'boarding':
          notificationType = 'info';
          icon = '🚌';
          break;
        default:
          notificationType = 'info';
          icon = 'ℹ️';
      }

      addNotification({
        title: `Bus Status Update ${icon}`,
        message: message || `Bus status changed to: ${status}`,
        type: 'travel',
        category: 'Travel Status',
        actionRequired: status === 'cancelled',
        relatedData: { busId, status }
      });
    };

    // Add event listeners
    window.addEventListener('notificationReceived', handleNotificationReceived);
    window.addEventListener('busLocationUpdate', handleBusLocationUpdate);
    window.addEventListener('busStatusChange', handleBusStatusChange);

    // Store cleanup functions
    eventListenersRef.current = [
      () => window.removeEventListener('notificationReceived', handleNotificationReceived),
      () => window.removeEventListener('busLocationUpdate', handleBusLocationUpdate),
      () => window.removeEventListener('busStatusChange', handleBusStatusChange)
    ];
  };

  const cleanupEventListeners = () => {
    eventListenersRef.current.forEach(cleanup => cleanup());
    eventListenersRef.current = [];
  };

  const addNotification = (notification: Partial<Notification>) => {
    const newNotification: Notification = {
      id: notification.id || `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: notification.title || 'New Notification',
      message: notification.message || '',
      type: notification.type || 'info',
      category: notification.category || 'General',
      read: false,
      timestamp: new Date().toISOString(),
      actionRequired: notification.actionRequired || false,
      relatedData: notification.relatedData || null
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show browser notification if supported
    showBrowserNotification(newNotification);
  };

  const showBrowserNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: getNotificationIcon(notification.type),
        badge: '/favicon.ico',
        tag: `dhaka-bus-${notification.id}`,
        requireInteraction: notification.actionRequired,
        silent: false
      });

      // Auto close after 5 seconds unless action required
      if (!notification.actionRequired) {
        setTimeout(() => browserNotification.close(), 5000);
      }

      // Handle notification click
      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        // You can add navigation logic here
        if (notification.type === 'booking') {
          window.location.href = '/passenger/my-tickets';
        } else if (notification.type === 'payment') {
          window.location.href = '/passenger/my-tickets';
        }
      };
    }
  };

  const getNotificationIcon = (type: string): string => {
    const icons = {
      success: '/icons/notification-success.png',
      error: '/icons/notification-error.png',
      warning: '/icons/notification-warning.png',
      info: '/icons/notification-info.png',
      booking: '/icons/notification-booking.png',
      payment: '/icons/notification-payment.png',
      travel: '/icons/notification-travel.png',
      system: '/icons/notification-system.png'
    };

    return icons[type as keyof typeof icons] || '/favicon.ico';
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    isConnected
  };
}

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Test notification function
export const sendTestNotification = (addNotification: (notification: Partial<Notification>) => void) => {
  const testNotifications = [
    {
      type: 'booking' as const,
      title: 'Test Booking Notification 🎫',
      message: 'This is a test booking confirmation notification.',
      category: 'Test Booking'
    },
    {
      type: 'travel' as const,
      title: 'Test Travel Alert 🚌',
      message: 'This is a test travel update notification.',
      category: 'Test Travel'
    },
    {
      type: 'payment' as const,
      title: 'Test Payment Success 💳',
      message: 'This is a test payment confirmation notification.',
      category: 'Test Payment'
    },
    {
      type: 'system' as const,
      title: 'Test System Notice 🔧',
      message: 'This is a test system notification.',
      category: 'Test System'
    }
  ];

  const randomNotification = testNotifications[Math.floor(Math.random() * testNotifications.length)];
  addNotification(randomNotification);
};

export default useNotifications;