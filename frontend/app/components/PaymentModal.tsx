'use client';

import { useState } from 'react';

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

type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card' | 'bank';

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess, bookingDetails }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    pin: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    bankAccount: '',
    routingNumber: ''
  });

  if (!isOpen) return null;

  const paymentMethods = [
    { id: 'bkash', name: 'bKash', color: 'bg-pink-600', icon: '📱' },
    { id: 'nagad', name: 'Nagad', color: 'bg-orange-600', icon: '💳' },
    { id: 'rocket', name: 'Rocket', color: 'bg-purple-600', icon: '🚀' },
    { id: 'card', name: 'Credit/Debit Card', color: 'bg-blue-600', icon: '💳' },
    { id: 'bank', name: 'Bank Transfer', color: 'bg-green-600', icon: '🏦' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePayment = () => {
    if (selectedMethod === 'bkash' || selectedMethod === 'nagad' || selectedMethod === 'rocket') {
      if (!paymentData.phoneNumber || !paymentData.pin) {
        alert('Please enter phone number and PIN');
        return false;
      }
      if (paymentData.phoneNumber.length !== 11) {
        alert('Phone number must be 11 digits');
        return false;
      }
    }
    
    if (selectedMethod === 'card') {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardHolderName) {
        alert('Please fill all card details');
        return false;
      }
    }
    
    if (selectedMethod === 'bank') {
      if (!paymentData.bankAccount || !paymentData.routingNumber) {
        alert('Please enter bank account and routing number');
        return false;
      }
    }
    
    return true;
  };

  const processPayment = async () => {
    if (!validatePayment()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate payment confirmation
      const paymentConfirmation = {
        transactionId: `TXN${Date.now()}`,
        method: selectedMethod,
        amount: bookingDetails.totalAmount,
        status: 'success',
        timestamp: new Date().toISOString(),
        ...paymentData
      };
      
      onPaymentSuccess(paymentConfirmation);
      
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Booking Summary */}
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="font-medium text-gray-900 mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span className="font-medium">{bookingDetails.routeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bus:</span>
              <span className="font-medium">{bookingDetails.busNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seats:</span>
              <span className="font-medium">{bookingDetails.selectedSeats?.join(', ') || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium">{bookingDetails.date} at {bookingDetails.time}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-2 mt-2">
              <span>Total Amount:</span>
              <span className="text-blue-600">৳{bookingDetails.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <h3 className="font-medium text-gray-900 mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedMethod === method.id 
                    ? `border-blue-500 ${method.color} text-white` 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">{method.icon}</div>
                  <div className="text-xs font-medium">{method.name}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            {(selectedMethod === 'bkash' || selectedMethod === 'nagad' || selectedMethod === 'rocket') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={paymentData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} PIN
                  </label>
                  <input
                    type="password"
                    placeholder="Enter PIN"
                    value={paymentData.pin}
                    onChange={(e) => handleInputChange('pin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {selectedMethod === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={paymentData.cardHolderName}
                    onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            {selectedMethod === 'bank' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={paymentData.bankAccount}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    placeholder="Routing Number"
                    value={paymentData.routingNumber}
                    onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={processPayment}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay ৳${bookingDetails.totalAmount}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}