'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PassengerNavbar from '../../components/PassengerNavbar';
// @ts-ignore - Working import, TypeScript module resolution issue
import PaymentModal from '../../components/PaymentModal';
import { routeAPI, ticketAPI } from '../../lib/api';

interface Route {
  id: number;
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedDuration: number;
  fare: number;
  description?: string;
  stops: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Schedule {
  id: number;
  routeId: number;
  busNumber: string;
  departureTime: string;
  arrivalTime: string;
  dayOfWeek: string;
  totalSeats: number;
  availableSeats: number;
  isActive: boolean;
  notes?: string;
  assignedDriverId?: number;
  route?: Route;
}

interface SeatSelection {
  seatNumber: string;
  price: number;
}

interface MultipleBookingData {
  routeName: string;
  scheduleId: number;
  seats: SeatSelection[];
  journeyDate: string;
}

export default function BookTicket() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [routeSearchLoading, setRouteSearchLoading] = useState(false);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/passenger/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'passenger') {
        router.push('/passenger/login');
        return;
      }
      setUser(payload);
    } catch (error) {
      console.error('Invalid token:', error);
      router.push('/passenger/login');
    }
  }, [router]);

  // Load available routes
  useEffect(() => {
    loadAvailableRoutes();
  }, []);

  const loadAvailableRoutes = async () => {
    setRouteSearchLoading(true);
    try {
      const response = await routeAPI.getAvailableRoutes();
      setAvailableRoutes(response.data || response);
    } catch (error) {
      console.error('Error loading routes:', error);
      // Use mock data if API fails
      setAvailableRoutes([
        {
          id: 1,
          name: 'Dhaka-Chittagong Express',
          startLocation: 'Dhaka',
          endLocation: 'Chittagong',
          distance: 264,
          estimatedDuration: 390, // 6.5 hours in minutes
          fare: 450,
          description: 'Express service with AC',
          stops: 'Dhaka, Cumilla, Chittagong',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Dhaka-Sylhet Deluxe',
          startLocation: 'Dhaka',
          endLocation: 'Sylhet',
          distance: 247,
          estimatedDuration: 375, // 6.25 hours in minutes
          fare: 420,
          description: 'Deluxe service with entertainment',
          stops: 'Dhaka, Narsingdi, Bhairab, Sylhet',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setRouteSearchLoading(false);
    }
  };

  const loadSchedules = async (routeId: number, date: string) => {
    try {
      // This would be an API call to get schedules for a route on a specific date
      // For now, using mock data
      const mockSchedules: Schedule[] = [
        {
          id: 1,
          routeId,
          busNumber: 'DH-1234',
          departureTime: '08:00',
          arrivalTime: '14:30',
          dayOfWeek: 'daily',
          totalSeats: 40,
          availableSeats: 25,
          isActive: true,
          assignedDriverId: 1,
        },
        {
          id: 2,
          routeId,
          busNumber: 'DH-5678', 
          departureTime: '15:00',
          arrivalTime: '21:30',
          dayOfWeek: 'daily',
          totalSeats: 40,
          availableSeats: 18,
          isActive: true,
          assignedDriverId: 2,
        },
      ];
      setSchedules(mockSchedules);
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
    setCurrentStep(2);
  };

  const handleDateSelect = async () => {
    if (selectedDate && selectedRoute) {
      await loadSchedules(selectedRoute.id, selectedDate);
      setCurrentStep(3);
    }
  };

  const handleScheduleSelect = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setCurrentStep(4);
  };

  const handleSeatToggle = (seatNumber: string) => {
    setSelectedSeats(prev => {
      const existingIndex = prev.findIndex(seat => seat.seatNumber === seatNumber);
      
      if (existingIndex >= 0) {
        // Remove seat if already selected
        return prev.filter(seat => seat.seatNumber !== seatNumber);
      } else if (prev.length < 4) {
        // Add seat if under limit
        return [...prev, {
          seatNumber,
          price: selectedRoute?.fare || 0
        }];
      }
      return prev;
    });
  };

  const handleSeatsConfirm = () => {
    if (selectedSeats.length > 0) {
      setCurrentStep(5);
    }
  };

  const handleBooking = async () => {
    if (!selectedSchedule || selectedSeats.length === 0) return;
    
    setLoading(true);
    
    try {
      // Create multiple tickets via API
      const bookingData = {
        scheduleId: selectedSchedule.id,
        journeyDate: selectedDate,
        seats: selectedSeats,
      };
      
      // Get passenger ID from user token
      const passengerId = user?.id;
      if (!passengerId) {
        throw new Error('User not authenticated');
      }
      await ticketAPI.createMultipleTickets(passengerId, bookingData);

      setShowPaymentModal(true);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setBookingConfirmed(true);
    setShowPaymentModal(false);
    
    setTimeout(() => {
      router.push('/passenger/dashboard');
    }, 3000);
  };

  const getTotalAmount = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <PassengerNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your {selectedSeats.length} ticket(s) have been booked successfully. You will be redirected to your dashboard shortly.
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p><strong>Route:</strong> {selectedRoute?.name}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Bus:</strong> {selectedSchedule?.busNumber}</p>
              <p><strong>Seats:</strong> {selectedSeats.map(s => s.seatNumber).join(', ')}</p>
              <p><strong>Total Amount:</strong> ৳{getTotalAmount()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <PassengerNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className={`flex items-center ${step < 5 ? 'flex-1' : ''}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Select Route</span>
              <span>Choose Date</span>
              <span>Select Schedule</span>
              <span>Pick Seats (1-4)</span>
              <span>Payment</span>
            </div>
          </div>

          {/* Step 1: Select Route */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Available Routes</h2>
              {routeSearchLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading available routes...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableRoutes.map(route => (
                    <div
                      key={route.id}
                      className="border rounded-lg p-4 hover:bg-green-50 cursor-pointer transition-colors"
                      onClick={() => handleRouteSelect(route)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-green-600">{route.name}</h3>
                          <p className="text-gray-600">{route.startLocation} → {route.endLocation}</p>
                          <div className="flex gap-4 text-sm text-gray-500 mt-2">
                            <span>📏 {route.distance}km</span>
                            <span>⏱️ {Math.floor(route.estimatedDuration / 60)}h {route.estimatedDuration % 60}m</span>
                            {route.description && <span>ℹ️ {route.description}</span>}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Stops: {route.stops}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">৳{route.fare}</div>
                          <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                            Select Route
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Choose Date */}
          {currentStep === 2 && selectedRoute && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Select Journey Date for {selectedRoute.name}</h2>
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {selectedDate && (
                  <button
                    onClick={handleDateSelect}
                    className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Check Available Schedules
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Select Schedule */}
          {currentStep === 3 && selectedRoute && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Available Schedules for {selectedDate}</h2>
              <div className="space-y-4">
                {schedules.map(schedule => (
                  <div
                    key={schedule.id}
                    className="border rounded-lg p-4 hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => handleScheduleSelect(schedule)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-green-600">Bus {schedule.busNumber}</h3>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>🕐 Departure: {schedule.departureTime}</span>
                          <span>🕐 Arrival: {schedule.arrivalTime}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {schedule.availableSeats} seats available out of {schedule.totalSeats}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Select Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Select Seats (1-4 seats) */}
          {currentStep === 4 && selectedSchedule && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">
                Select Seats (Maximum 4 seats)
                <span className="text-sm font-normal text-gray-600 ml-2">
                  Selected: {selectedSeats.length}/4
                </span>
              </h2>
              
              {/* Seat Map */}
              <div className="max-w-md mx-auto mb-6">
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="text-center mb-4 text-sm font-medium text-gray-600">
                    🚌 Bus {selectedSchedule.busNumber} Layout
                  </div>
                  
                  {/* Driver area */}
                  <div className="flex justify-end mb-4">
                    <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center text-white text-xs">
                      🧑‍✈️
                    </div>
                  </div>
                  
                  {/* Seats Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(selectedSchedule.totalSeats)].map((_, index) => {
                      const seatNum = `${Math.floor(index / 4) + 1}${String.fromCharCode(65 + (index % 4))}`;
                      const isSelected = selectedSeats.some(seat => seat.seatNumber === seatNum);
                      const isOccupied = index >= selectedSchedule.availableSeats; // Mock occupied seats
                      
                      return (
                        <button
                          key={seatNum}
                          onClick={() => !isOccupied && handleSeatToggle(seatNum)}
                          disabled={isOccupied}
                          className={`
                            w-8 h-8 rounded text-xs font-medium transition-colors
                            ${isOccupied 
                              ? 'bg-red-300 text-red-800 cursor-not-allowed' 
                              : isSelected
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }
                          `}
                        >
                          {seatNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center gap-4 mt-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-100 rounded mr-1"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-1"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-300 rounded mr-1"></div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedSeats.length > 0 && (
                <div className="text-center">
                  <div className="mb-4">
                    <p className="text-lg mb-2">
                      Selected Seats: <strong className="text-green-600">
                        {selectedSeats.map(s => s.seatNumber).join(', ')}
                      </strong>
                    </p>
                    <p className="text-lg">
                      Total Amount: <strong className="text-green-600">৳{getTotalAmount()}</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleSeatsConfirm}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && selectedRoute && selectedSchedule && selectedSeats.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Booking Summary & Payment</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Journey Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{selectedRoute.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departure:</span>
                      <span className="font-medium">{selectedSchedule.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bus:</span>
                      <span className="font-medium">{selectedSchedule.busNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seats ({selectedSeats.length}):</span>
                      <span className="font-medium">{selectedSeats.map(s => s.seatNumber).join(', ')}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">৳{getTotalAmount()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <button className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      💳 Credit/Debit Card
                    </button>
                    <button className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      📱 Mobile Banking (bKash/Nagad)
                    </button>
                    <button className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      💰 Pay at Counter
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleBooking}
                disabled={loading}
                className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Confirm Booking & Pay ৳${getTotalAmount()}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedRoute && selectedSchedule && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          bookingDetails={{
            routeName: selectedRoute.name,
            busNumber: selectedSchedule.busNumber,
            selectedSeats: selectedSeats.map(s => s.seatNumber) as any,
            totalAmount: getTotalAmount(),
            date: selectedDate,
            time: selectedSchedule.departureTime,
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}