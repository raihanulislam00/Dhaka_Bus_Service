// Example backend endpoint for sending notifications via Pusher
// This would typically be in your NestJS backend

import Pusher from 'pusher';

// Initialize Pusher (server-side)
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || 'ap2',
  useTLS: true,
});

// Notification types
export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: 'booking-confirmed' | 'payment-success' | 'bus-approaching' | 'bus-delayed' | 'booking-cancelled';
  data?: any;
  timestamp: string;
}

// Send notification to specific user
export async function sendNotificationToUser(
  userId: string, 
  notification: NotificationPayload
): Promise<boolean> {
  try {
    const channelName = `booking-notifications-${userId}`;
    
    await pusher.trigger(channelName, notification.type, {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      timestamp: notification.timestamp
    });

    console.log(`Notification sent to user ${userId}:`, notification.title);
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

// Send bus location update
export async function sendBusLocationUpdate(
  busId: string,
  location: { lat: number; lng: number },
  status: string,
  estimatedTime: string
): Promise<boolean> {
  try {
    const channelName = `bus-tracking-${busId}`;
    
    await pusher.trigger(channelName, 'location-update', {
      busId,
      location,
      status,
      estimatedTime,
      timestamp: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error sending bus location update:', error);
    return false;
  }
}

// Send bus status change
export async function sendBusStatusChange(
  busId: string,
  status: 'delayed' | 'cancelled' | 'arrived' | 'boarding',
  message: string,
  affectedUsers: string[]
): Promise<boolean> {
  try {
    const channelName = `bus-tracking-${busId}`;
    
    // Send to bus tracking channel
    await pusher.trigger(channelName, 'status-change', {
      busId,
      status,
      message,
      timestamp: new Date().toISOString()
    });

    // Send individual notifications to affected users
    const notificationPromises = affectedUsers.map(userId => 
      sendNotificationToUser(userId, {
        id: `bus-status-${busId}-${Date.now()}`,
        title: `Bus Status Update ${getStatusEmoji(status)}`,
        message,
        type: getNotificationType(status),
        data: { busId, status },
        timestamp: new Date().toISOString()
      })
    );

    await Promise.all(notificationPromises);
    return true;
  } catch (error) {
    console.error('Error sending bus status change:', error);
    return false;
  }
}

// Helper functions
function getStatusEmoji(status: string): string {
  const emojis = {
    delayed: '⏰',
    cancelled: '🚫',
    arrived: '✅',
    boarding: '🚌'
  };
  return emojis[status as keyof typeof emojis] || 'ℹ️';
}

function getNotificationType(status: string): NotificationPayload['type'] {
  if (status === 'cancelled') return 'booking-cancelled';
  if (status === 'delayed') return 'bus-delayed';
  return 'bus-approaching';
}

// Example usage in NestJS controller:
/*
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  
  @Post('booking-confirmed')
  async sendBookingConfirmation(@Body() data: {
    userId: string;
    bookingId: string;
    routeName: string;
    departureTime: string;
    seatNumber: string;
  }) {
    const notification: NotificationPayload = {
      id: `booking-${data.bookingId}`,
      title: 'Booking Confirmed! 🎉',
      message: `Your ticket for ${data.routeName} has been confirmed. Departure: ${data.departureTime}, Seat: ${data.seatNumber}`,
      type: 'booking-confirmed',
      data: data,
      timestamp: new Date().toISOString()
    };

    const sent = await sendNotificationToUser(data.userId, notification);
    
    return {
      success: sent,
      message: sent ? 'Notification sent successfully' : 'Failed to send notification'
    };
  }

  @Post('payment-success')
  async sendPaymentSuccess(@Body() data: {
    userId: string;
    amount: number;
    method: string;
    transactionId: string;
  }) {
    const notification: NotificationPayload = {
      id: `payment-${data.transactionId}`,
      title: 'Payment Successful! 💳',
      message: `Payment of ৳${data.amount} completed via ${data.method}. Transaction ID: ${data.transactionId}`,
      type: 'payment-success',
      data: data,
      timestamp: new Date().toISOString()
    };

    const sent = await sendNotificationToUser(data.userId, notification);
    
    return {
      success: sent,
      message: sent ? 'Payment notification sent successfully' : 'Failed to send notification'
    };
  }

  @Post('bus-update')
  async sendBusUpdate(@Body() data: {
    busId: string;
    status: 'delayed' | 'cancelled' | 'arrived' | 'boarding';
    message: string;
    affectedUsers: string[];
  }) {
    const sent = await sendBusStatusChange(
      data.busId,
      data.status,
      data.message,
      data.affectedUsers
    );
    
    return {
      success: sent,
      message: sent ? 'Bus update sent successfully' : 'Failed to send bus update'
    };
  }
}
*/

export default {
  sendNotificationToUser,
  sendBusLocationUpdate,
  sendBusStatusChange
};