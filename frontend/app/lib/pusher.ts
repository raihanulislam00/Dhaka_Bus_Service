// Pusher configuration and notification system
import Pusher from 'pusher-js';

class PusherService {
  private pusher: Pusher | null = null;
  private channel: any = null;

  constructor() {
    this.initializePusher();
  }

  private initializePusher() {
    // Initialize Pusher with your app credentials
    this.pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || 'your-pusher-key', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
      forceTLS: true,
    });
  }

  // Subscribe to booking notifications channel
  subscribeToBookingNotifications(userId: string) {
    if (!this.pusher) return;

    this.channel = this.pusher.subscribe(`booking-notifications-${userId}`);
    
    // Listen for different types of notifications
    this.channel.bind('booking-confirmed', (data: any) => {
      this.showNotification('Booking Confirmed! 🎉', data.message, 'success');
    });

    this.channel.bind('payment-success', (data: any) => {
      this.showNotification('Payment Successful! 💳', data.message, 'success');
    });

    this.channel.bind('bus-approaching', (data: any) => {
      this.showNotification('Bus Approaching! 🚌', data.message, 'info');
    });

    this.channel.bind('bus-delayed', (data: any) => {
      this.showNotification('Bus Delayed ⏰', data.message, 'warning');
    });

    this.channel.bind('booking-cancelled', (data: any) => {
      this.showNotification('Booking Cancelled 🚫', data.message, 'error');
    });
  }

  // Subscribe to real-time bus tracking
  subscribeToBusTracking(busId: string) {
    if (!this.pusher) return;

    const trackingChannel = this.pusher.subscribe(`bus-tracking-${busId}`);
    
    trackingChannel.bind('location-update', (data: any) => {
      // Trigger custom event for bus location update
      window.dispatchEvent(new CustomEvent('busLocationUpdate', { detail: data }));
    });

    trackingChannel.bind('status-change', (data: any) => {
      // Trigger custom event for bus status change
      window.dispatchEvent(new CustomEvent('busStatusChange', { detail: data }));
    });

    return trackingChannel;
  }

  // Show browser notification
  private showNotification(title: string, body: string, type: 'success' | 'error' | 'warning' | 'info') {
    // Check if browser supports notifications
    if ('Notification' in window) {
      // Request permission if not granted
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.createNotification(title, body, type);
          }
        });
      } else if (Notification.permission === 'granted') {
        this.createNotification(title, body, type);
      }
    }

    // Also show in-app notification
    this.showInAppNotification(title, body, type);
  }

  private createNotification(title: string, body: string, type: string) {
    const notification = new Notification(title, {
      body,
      icon: this.getNotificationIcon(type),
      badge: '/favicon.ico',
      tag: 'dhaka-bus-service',
      requireInteraction: false
    });

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }

  private getNotificationIcon(type: string): string {
    const icons = {
      success: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10B981">
          <circle cx="12" cy="12" r="10"/>
          <path fill="white" d="m9 12 2 2 4-4"/>
        </svg>
      `),
      error: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EF4444">
          <circle cx="12" cy="12" r="10"/>
          <path fill="white" d="m15 9-6 6m0-6 6 6"/>
        </svg>
      `),
      warning: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F59E0B">
          <path d="M12 2L2 22h20L12 2zm0 15h-2v-2h2v2zm0-4h-2V9h2v4z"/>
        </svg>
      `),
      info: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6">
          <circle cx="12" cy="12" r="10"/>
          <path fill="white" d="M12 16v-4m0-4h.01"/>
        </svg>
      `)
    };

    return icons[type as keyof typeof icons] || icons.info;
  }

  // In-app notification system
  private showInAppNotification(title: string, body: string, type: string) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `
      fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 z-50 transform translate-x-full transition-transform duration-300 ease-in-out
      ${type === 'success' ? 'border-green-500' : ''}
      ${type === 'error' ? 'border-red-500' : ''}
      ${type === 'warning' ? 'border-yellow-500' : ''}
      ${type === 'info' ? 'border-blue-500' : ''}
    `;

    notification.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div class="w-5 h-5 rounded-full ${
            type === 'success' ? 'bg-green-100 text-green-600' :
            type === 'error' ? 'bg-red-100 text-red-600' :
            type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
            'bg-blue-100 text-blue-600'
          } flex items-center justify-center text-sm">
            ${
              type === 'success' ? '✓' :
              type === 'error' ? '✕' :
              type === 'warning' ? '⚠' :
              'ℹ'
            }
          </div>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-gray-900">${title}</p>
          <p class="text-sm text-gray-500 mt-1">${body}</p>
        </div>
        <button class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
          <span class="sr-only">Close</span>
          ✕
        </button>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // Trigger booking confirmation notification
  triggerBookingConfirmation(bookingDetails: any) {
    this.showNotification(
      'Booking Confirmed! 🎉',
      `Your ticket for ${bookingDetails.routeName} has been booked successfully.`,
      'success'
    );
  }

  // Trigger payment success notification
  triggerPaymentSuccess(paymentDetails: any) {
    this.showNotification(
      'Payment Successful! 💳',
      `Payment of ৳${paymentDetails.amount} completed via ${paymentDetails.method}.`,
      'success'
    );
  }

  // Disconnect from Pusher
  disconnect() {
    if (this.pusher) {
      this.pusher.disconnect();
    }
  }

  // Unsubscribe from channel
  unsubscribe(channelName: string) {
    if (this.pusher) {
      this.pusher.unsubscribe(channelName);
    }
  }
}

// Export singleton instance
export const pusherService = new PusherService();

// Export types
export interface NotificationData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
}

export interface BusLocationUpdate {
  busId: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
  estimatedTime: string;
}

export default PusherService;