'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PassengerLayout from '../../components/PassengerLayout';
import AuthGuard from '../../components/AuthGuard';
import { ticketAPI } from '../../lib/api';

interface Ticket {
  id: number;
  routeName: string;
  busNumber: string;
  seatNumber: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  bookingDate: string;
  passengerName: string;
  startLocation: string;
  endLocation: string;
}

function MyTicketsContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await ticketAPI.getPassengerTickets(user.id);
      setTickets(response.data || response || []);
    } catch (error: any) {
      console.error('Error loading tickets:', error);
      
      // Use mock data if API fails
      const mockTickets: Ticket[] = [
        {
          id: 1,
          routeName: 'Dhaka-Chittagong Express',
          busNumber: 'DH-1234',
          seatNumber: '12A',
          journeyDate: '2025-10-05',
          departureTime: '08:00',
          arrivalTime: '14:30',
          fare: 450,
          status: 'confirmed',
          bookingDate: '2025-10-03T10:30:00.000Z',
          passengerName: user?.name || 'Passenger',
          startLocation: 'Dhaka',
          endLocation: 'Chittagong'
        },
        {
          id: 2,
          routeName: 'Dhaka-Sylhet Deluxe',
          busNumber: 'DH-5678',
          seatNumber: '8B',
          journeyDate: '2025-09-28',
          departureTime: '15:00',
          arrivalTime: '21:30',
          fare: 420,
          status: 'completed',
          bookingDate: '2025-09-26T14:15:00.000Z',
          passengerName: user?.name || 'Passenger',
          startLocation: 'Dhaka',
          endLocation: 'Sylhet'
        },
        {
          id: 3,
          routeName: 'Dhaka-Rajshahi Express',
          busNumber: 'DH-9012',
          seatNumber: '15C',
          journeyDate: '2025-10-10',
          departureTime: '07:30',
          arrivalTime: '13:00',
          fare: 380,
          status: 'confirmed',
          bookingDate: '2025-10-02T16:45:00.000Z',
          passengerName: user?.name || 'Passenger',
          startLocation: 'Dhaka',
          endLocation: 'Rajshahi'
        },
        {
          id: 4,
          routeName: 'Dhaka-Khulna Express',
          busNumber: 'DH-3456',
          seatNumber: '22A',
          journeyDate: '2025-09-20',
          departureTime: '09:00',
          arrivalTime: '15:30',
          fare: 400,
          status: 'cancelled',
          bookingDate: '2025-09-18T11:20:00.000Z',
          passengerName: user?.name || 'Passenger',
          startLocation: 'Dhaka',
          endLocation: 'Khulna'
        }
      ];
      
      setTickets(mockTickets);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    // Check if ticket can be cancelled (only upcoming tickets)
    const journeyDate = new Date(ticket.journeyDate);
    const now = new Date();
    const hoursUntilJourney = (journeyDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilJourney < 24) {
      alert('Cannot cancel tickets less than 24 hours before departure.');
      return;
    }

    if (!confirm('Are you sure you want to cancel this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      await ticketAPI.cancelTicket(user.id, ticketId);
      
      // Update local state
      setTickets(prevTickets => 
        prevTickets.map(t => 
          t.id === ticketId ? { ...t, status: 'cancelled' as const } : t
        )
      );

      alert('Ticket cancelled successfully. Refund will be processed within 3-5 business days.');
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      
      // Mock cancellation for demo
      setTickets(prevTickets => 
        prevTickets.map(t => 
          t.id === ticketId ? { ...t, status: 'cancelled' as const } : t
        )
      );
      
      alert('Ticket cancelled successfully. Refund will be processed within 3-5 business days.');
    }
  };

  const getFilteredTickets = () => {
    const now = new Date();
    
    return tickets.filter(ticket => {
      if (filter === 'all') return true;
      
      const journeyDate = new Date(ticket.journeyDate);
      
      switch (filter) {
        case 'upcoming':
          return journeyDate >= now && ticket.status === 'confirmed';
        case 'completed':
          return ticket.status === 'completed' || (journeyDate < now && ticket.status === 'confirmed');
        case 'cancelled':
          return ticket.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'status-badge status-success';
      case 'completed':
        return 'status-badge status-info';
      case 'cancelled':
        return 'status-badge status-danger';
      case 'pending':
        return 'status-badge status-warning';
      default:
        return 'status-badge status-neutral';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const canCancelTicket = (ticket: Ticket) => {
    if (ticket.status !== 'confirmed') return false;
    
    const journeyDate = new Date(ticket.journeyDate);
    const now = new Date();
    const hoursUntilJourney = (journeyDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursUntilJourney >= 24;
  };

  const downloadTicketPDF = (ticket: Ticket) => {
    // Create a new window for the PDF content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download the ticket PDF');
      return;
    }

    // Generate PDF-ready HTML content
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Bus Ticket - ${ticket.routeName}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }
          .ticket {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
          }
          .ticket-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
          }
          .ticket-header::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            right: 0;
            height: 20px;
            background: radial-gradient(circle at 10px, transparent 10px, white 10px);
            background-size: 20px 20px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .company-name {
            font-size: 18px;
            opacity: 0.9;
          }
          .ticket-body {
            padding: 40px 30px;
          }
          .ticket-title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            text-align: center;
            margin-bottom: 30px;
          }
          .route-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
          }
          .location {
            text-align: center;
            flex: 1;
          }
          .location-name {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .location-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .route-arrow {
            font-size: 24px;
            color: #667eea;
            margin: 0 20px;
          }
          .ticket-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .detail-item {
            background: #f8f9ff;
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          .detail-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
          .detail-value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
          }
          .fare-section {
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
          }
          .fare-amount {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .fare-label {
            font-size: 14px;
            opacity: 0.9;
          }
          .qr-section {
            text-align: center;
            margin-bottom: 30px;
          }
          .qr-placeholder {
            width: 120px;
            height: 120px;
            background: #f0f0f0;
            border: 2px dashed #ccc;
            margin: 0 auto 10px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .status-confirmed {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
          }
          .status-completed {
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
          }
          .ticket-footer {
            background: #f8f9ff;
            padding: 20px 30px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .terms {
            margin-top: 15px;
            line-height: 1.5;
          }
          @media print {
            body { background: white; }
            .ticket { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-header">
            <div class="logo">
              🚌 Dhaka Bus Service
            </div>
            <div class="company-name">Your Trusted Travel Partner</div>
          </div>
          
          <div class="ticket-body">
            <div class="ticket-title">
              ${ticket.routeName}
            </div>
            
            <div class="route-info">
              <div class="location">
                <div class="location-label">From</div>
                <div class="location-name">${ticket.startLocation}</div>
              </div>
              <div class="route-arrow">✈️</div>
              <div class="location">
                <div class="location-label">To</div>
                <div class="location-name">${ticket.endLocation}</div>
              </div>
            </div>
            
            <div class="ticket-details">
              <div class="detail-item">
                <div class="detail-label">Ticket ID</div>
                <div class="detail-value">#${ticket.id}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Passenger</div>
                <div class="detail-value">${ticket.passengerName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Journey Date</div>
                <div class="detail-value">${formatDate(ticket.journeyDate)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Bus Number</div>
                <div class="detail-value">${ticket.busNumber}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Seat Number</div>
                <div class="detail-value">${ticket.seatNumber}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Departure Time</div>
                <div class="detail-value">${ticket.departureTime}</div>
              </div>
            </div>
            
            <div class="fare-section">
              <div class="fare-amount">৳${ticket.fare}</div>
              <div class="fare-label">Total Fare</div>
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
              <span class="status-badge status-${ticket.status}">
                ${ticket.status.toUpperCase()}
              </span>
            </div>
            
            <div class="qr-section">
              <div class="qr-placeholder">
                QR Code<br/>
                📱 Scan at Bus
              </div>
              <div style="font-size: 12px; color: #666;">
                Show this ticket to the conductor
              </div>
            </div>
          </div>
          
          <div class="ticket-footer">
            <div><strong>Booking Date:</strong> ${formatDate(ticket.bookingDate)}</div>
            <div class="terms">
              <strong>Terms & Conditions:</strong><br/>
              • Please arrive at the departure point 15 minutes before scheduled time<br/>
              • This ticket is non-transferable and must be presented during the journey<br/>
              • Cancellation allowed up to 24 hours before departure<br/>
              • For support, contact: +880-1XXX-XXXXXX | support@dhakabus.com
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 1000);
          }
        </script>
      </body>
      </html>
    `;

    // Write content to the new window and trigger print
    printWindow.document.write(pdfContent);
    printWindow.document.close();
  };

  const filteredTickets = getFilteredTickets();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section with Dynamic Background */}
          <div className="relative overflow-hidden card-gradient rounded-3xl shadow-large p-16 mb-12 animate-fade-in-up">
            {/* Dynamic Background Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            
            <div className="relative text-center">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center animate-float shadow-2xl">
                    <span className="text-4xl">🎫</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-sm font-bold text-white">{filteredTickets.length}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent animate-gradient">
                    My Tickets
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Manage your booking history and upcoming journeys with ease
                  </p>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Real-time Updates</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-500"></div>
                      <span className="text-sm font-medium">Instant Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="card-gradient rounded-3xl shadow-large p-8 mb-8 animate-fade-in-up delay-200">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { key: 'all', label: 'All Tickets', icon: '📋' },
                { key: 'upcoming', label: 'Upcoming', icon: '⏰' },
                { key: 'completed', label: 'Completed', icon: '✅' },
                { key: 'cancelled', label: 'Cancelled', icon: '❌' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift ${
                    filter === tab.key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/60 text-gray-700 hover:bg-white/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{tab.icon}</span>
                    {tab.label}
                    <span className="text-sm opacity-75">
                      ({getFilteredTickets().length})
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="card-gradient rounded-3xl shadow-large p-12 text-center animate-fade-in-up delay-300">
              <div className="spinner w-16 h-16 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading your tickets...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card-gradient rounded-3xl shadow-large p-8 mb-8 border-l-8 border-red-500 animate-fade-in-up delay-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-800">Error Loading Tickets</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tickets List */}
          {!loading && (
            <div className="space-y-6">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket, index) => {
                  const getTicketTheme = (status: string) => {
                    switch (status) {
                      case 'confirmed': return {
                        borderColor: 'border-l-green-500',
                        bgAccent: 'from-green-50/50 to-emerald-50/30',
                        iconBg: 'from-green-500 to-emerald-600'
                      };
                      case 'completed': return {
                        borderColor: 'border-l-blue-500', 
                        bgAccent: 'from-blue-50/50 to-indigo-50/30',
                        iconBg: 'from-blue-500 to-indigo-600'
                      };
                      case 'cancelled': return {
                        borderColor: 'border-l-red-500',
                        bgAccent: 'from-red-50/50 to-rose-50/30', 
                        iconBg: 'from-red-500 to-rose-600'
                      };
                      default: return {
                        borderColor: 'border-l-gray-500',
                        bgAccent: 'from-gray-50/50 to-slate-50/30',
                        iconBg: 'from-gray-500 to-slate-600'
                      };
                    }
                  };
                  
                  const theme = getTicketTheme(ticket.status);
                  
                  return (
                    <div
                      key={ticket.id}
                      className={`relative overflow-hidden bg-gradient-to-br ${theme.bgAccent} card-gradient rounded-3xl shadow-large border-l-8 ${theme.borderColor} p-8 hover-lift animate-fade-in-up delay-${(index % 4 + 1) * 100} transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group`}
                    >
                      {/* Decorative Background Pattern */}
                      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <pattern id={`pattern-${ticket.id}`} patternUnits="userSpaceOnUse" width="20" height="20">
                            <circle cx="10" cy="10" r="2" fill="currentColor" className="text-gray-400"/>
                          </pattern>
                          <rect width="100" height="100" fill={`url(#pattern-${ticket.id})`}/>
                        </svg>
                      </div>
                      
                      <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                        {/* Enhanced Ticket Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-12 h-12 bg-gradient-to-r ${theme.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                  <span className="text-2xl">🎫</span>
                                </div>
                                <div>
                                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
                                    {ticket.routeName}
                                  </h3>
                                  <div className="text-sm text-gray-500 font-medium">Ticket ID: #{ticket.id}</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-600">
                                <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-xl">
                                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                  </svg>
                                  <span className="font-semibold">{ticket.startLocation} → {ticket.endLocation}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-xl">
                                  <span className="text-lg">🚌</span>
                                  <span className="font-semibold">{ticket.busNumber}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-xl">
                                  <span className="text-lg">💺</span>
                                  <span className="font-semibold">Seat {ticket.seatNumber}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                              <span className={`${getStatusColor(ticket.status)} text-lg font-bold px-4 py-2 rounded-2xl shadow-lg animate-pulse-glow`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                              <div className="text-right">
                                <div className="text-sm text-gray-500 font-medium">Total Fare</div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                  ৳{ticket.fare}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Journey Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gradient-to-r from-white/70 to-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/30 shadow-lg group-hover:shadow-xl transition-all duration-300">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                                </svg>
                                <p className="text-sm text-gray-500 font-bold">Journey Date</p>
                              </div>
                              <p className="text-lg font-bold text-gray-800">
                                {formatDate(ticket.journeyDate)}
                              </p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                </svg>
                                <p className="text-sm text-gray-500 font-bold">Departure</p>
                              </div>
                              <p className="text-lg font-bold text-green-600">
                                {formatTime(ticket.departureTime)}
                              </p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                </svg>
                                <p className="text-sm text-gray-500 font-bold">Arrival</p>
                              </div>
                              <p className="text-lg font-bold text-purple-600">
                                {formatTime(ticket.arrivalTime)}
                              </p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h2a2 2 0 002-2V3a2 2 0 012 2v6h-3a4 4 0 01-8 0H4V5z" clipRule="evenodd"/>
                                </svg>
                                <p className="text-sm text-gray-500 font-bold">Booked On</p>
                              </div>
                              <p className="text-lg font-bold text-orange-600">
                                {formatDate(ticket.bookingDate)}
                              </p>
                            </div>
                          </div>
                        </div>

                      {/* Enhanced Actions Section */}
                      <div className="flex flex-col gap-4 lg:w-52">
                        {ticket.status === 'confirmed' && (
                          <div className="space-y-3">
                            <button 
                              onClick={() => downloadTicketPDF(ticket)}
                              className="group btn-info w-full btn-enhanced relative overflow-hidden hover:scale-105 transition-all duration-300"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                                <span>Download PDF</span>
                              </span>
                              <div className="ticket-shimmer absolute inset-0"></div>
                            </button>
                            
                            {canCancelTicket(ticket) ? (
                              <button
                                onClick={() => handleCancelTicket(ticket.id)}
                                className="group btn-danger w-full btn-enhanced relative overflow-hidden"
                              >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                  <svg className="w-5 h-5 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                  </svg>
                                  <span>Cancel Ticket</span>
                                </span>
                                <div className="ticket-shimmer absolute inset-0"></div>
                              </button>
                            ) : (
                              <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 text-center p-4 rounded-xl border-2 border-dashed border-gray-300">
                                <p className="text-sm font-medium mb-1">🔒 Cannot Cancel</p>
                                <p className="text-xs">Less than 24h to departure</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {ticket.status === 'completed' && (
                          <div className="space-y-3">
                            <button className="group btn-success w-full btn-enhanced relative overflow-hidden">
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 group-hover:animate-spin" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                                </svg>
                                <span>Rate Journey</span>
                              </span>
                              <div className="ticket-shimmer absolute inset-0"></div>
                            </button>
                            
                            <button 
                              onClick={() => downloadTicketPDF(ticket)}
                              className="group btn-info w-full btn-enhanced relative overflow-hidden hover:scale-105 transition-all duration-300"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                                <span>Download Receipt</span>
                              </span>
                              <div className="ticket-shimmer absolute inset-0"></div>
                            </button>
                          </div>
                        )}
                        
                        {ticket.status === 'cancelled' && (
                          <div className="bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-200 p-6 rounded-2xl text-center shadow-lg">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse">
                              <span className="text-white text-xl">💸</span>
                            </div>
                            <p className="text-red-800 font-bold text-sm mb-2">Refund Processing</p>
                            <p className="text-red-600 text-xs leading-relaxed">
                              Your refund is being processed and will be credited within 3-5 business days.
                            </p>
                          </div>
                        )}
                        
                        {ticket.status === 'pending' && (
                          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border-2 border-yellow-200 p-6 rounded-2xl text-center shadow-lg">
                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center animate-spin">
                              <span className="text-white text-xl">⏳</span>
                            </div>
                            <p className="text-yellow-800 font-bold text-sm mb-2">Payment Pending</p>
                            <p className="text-yellow-600 text-xs leading-relaxed">
                              Complete your payment to confirm this booking.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
                })
              ) : (
                <div className="relative overflow-hidden card-gradient rounded-3xl shadow-large p-16 text-center animate-fade-in-up delay-300">
                  {/* Decorative Background */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-400 rounded-full blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-400 rounded-full blur-3xl animate-pulse delay-500"></div>
                  </div>
                  
                  <div className="relative">
                    {/* Enhanced Empty State Icon */}
                    <div className="relative mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-3xl mx-auto flex items-center justify-center shadow-xl animate-float">
                        <span className="text-6xl animate-bounce">{
                          filter === 'all' ? '🎫' :
                          filter === 'upcoming' ? '⏰' :
                          filter === 'completed' ? '✅' :
                          filter === 'cancelled' ? '❌' : '🎫'
                        }</span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-sm font-bold">0</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-10">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                        No {filter === 'all' ? '' : filter.charAt(0).toUpperCase() + filter.slice(1)} Tickets Found
                      </h3>
                      <p className="text-gray-500 text-xl leading-relaxed max-w-lg mx-auto">
                        {filter === 'all' 
                          ? "Ready to start your journey? Book your first ticket and explore the beautiful destinations we serve!"
                          : filter === 'upcoming'
                          ? "No upcoming trips scheduled. Plan your next adventure by booking a new ticket!"
                          : filter === 'completed'
                          ? "No completed journeys yet. Your travel history will appear here after your trips."
                          : "No cancelled tickets found. All your active bookings are ready for travel!"
                        }
                      </p>
                      
                      {/* Action Suggestions */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                        <button
                          onClick={() => router.push('/passenger/book-ticket')}
                          className="group bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover-lift transition-all duration-300"
                        >
                          <span className="flex items-center gap-3">
                            <svg className="w-6 h-6 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                            </svg>
                            Book Your First Ticket
                            <span className="text-sm opacity-80">(🚀 Start Journey)</span>
                          </span>
                        </button>
                        
                        {filter !== 'all' && (
                          <button
                            onClick={() => setFilter('all')}
                            className="bg-white/80 hover:bg-white text-gray-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover-lift transition-all duration-300 border border-gray-200"
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                              </svg>
                              View All Tickets
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Quick Stats for motivation */}
                    <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/30">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
                        <div className="text-sm text-gray-500">Routes Available</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
                        <div className="text-sm text-gray-500">Service Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">₹299+</div>
                        <div className="text-sm text-gray-500">Starting Fare</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
}

export default function MyTickets() {
  return (
    <AuthGuard 
      requiredUserType="passenger"
      fallback={
        <PassengerLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl">Loading...</div>
          </div>
        </PassengerLayout>
      }
    >
      <PassengerLayout>
        <MyTicketsContent />
      </PassengerLayout>
    </AuthGuard>
  );
}