'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PassengerNavbar from '../../components/PassengerNavbar';
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
      <div className="min-h-screen bg-gray-50">
        <PassengerNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <PassengerNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome, {user?.fullName || user?.username}! 👋
                </h1>
                <p className="text-gray-600 mt-2">Manage your bus bookings and travel history</p>
              </div>
              <button 
                onClick={() => router.push('/passenger/book-ticket')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Book New Ticket
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-lg mr-4">
                  <span className="text-white text-xl">🎫</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{groupedBookings.length + singleTickets.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-green-500 p-3 rounded-lg mr-4">
                  <span className="text-white text-xl">✅</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Upcoming Trips</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {getFilteredBookings().length + getFilteredSingleTickets().length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-purple-500 p-3 rounded-lg mr-4">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Group Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{groupedBookings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-orange-500 p-3 rounded-lg mr-4">
                  <span className="text-white text-xl">💰</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ৳{(groupedBookings.reduce((sum, b) => sum + b.totalAmount, 0) + 
                        singleTickets.reduce((sum, t) => sum + t.totalAmount, 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Management Tabs */}
          <div className="bg-white rounded-lg shadow-lg">
            {/* Tab Navigation */}
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: 'upcoming', label: 'Upcoming Trips', icon: '📅' },
                  { key: 'completed', label: 'Completed', icon: '✅' },
                  { key: 'all', label: 'All Bookings', icon: '📋' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.icon} {tab.label}
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
                        {getFilteredBookings().map((booking) => (
                          <div key={booking.bookingGroupId} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-xl font-bold text-gray-800">{booking.routeName}</h4>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
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
                                    <p><strong>Seats ({booking.seats.length}):</strong> {booking.seats.map(s => s.seatNumber).join(', ')}</p>
                                    <p><strong>Booking ID:</strong> {booking.bookingGroupId}</p>
                                    <p><strong>Booked:</strong> {formatDate(booking.createdAt)}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-6">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                  ৳{booking.totalAmount.toLocaleString()}
                                </div>
                                {booking.status === 'confirmed' && new Date(booking.journeyDate) >= new Date() && (
                                  <button
                                    onClick={() => handleCancelBookingGroup(booking.bookingGroupId)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                  >
                                    Cancel Group Booking
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Individual seat details */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="font-medium text-gray-700 mb-2">Seat Details:</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {booking.seats.map((seat) => (
                                  <div key={seat.ticketId} className="flex items-center justify-between bg-white p-2 rounded">
                                    <span className="font-medium">{seat.seatNumber}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(seat.status)}`}>
                                      {seat.status}
                                    </span>
                                  </div>
                                ))}
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
                                  ৳{ticket.totalAmount.toLocaleString()}
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
      </div>
    </div>
  );
}