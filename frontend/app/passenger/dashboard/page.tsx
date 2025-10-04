'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PassengerLayout from '../../components/PassengerLayout';
import { generalAPI, ticketAPI } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

interface GroupedTicket {
  bookingGroupId: string;
  routeName: string;
  scheduleId: number;
  busNumber: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  seats: Array<{
    seatNumber: string;
    ticketId: number;
    status: string;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface SingleTicket {
  id: number;
  seatNumber: string;
  journeyDate: string;
  status: string;
  totalAmount: number;
  routeName: string;
  busNumber: string;
  departureTime: string;
  bookingGroupId?: string;
  createdAt: string;
}

export default function PassengerDashboard() {
  const { user, loading, logout } = useAuth('passenger');
  const router = useRouter();
  const [groupedBookings, setGroupedBookings] = useState<GroupedTicket[]>([]);
  const [singleTickets, setSingleTickets] = useState<SingleTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');

  // Helper function to safely get seats data
  const getSafeSeats = (seats: any): any[] => {
    if (Array.isArray(seats)) {
      return seats;
    }
    // If seats is a string, try to parse it
    if (typeof seats === 'string') {
      try {
        const parsed = JSON.parse(seats);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Helper function to get seat count safely
  const getSeatCount = (seats: any): number => {
    return getSafeSeats(seats).length;
  };

  // Helper function to get seat numbers as string
  const getSeatNumbers = (seats: any): string => {
    const safeSeats = getSafeSeats(seats);
    if (safeSeats.length === 0) return 'No seats listed';
    return safeSeats.map(s => s.seatNumber || s).join(', ');
  };

  // Helper function to safely format amounts
  const formatAmount = (amount: any): string => {
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    return numAmount.toLocaleString();
  };

  useEffect(() => {
    if (user?.id) {
      fetchTicketData();
    }
  }, [user]);

  const fetchTicketData = async () => {
    setLoadingTickets(true);
    try {
      const passengerId = user?.id;
      
      if (!passengerId) {
        console.error('User ID not available');
        return;
      }
      
      // Fetch grouped bookings (multiple seat bookings)
      const groupedResponse = await ticketAPI.getPassengerTicketsGrouped(passengerId);
      setGroupedBookings(groupedResponse.data || []);
      
      // Fetch individual tickets (single seat bookings)
      const ticketsResponse = await ticketAPI.getPassengerTickets(passengerId);
      setSingleTickets(ticketsResponse.data || []);
      
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Use mock data for demonstration
      setGroupedBookings([
        {
          bookingGroupId: 'GRP123',
          routeName: 'Dhaka-Chittagong Express',
          scheduleId: 1,
          busNumber: 'DH-1234',
          journeyDate: '2024-01-15',
          departureTime: '08:00',
          arrivalTime: '14:30',
          seats: [
            { seatNumber: '1A', ticketId: 101, status: 'confirmed' },
            { seatNumber: '1B', ticketId: 102, status: 'confirmed' },
            { seatNumber: '2A', ticketId: 103, status: 'confirmed' },
          ],
          totalAmount: 1350, // 3 seats * 450
          status: 'confirmed',
          createdAt: '2024-01-10T10:30:00Z',
        }
      ]);
      
      setSingleTickets([
        {
          id: 201,
          seatNumber: '5C',
          journeyDate: '2024-01-20',
          status: 'confirmed',
          totalAmount: 420,
          routeName: 'Dhaka-Sylhet Deluxe',
          busNumber: 'SY-5678',
          departureTime: '15:00',
          createdAt: '2024-01-12T14:20:00Z',
        }
      ]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleCancelBookingGroup = async (bookingGroupId: string) => {
    if (!confirm('Are you sure you want to cancel this entire booking? All seats will be cancelled.')) {
      return;
    }
    
    try {
      const passengerId = user?.id;
      if (!passengerId) return;
      
      await ticketAPI.cancelBookingGroup(passengerId, bookingGroupId);
      
      // Refresh ticket data
      fetchTicketData();
      alert('Booking group cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking group:', error);
      alert('Failed to cancel booking group');
    }
  };

  const handleCancelSingleTicket = async (ticketId: number) => {
    if (!confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }
    
    try {
      const passengerId = user?.id;
      if (!passengerId) return;
      
      await ticketAPI.cancelTicket(passengerId, ticketId);
      
      // Refresh ticket data
      fetchTicketData();
      alert('Ticket cancelled successfully');
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      alert('Failed to cancel ticket');
    }
  };

  const getFilteredBookings = () => {
    const today = new Date();
    
    return groupedBookings.filter(booking => {
      const journeyDate = new Date(booking.journeyDate);
      
      switch (activeTab) {
        case 'upcoming':
          return journeyDate >= today && booking.status === 'confirmed';
        case 'completed':
          return journeyDate < today || booking.status === 'completed';
        case 'all':
        default:
          return true;
      }
    });
  };

  const getFilteredSingleTickets = () => {
    const today = new Date();
    
    return singleTickets.filter(ticket => {
      const journeyDate = new Date(ticket.journeyDate);
      
      switch (activeTab) {
        case 'upcoming':
          return journeyDate >= today && ticket.status === 'confirmed';
        case 'completed':
          return journeyDate < today || ticket.status === 'completed';
        case 'all':
        default:
          return true;
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <PassengerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl">Loading...</div>
        </div>
      </PassengerLayout>
    );
  }

  return (
    <PassengerLayout>
      <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
                    {/* Welcome Header */}
          <div className="card-gradient rounded-2xl shadow-large p-8 mb-8 animate-fade-in-up border">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="animate-slide-in-left">
                <h1 className="text-4xl font-bold gradient-text mb-2">
                  Welcome back, {user?.fullName || user?.username}! 👋
                </h1>
                <p className="text-gray-600 text-lg">Manage your bus bookings and travel history with ease</p>
              </div>
              <button 
                onClick={() => router.push('/passenger/book-ticket')}
                className="btn-success animate-slide-in-right hover-lift flex items-center gap-2"
              >
                <span>🎫</span>
                Book New Ticket
              </button>
            </div>
          </div>

          {/* Quick Stats */}
                    {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="card hover-lift animate-fade-in delay-100">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg mr-4">
                    <span className="text-white text-2xl">🎫</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-800">{groupedBookings.length + singleTickets.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card hover-lift animate-fade-in delay-200">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl shadow-lg mr-4">
                    <span className="text-white text-2xl">✅</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Upcoming Trips</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {getFilteredBookings().length + getFilteredSingleTickets().length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card hover-lift animate-fade-in delay-300">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-purple-500 to-violet-500 p-4 rounded-xl shadow-lg mr-4">
                    <span className="text-white text-2xl">👥</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Group Bookings</p>
                    <p className="text-3xl font-bold text-gray-800">{groupedBookings.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card hover-lift animate-fade-in delay-500">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-xl shadow-lg mr-4">
                    <span className="text-white text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-800">
                      ৳{formatAmount(
                        groupedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) + 
                        singleTickets.reduce((sum, t) => sum + (t.totalAmount || 0), 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Route Maps Card */}
            <div className="card hover-lift animate-fade-in-up delay-600">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-xl shadow-lg mr-4">
                      <span className="text-white text-2xl">🗺️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Interactive Route Maps</h3>
                      <p className="text-gray-600">Explore all available bus routes</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    View detailed maps of all bus routes with stops, distances, and real-time information.
                  </p>
                  <button
                    onClick={() => router.push('/passenger/route-maps')}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span>🗺️</span>
                    View Route Maps
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Book Card */}
            <div className="card hover-lift animate-fade-in-up delay-700">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl shadow-lg mr-4">
                      <span className="text-white text-2xl">🚀</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Quick Booking</h3>
                      <p className="text-gray-600">Book your next journey instantly</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Fast and easy ticket booking with multiple seat selection and instant confirmation.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => router.push('/passenger/book-ticket')}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 text-sm"
                    >
                      <span>🎫</span>
                      Book Now
                    </button>
                    <button
                      onClick={() => router.push('/passenger/my-tickets')}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 text-sm"
                    >
                      <span>📋</span>
                      My Tickets
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Management Tabs */}
          <div className="card shadow-large animate-fade-in-up delay-700">
            {/* Tab Navigation */}
            <div className="border-b border-gray-100">
              <nav className="flex space-x-2 px-6 py-2">
                {[
                  { key: 'upcoming', label: 'Upcoming Trips', icon: '📅', gradient: 'from-blue-500 to-purple-500' },
                  { key: 'completed', label: 'Completed', icon: '✅', gradient: 'from-green-500 to-emerald-500' },
                  { key: 'all', label: 'All Bookings', icon: '📋', gradient: 'from-gray-500 to-slate-500' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                      activeTab === tab.key
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg transform scale-105`
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {loadingTickets ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your bookings...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group Bookings */}
                  {getFilteredBookings().length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Group Bookings (Multiple Seats)</h3>
                      <div className="space-y-4">
                        {getFilteredBookings().map((booking, index) => (
                          <div key={booking.bookingGroupId} className={`card hover-lift animate-fade-in-up delay-${(index % 3 + 1) * 100}`}>
                            <div className="card-body">
                              <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <h4 className="text-2xl font-bold gradient-text">{booking.routeName}</h4>
                                    <span className={`status-badge ${booking.status === 'confirmed' ? 'status-confirmed' : booking.status === 'pending' ? 'status-pending' : 'status-cancelled'}`}>
                                      {booking.status.toUpperCase()}
                                    </span>
                                  </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div>
                                    <p><strong>Bus:</strong> {booking.busNumber}</p>
                                    <p><strong>Date:</strong> {formatDate(booking.journeyDate)}</p>
                                    <p><strong>Time:</strong> {booking.departureTime} - {booking.arrivalTime}</p>
                                  </div>
                                  <div>
                                    <p><strong>Seats ({getSeatCount(booking.seats)}):</strong> {getSeatNumbers(booking.seats)}</p>
                                    <p><strong>Booking ID:</strong> {booking.bookingGroupId}</p>
                                    <p><strong>Booked:</strong> {formatDate(booking.createdAt)}</p>
                                  </div>
                                </div>
                              </div>
                                <div className="text-right ml-6">
                                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl mb-3 text-center">
                                    <span className="text-sm opacity-90">Total Amount</span>
                                    <div className="text-2xl font-bold">
                                      ৳{formatAmount(booking.totalAmount)}
                                    </div>
                                  </div>
                                  {booking.status === 'confirmed' && new Date(booking.journeyDate) >= new Date() && (
                                    <button
                                      onClick={() => handleCancelBookingGroup(booking.bookingGroupId)}
                                      className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
                                    >
                                      Cancel Booking
                                    </button>
                                  )}
                                </div>
                            </div>
                            
                              {/* Individual seat details */}
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mt-6">
                                <p className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                  <span className="text-lg">💺</span>
                                  Seat Details:
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {getSafeSeats(booking.seats).map((seat, index) => (
                                    <div key={seat.ticketId || index} className="bg-white rounded-lg p-3 shadow-soft hover:shadow-medium transition-all duration-200">
                                      <div className="flex flex-col items-center text-center">
                                        <span className="font-bold text-lg text-gray-800">{seat.seatNumber || seat}</span>
                                        <span className={`status-badge text-xs mt-2 ${seat.status === 'confirmed' || !seat.status ? 'status-confirmed' : seat.status === 'pending' ? 'status-pending' : 'status-cancelled'}`}>
                                          {seat.status || 'confirmed'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                  {getSeatCount(booking.seats) === 0 && (
                                    <div className="col-span-full text-center text-gray-500 py-8">
                                      <span className="text-4xl mb-2 block">🚫</span>
                                      No seat details available
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Single Tickets */}
                  {getFilteredSingleTickets().length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Individual Bookings</h3>
                      <div className="space-y-4">
                        {getFilteredSingleTickets().map((ticket) => (
                          <div key={ticket.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-xl font-bold text-gray-800">{ticket.routeName}</h4>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                    {ticket.status.toUpperCase()}
                                  </span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div>
                                    <p><strong>Bus:</strong> {ticket.busNumber}</p>
                                    <p><strong>Date:</strong> {formatDate(ticket.journeyDate)}</p>
                                    <p><strong>Time:</strong> {ticket.departureTime}</p>
                                  </div>
                                  <div>
                                    <p><strong>Seat:</strong> {ticket.seatNumber}</p>
                                    <p><strong>Ticket ID:</strong> {ticket.id}</p>
                                    <p><strong>Booked:</strong> {formatDate(ticket.createdAt)}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-6">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                  ৳{formatAmount(ticket.totalAmount)}
                                </div>
                                {ticket.status === 'confirmed' && new Date(ticket.journeyDate) >= new Date() && (
                                  <button
                                    onClick={() => handleCancelSingleTicket(ticket.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                  >
                                    Cancel Ticket
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {getFilteredBookings().length === 0 && getFilteredSingleTickets().length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎫</div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">No bookings found</h3>
                      <p className="text-gray-600 mb-6">
                        {activeTab === 'upcoming' 
                          ? "You don't have any upcoming trips."
                          : activeTab === 'completed'
                          ? "You haven't completed any trips yet."
                          : "You haven't made any bookings yet."
                        }
                      </p>
                      <button
                        onClick={() => router.push('/passenger/book-ticket')}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                      >
                        Book Your First Ticket
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
    </PassengerLayout>
  );
}