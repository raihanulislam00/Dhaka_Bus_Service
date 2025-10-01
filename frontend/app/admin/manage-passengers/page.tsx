'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../../components/AdminNavbar';

interface Passenger {
  id: number;
  username: string;
  fullName: string;
  isActive: boolean;
  mail?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  gender?: string;
  photoPath?: string;
}

interface Ticket {
  id: number;
  routeName: string;
  journeyDate: string;
  seatNumber: string;
  status: string;
  fare: number;
}

export default function ManagePassengers() {
  const router = useRouter();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [passengerTickets, setPassengerTickets] = useState<Ticket[]>([]);
  const [showTickets, setShowTickets] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeAdminPage = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const userData = localStorage.getItem('user');

      console.log('Initializing admin page...', { token: !!token, userType, userData: !!userData });

      if (!token || userType !== 'admin' || !userData) {
        console.log('Authentication failed, redirecting to login...');
        router.push('/admin/login');
        return;
      }

      try {
        setUser(JSON.parse(userData));
        // Fetch passengers after setting user
        await fetchPassengersData();
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/admin/login');
      }
    };

    const fetchPassengersData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        
        console.log('Fetching passengers...', { token: !!token, userType });
        
        if (!token || userType !== 'admin') {
          setError('Authentication required');
          router.push('/admin/login');
          return;
        }

        console.log('Making request to:', 'http://localhost:3000/admin/passengers');
        const response = await fetch('http://localhost:3000/admin/passengers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication expired. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            localStorage.removeItem('user');
            router.push('/admin/login');
            return;
          }
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Failed to fetch passengers: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setPassengers(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load passengers: ${errorMessage}`);
        console.error('Error fetching passengers:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAdminPage();
  }, [router]);

  const fetchPassengers = async (searchName?: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      if (!token || userType !== 'admin') {
        setError('Authentication required');
        router.push('/admin/login');
        return;
      }

      const url = searchName 
        ? `http://localhost:3000/admin/passengers/search?name=${encodeURIComponent(searchName)}`
        : 'http://localhost:3000/admin/passengers';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('user');
          router.push('/admin/login');
          return;
        }
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch passengers: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPassengers(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to load passengers: ${errorMessage}`);
      console.error('Error fetching passengers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPassengerTickets = async (passengerId: number) => {
    try {
      setTicketsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/admin/passengers/${passengerId}/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const tickets = await response.json();
      setPassengerTickets(tickets);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setPassengerTickets([]);
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPassengers(searchTerm.trim() || undefined);
  };

  const togglePassengerStatus = async (passengerId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/admin/passengers/${passengerId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update passenger status');
      }

      // Refresh passengers list
      fetchPassengers(searchTerm.trim() || undefined);
    } catch (err) {
      console.error('Error updating passenger status:', err);
      alert('Failed to update passenger status');
    }
  };

  const deletePassenger = async (passengerId: number, passengerName: string) => {
    if (confirm(`Are you sure you want to delete passenger "${passengerName}"?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/admin/passengers/${passengerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete passenger');
        }

        // Refresh passengers list
        fetchPassengers(searchTerm.trim() || undefined);
        alert('Passenger deleted successfully');
      } catch (err) {
        console.error('Error deleting passenger:', err);
        alert('Failed to delete passenger');
      }
    }
  };

  const viewPassengerTickets = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setShowTickets(true);
    fetchPassengerTickets(passenger.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading passengers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar username={user?.username} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Manage Passengers</h1>
                <p className="text-gray-600">View and manage registered passengers</p>
              </div>
              <div className="text-sm text-gray-600">
                Total Passengers: <span className="font-semibold text-blue-600">{passengers.length}</span>
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search passengers by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    fetchPassengers();
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Passengers Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Passenger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {passengers.map((passenger) => (
                    <tr key={passenger.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {passenger.photoPath ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`http://localhost:3000/passenger/photo/${passenger.photoPath}`}
                                alt={passenger.fullName}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {passenger.fullName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {passenger.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{passenger.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {passenger.mail || 'No email'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {passenger.phone || 'No phone'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            passenger.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {passenger.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(passenger.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => viewPassengerTickets(passenger)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded transition-colors"
                        >
                          View Tickets
                        </button>
                        <button
                          onClick={() => togglePassengerStatus(passenger.id, passenger.isActive)}
                          className={`px-3 py-1 rounded transition-colors ${
                            passenger.isActive
                              ? 'text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200'
                              : 'text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200'
                          }`}
                        >
                          {passenger.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deletePassenger(passenger.id, passenger.fullName)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {passengers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No passengers found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Modal */}
      {showTickets && selectedPassenger && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Tickets for {selectedPassenger.fullName}
                </h3>
                <button
                  onClick={() => {
                    setShowTickets(false);
                    setSelectedPassenger(null);
                    setPassengerTickets([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {ticketsLoading ? (
                <div className="text-center py-4">Loading tickets...</div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {passengerTickets.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ticket ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Route
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Journey Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seat
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fare
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {passengerTickets.map((ticket) => (
                          <tr key={ticket.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              #{ticket.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {ticket.routeName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(ticket.journeyDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {ticket.seatNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  ticket.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800'
                                    : ticket.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ৳{ticket.fare}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No tickets found for this passenger
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}