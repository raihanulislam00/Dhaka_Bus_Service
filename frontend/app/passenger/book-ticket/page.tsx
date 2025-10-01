'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PassengerNavbar from '../../components/PassengerNavbar';
import BasicBusTracker from '../../components/BasicBusTracker';
// @ts-ignore - Working import, TypeScript module resolution issue
import PaymentModal from '../../components/PaymentModal';
import api from '../../lib/api';
// @ts-ignore - Working import, TypeScript module resolution issue  
import { pusherService } from '../../lib/pusher';

interface Route {
  id: number;
  name: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  price: number;
  buses: Bus[];
}

interface Bus {
  id: number;
  busNumber: string;
  driverName: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  currentLocation: {
    lat: number;
    lng: number;
  };
  status: 'approaching' | 'boarding' | 'departed' | 'arrived';
  estimatedPickupTime: string;
}

interface BookingData {
  routeId: number;
  busId: number;
  seatNumber: number;
  pickupPoint: string;
  dropoffPoint: string;
  totalAmount: number;
}

export default function BookTicket() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [pickupPoint, setPickupPoint] = useState('');
  const [dropoffPoint, setDropoffPoint] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('user');

    if (!token || userType !== 'passenger') {
      router.push('/passenger/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Initialize Pusher for real-time notifications
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      pusherService.subscribeToBookingNotifications(user.id.toString());
    }
    
    // Load available routes
    loadRoutes();
    
    setLoading(false);
  }, [router]);

  const loadRoutes = async () => {
    // Simulate API call to get available routes
    // In real implementation, this would be an API call
    const mockRoutes: Route[] = [
      {
        id: 1,
        name: 'Dhaka - Chittagong Express',
        from: 'Dhaka',
        to: 'Chittagong',
        distance: '264 km',
        duration: '4 hours 30 min',
        price: 450,
        buses: [
          {
            id: 101,
            busNumber: 'DH-001',
            driverName: 'Mohammad Rahman',
            departureTime: '08:00 AM',
            arrivalTime: '12:30 PM',
            availableSeats: 15,
            totalSeats: 40,
            currentLocation: { lat: 23.8103, lng: 90.4125 },
            status: 'approaching',
            estimatedPickupTime: '15 minutes'
          },
          {
            id: 102,
            busNumber: 'DH-002',
            driverName: 'Abdul Karim',
            departureTime: '10:00 AM',
            arrivalTime: '02:30 PM',
            availableSeats: 8,
            totalSeats: 40,
            currentLocation: { lat: 23.7804, lng: 90.4093 },
            status: 'boarding',
            estimatedPickupTime: '5 minutes'
          }
        ]
      },
      {
        id: 2,
        name: 'Dhaka - Sylhet Highway',
        from: 'Dhaka',
        to: 'Sylhet',
        distance: '247 km',
        duration: '4 hours',
        price: 420,
        buses: [
          {
            id: 201,
            busNumber: 'SY-001',
            driverName: 'Rafiq Ahmed',
            departureTime: '09:00 AM',
            arrivalTime: '01:00 PM',
            availableSeats: 22,
            totalSeats: 35,
            currentLocation: { lat: 23.8859, lng: 90.3964 },
            status: 'departed',
            estimatedPickupTime: 'Next departure: 11:00 AM'
          }
        ]
      }
    ];
    setRoutes(mockRoutes);
  };

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
    setSelectedBus(null);
    setSelectedSeat(null);
    setBookingStep(2);
  };

  const handleBusSelect = (bus: Bus) => {
    setSelectedBus(bus);
    setSelectedSeat(null);
    setBookingStep(3);
  };

  const handleSeatSelect = (seatNumber: number) => {
    setSelectedSeat(seatNumber);
    setBookingStep(4);
  };

  const handleProceedToPayment = () => {
    if (!selectedRoute || !selectedBus || !selectedSeat || !pickupPoint || !dropoffPoint) {
      alert('Please complete all booking details');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      const bookingData: BookingData = {
        routeId: selectedRoute!.id,
        busId: selectedBus!.id,
        seatNumber: selectedSeat!,
        pickupPoint,
        dropoffPoint,
        totalAmount: selectedRoute!.price
      };

      // Here you would make an API call to create the booking
      // const response = await authAPI.createBooking(bookingData);
      
      // Simulate booking creation
      const bookingId = Math.random().toString(36).substr(2, 9);
      
      // Send push notification via Pusher
      sendBookingNotification(bookingId, bookingData);
      
      setShowPaymentModal(false);
      
      // Redirect to booking confirmation
      router.push(`/passenger/booking-confirmation/${bookingId}`);
      
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const sendBookingNotification = (bookingId: string, booking: BookingData) => {
    // This would be handled by your backend to send push notifications
    // For now, we'll simulate it with a local notification
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Booking Confirmed! 🎫', {
            body: `Your ticket for ${selectedRoute?.name} is confirmed. Bus: ${selectedBus?.busNumber}. Departure: ${selectedBus?.departureTime}`,
            icon: '/bus-icon.png'
          });
        }
      });
    }
  };

  const renderSeatMap = () => {
    if (!selectedBus) return null;

    const seats = Array.from({ length: selectedBus.totalSeats }, (_, i) => i + 1);
    const occupiedSeats = Array.from({ length: selectedBus.totalSeats - selectedBus.availableSeats }, (_, i) => i + 1);

    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Select Your Seat</h3>
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {seats.map(seatNumber => {
            const isOccupied = occupiedSeats.includes(seatNumber);
            const isSelected = selectedSeat === seatNumber;
            
            return (
              <button
                key={seatNumber}
                onClick={() => !isOccupied && handleSeatSelect(seatNumber)}
                disabled={isOccupied}
                className={`
                  w-12 h-12 rounded border-2 font-medium text-sm
                  ${isOccupied 
                    ? 'bg-red-100 border-red-300 text-red-500 cursor-not-allowed'
                    : isSelected
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                  }
                `}
              >
                {seatNumber}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PassengerNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PassengerNavbar username={user?.username} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Ticket 🎫</h1>
          <p className="text-gray-600 mt-2">Find and book your perfect bus journey</p>
        </div>

        {/* Booking Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Select Route' },
              { step: 2, title: 'Choose Bus' },
              { step: 3, title: 'Pick Seat' },
              { step: 4, title: 'Book & Pay' }
            ].map(({ step, title }) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${bookingStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {step}
                </div>
                <span className={`ml-2 text-sm ${bookingStep >= step ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {title}
                </span>
                {step < 4 && (
                  <div className={`ml-8 w-8 h-0.5 ${bookingStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Route Selection */}
        {bookingStep === 1 && (
          <div className="grid gap-6">
            <h2 className="text-xl font-semibold">Available Routes</h2>
            {routes.map(route => (
              <div key={route.id} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => handleRouteSelect(route)}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">{route.name}</h3>
                    <p className="text-gray-600">{route.from} → {route.to}</p>
                    <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                      <span>📏 {route.distance}</span>
                      <span>⏱️ {route.duration}</span>
                      <span>🚌 {route.buses.length} buses available</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">৳{route.price}</div>
                    <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Select Route
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Bus Selection */}
        {bookingStep === 2 && selectedRoute && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button onClick={() => setBookingStep(1)} className="text-blue-600 hover:text-blue-800">
                ← Back to Routes
              </button>
              <h2 className="text-xl font-semibold">Select Bus - {selectedRoute.name}</h2>
            </div>
            
            <div className="grid gap-4">
              {selectedRoute.buses.map(bus => (
                <div key={bus.id} className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Bus {bus.busNumber}</h3>
                      <p className="text-gray-600">Driver: {bus.driverName}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bus.status === 'approaching' ? 'bg-yellow-100 text-yellow-800' :
                      bus.status === 'boarding' ? 'bg-green-100 text-green-800' :
                      bus.status === 'departed' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {bus.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Departure:</span>
                          <span className="font-medium">{bus.departureTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Arrival:</span>
                          <span className="font-medium">{bus.arrivalTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available Seats:</span>
                          <span className="font-medium text-green-600">{bus.availableSeats}/{bus.totalSeats}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pickup Time:</span>
                          <span className="font-medium text-blue-600">{bus.estimatedPickupTime}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleBusSelect(bus)}
                        disabled={bus.availableSeats === 0}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
                      >
                        {bus.availableSeats === 0 ? 'Fully Booked' : 'Select This Bus'}
                      </button>
                    </div>
                    
                    <div>
                      <BasicBusTracker bus={bus} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Seat Selection */}
        {bookingStep === 3 && selectedBus && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button onClick={() => setBookingStep(2)} className="text-blue-600 hover:text-blue-800">
                ← Back to Buses
              </button>
              <h2 className="text-xl font-semibold">Select Seat - Bus {selectedBus.busNumber}</h2>
            </div>
            
            {renderSeatMap()}
            
            {selectedSeat && (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Point
                    </label>
                    <select
                      value={pickupPoint}
                      onChange={(e) => setPickupPoint(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select pickup point</option>
                      <option value="Dhaka Terminal">Dhaka Terminal</option>
                      <option value="Gulshan Circle">Gulshan Circle</option>
                      <option value="Dhanmondi 27">Dhanmondi 27</option>
                      <option value="Uttara Sector 3">Uttara Sector 3</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drop-off Point
                    </label>
                    <select
                      value={dropoffPoint}
                      onChange={(e) => setDropoffPoint(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select drop-off point</option>
                      <option value="Chittagong Terminal">Chittagong Terminal</option>
                      <option value="Agrabad">Agrabad</option>
                      <option value="Nasirabad">Nasirabad</option>
                      <option value="GEC Circle">GEC Circle</option>
                    </select>
                  </div>
                </div>
                
                {pickupPoint && dropoffPoint && (
                  <button
                    onClick={() => setBookingStep(4)}
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Continue to Payment →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Payment */}
        {bookingStep === 4 && selectedRoute && selectedBus && selectedSeat && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button onClick={() => setBookingStep(3)} className="text-blue-600 hover:text-blue-800">
                ← Back to Seat Selection
              </button>
              <h2 className="text-xl font-semibold">Confirm & Pay</h2>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Route:</span>
                  <span className="font-medium">{selectedRoute.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bus:</span>
                  <span className="font-medium">{selectedBus.busNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seat:</span>
                  <span className="font-medium">#{selectedSeat}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup:</span>
                  <span className="font-medium">{pickupPoint}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drop-off:</span>
                  <span className="font-medium">{dropoffPoint}</span>
                </div>
                <div className="flex justify-between">
                  <span>Departure:</span>
                  <span className="font-medium">{selectedBus.departureTime}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-green-600">৳{selectedRoute.price}</span>
                </div>
              </div>
              
              <button
                onClick={handleProceedToPayment}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-lg font-medium"
              >
                Proceed to Payment 💳
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedRoute && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          bookingDetails={{
            routeName: selectedRoute.name,
            busNumber: selectedBus?.busNumber || 'N/A',
            selectedSeats: selectedSeat ? [selectedSeat] : [1],
            totalAmount: selectedRoute.price || 50,
            date: new Date().toISOString().split('T')[0],
            time: '09:00 AM'
          }}
        />
      )}
    </div>
  );
}