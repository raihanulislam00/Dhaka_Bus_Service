// Notification Service for API integration
import { pusherService } from './pusher';

export interface ApiNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'travel' | 'system';
  category: string;
  userId: string;
  read: boolean;
  actionRequired: boolean;
  relatedData?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'travel' | 'system';
  category: string;
  userId: string;
  actionRequired?: boolean;
  relatedData?: any;
}

class NotificationService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Get all notifications for a user
  async getNotifications(userId: string, filters?: {
    type?: string;
    read?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApiNotification[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.read !== undefined) queryParams.append('read', filters.read.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.offset) queryParams.append('offset', filters.offset.toString());

      const response = await fetch(`${this.baseUrl}/notifications/${userId}?${queryParams}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Create a new notification
  async createNotification(notification: CreateNotificationRequest): Promise<ApiNotification | null> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error('Failed to create notification');
      }

      const createdNotification = await response.json();
      
      // Trigger real-time notification via Pusher
      this.triggerRealTimeNotification(createdNotification);
      
      return createdNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${userId}/read-all`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${userId}/unread-count`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Trigger specific notification types
  async triggerBookingConfirmation(bookingData: {
    userId: string;
    bookingId: string;
    routeName: string;
    departureTime: string;
    seatNumber: string;
  }): Promise<void> {
    await this.createNotification({
      title: 'Booking Confirmed! 🎉',
      message: `Your ticket for ${bookingData.routeName} has been confirmed. Departure: ${bookingData.departureTime}, Seat: ${bookingData.seatNumber}`,
      type: 'booking',
      category: 'Booking Confirmation',
      userId: bookingData.userId,
      actionRequired: false,
      relatedData: bookingData
    });
  }

  async triggerPaymentSuccess(paymentData: {
    userId: string;
    amount: number;
    method: string;
    transactionId: string;
    bookingId?: string;
  }): Promise<void> {
    await this.createNotification({
      title: 'Payment Successful! 💳',
      message: `Payment of ৳${paymentData.amount} has been processed successfully via ${paymentData.method}. Transaction ID: ${paymentData.transactionId}`,
      type: 'payment',
      category: 'Payment Confirmation',
      userId: paymentData.userId,
      actionRequired: false,
      relatedData: paymentData
    });
  }

  async triggerBusStatusUpdate(statusData: {
    userId: string;
    busId: string;
    status: 'delayed' | 'cancelled' | 'arrived' | 'boarding';
    message?: string;
    estimatedTime?: string;
  }): Promise<void> {
    const statusEmoji = {
      delayed: '⏰',
      cancelled: '🚫',
      arrived: '✅',
      boarding: '🚌'
    };

    await this.createNotification({
      title: `Bus Status Update ${statusEmoji[statusData.status]}`,
      message: statusData.message || `Your bus status has changed to: ${statusData.status}`,
      type: 'travel',
      category: 'Travel Status',
      userId: statusData.userId,
      actionRequired: statusData.status === 'cancelled',
      relatedData: statusData
    });
  }

  async triggerSystemMaintenance(userData: {
    userId: string;
    maintenanceStart: string;
    maintenanceEnd: string;
    affectedServices: string[];
  }): Promise<void> {
    await this.createNotification({
      title: 'System Maintenance Notice 🔧',
      message: `Scheduled maintenance from ${userData.maintenanceStart} to ${userData.maintenanceEnd}. Services affected: ${userData.affectedServices.join(', ')}`,
      type: 'system',
      category: 'System Notice',
      userId: userData.userId,
      actionRequired: false,
      relatedData: userData
    });
  }

  // Trigger real-time notification via Pusher
  private triggerRealTimeNotification(notification: ApiNotification): void {
    try {
      // This would typically be done on the backend
      // For frontend demo, we can dispatch a custom event
      window.dispatchEvent(new CustomEvent('notificationReceived', {
        detail: {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          category: notification.category,
          actionRequired: notification.actionRequired,
          relatedData: notification.relatedData
        }
      }));
    } catch (error) {
      console.error('Error triggering real-time notification:', error);
    }
  }

  // Get authentication headers
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Subscribe to real-time updates
  subscribeToUserNotifications(userId: string): void {
    pusherService.subscribeToBookingNotifications(userId);
  }

  // Unsubscribe from real-time updates
  unsubscribeFromUserNotifications(userId: string): void {
    pusherService.unsubscribe(`booking-notifications-${userId}`);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Notification preferences
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  booking: boolean;
  payment: boolean;
  travel: boolean;
  system: boolean;
}

export const defaultNotificationPreferences: NotificationPreferences = {
  email: true,
  sms: false,
  push: true,
  booking: true,
  payment: true,
  travel: true,
  system: false
};

export default NotificationService;