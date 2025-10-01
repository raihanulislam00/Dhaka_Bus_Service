// Type declarations for components and modules

declare module '../../components/PaymentModal' {
  interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: (paymentData: any) => void;
    bookingDetails: {
      routeName: string;
      busNumber: string;
      selectedSeats: number[];
      totalAmount: number;
      date: string;
      time: string;
    };
  }
  
  const PaymentModal: React.FC<PaymentModalProps>;
  export default PaymentModal;
}

declare module '../../lib/pusher' {
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

  class PusherService {
    subscribeToBookingNotifications(userId: string): void;
    subscribeToBusTracking(busId: string): any;
    triggerBookingConfirmation(bookingDetails: any): void;
    triggerPaymentSuccess(paymentDetails: any): void;
    disconnect(): void;
    unsubscribe(channelName: string): void;
  }

  export const pusherService: PusherService;
  export default PusherService;
}