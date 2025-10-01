'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverNavbar from '../../components/DriverNavbar';

interface Trip {
  id: number;
  scheduleId: number;
  routeName: string;
  startLocation: string;
  endLocation: string;
  departureTime: string;
  arrivalTime: string;
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  busNumber: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  totalSeats: number;
  bookedSeats: number;
  revenue: number;
  distance: number;
  duration: number; // in minutes
  fuelConsumed?: number;
  notes?: string;
}

interface Schedule {
  id: number;
  route: {
    id: number;
    name: string;
    startLocation: string;
    endLocation: string;
    distance: number;
    fare: number;
  };
  busNumber: string;
  departureTime: string;
  arrivalTime: string;
  dayOfWeek: string;
  totalSeats: number;
  availableSeats: number;
  isActive: boolean;
}

export default function DriverTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, all
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'trips' | 'schedules'>('trips');

  useEffect(() => {
    const initializeDriverPage = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const userData = localStorage.getItem('user');

      console.log('Initializing driver trips page...', { token: !!token, userType, userData: !!userData });

      // Optional authentication - trips can be viewed without login for demo
      if (token && userType === 'driver' && userData) {
        try {
          const authenticatedUser = JSON.parse(userData);
          setUser(authenticatedUser);
          await fetchDriverSchedules(authenticatedUser.id);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      await generateMockTripData();
    };

    const fetchDriverSchedules = async (driverId: number) => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching driver schedules...', { driverId });
        
        const response = await fetch(`http://localhost:3000/driver/${driverId}/schedules`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch schedules: ${response.status}`);
        }

        const data = await response.json();
        console.log('Schedules data:', data);
        setSchedules(data);
      } catch (err) {
        console.error('Error fetching schedules:', err);
      }
    };

    const generateMockTripData = async () => {
      try {
        setLoading(true);
        
        // Generate mock trip data for demonstration
        const mockTrips: Trip[] = [
          {
            id: 1,
            scheduleId: 1,
            routeName: "Dhanmondi - Gulshan Express",
            startLocation: "Dhanmondi",
            endLocation: "Gulshan",
            departureTime: "08:00",
            arrivalTime: "08:45",
            actualDepartureTime: "08:02",
            actualArrivalTime: "08:47",
            busNumber: "DBS-101",
            date: "2025-10-01",
            status: "completed",
            totalSeats: 45,
            bookedSeats: 38,
            revenue: 950,
            distance: 12.5,
            duration: 47,
            fuelConsumed: 8.5,
            notes: "Heavy traffic on Farmgate"
          },
          {
            id: 2,
            scheduleId: 2,
            routeName: "Airport Shuttle Service",
            startLocation: "Hazrat Shahjalal International Airport",
            endLocation: "Motijheel",
            departureTime: "10:30",
            arrivalTime: "11:25",
            actualDepartureTime: "10:30",
            actualArrivalTime: "11:20",
            busNumber: "DBS-102",
            date: "2025-10-01",
            status: "completed",
            totalSeats: 35,
            bookedSeats: 32,
            revenue: 2560,
            distance: 18.2,
            duration: 55,
            fuelConsumed: 12.3
          },
          {
            id: 3,
            scheduleId: 1,
            routeName: "Dhanmondi - Gulshan Express",
            startLocation: "Dhanmondi",
            endLocation: "Gulshan",
            departureTime: "14:00",
            arrivalTime: "14:45",
            actualDepartureTime: "14:05",
            busNumber: "DBS-101",
            date: "2025-10-01",
            status: "in-progress",
            totalSeats: 45,
            bookedSeats: 28,
            revenue: 700,
            distance: 12.5,
            duration: 45
          },
          {
            id: 4,
            scheduleId: 3,
            routeName: "University Circuit",
            startLocation: "Dhaka University",
            endLocation: "BUET",
            departureTime: "16:30",
            arrivalTime: "17:00",
            busNumber: "DBS-103",
            date: "2025-10-01",
            status: "scheduled",
            totalSeats: 40,
            bookedSeats: 15,
            revenue: 300,
            distance: 8.5,
            duration: 30
          },
          {
            id: 5,
            scheduleId: 2,
            routeName: "Airport Shuttle Service",
            startLocation: "Hazrat Shahjalal International Airport",
            endLocation: "Motijheel",
            departureTime: "09:00",
            arrivalTime: "09:55",
            actualDepartureTime: "09:03",
            actualArrivalTime: "09:58",
            busNumber: "DBS-102",
            date: "2025-09-30",
            status: "completed",
            totalSeats: 35,
            bookedSeats: 29,
            revenue: 2320,
            distance: 18.2,
            duration: 58,
            fuelConsumed: 13.1,
            notes: "Flight delay caused higher passenger load"
          },
          {
            id: 6,
            scheduleId: 1,
            routeName: "Dhanmondi - Gulshan Express",
            startLocation: "Dhanmondi",
            endLocation: "Gulshan",
            departureTime: "07:30",
            arrivalTime: "08:15",
            actualDepartureTime: "07:32",
            actualArrivalTime: "08:18",
            busNumber: "DBS-101",
            date: "2025-09-30",
            status: "completed",
            totalSeats: 45,
            bookedSeats: 42,
            revenue: 1050,
            distance: 12.5,
            duration: 48,
            fuelConsumed: 9.2
          }
        ];

        setTrips(mockTrips);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load trips: ${errorMessage}`);
        console.error('Error generating trip data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeDriverPage();
  }, [router]);

  const filteredTrips = trips.filter(trip => {
    const tripDate = new Date(trip.date);
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return tripDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return tripDate >= monthAgo;
      default:
        return true;
    }
  });

  const getTripStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toFixed(2)}`;
  };

  const calculateStats = () => {
    const completedTrips = filteredTrips.filter(trip => trip.status === 'completed');
    const totalRevenue = completedTrips.reduce((sum, trip) => sum + trip.revenue, 0);
    const totalDistance = completedTrips.reduce((sum, trip) => sum + trip.distance, 0);
    const totalFuel = completedTrips.reduce((sum, trip) => sum + (trip.fuelConsumed || 0), 0);
    
    return {
      totalTrips: completedTrips.length,
      totalRevenue,
      totalDistance,
      averageRevenue: completedTrips.length > 0 ? totalRevenue / completedTrips.length : 0,
      fuelEfficiency: totalDistance > 0 && totalFuel > 0 ? totalDistance / totalFuel : 0
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DriverNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading trips...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DriverNavbar username={user?.username} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Trip History</h1>
                <p className="text-gray-600">View your driving history and performance</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('trips')}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'trips'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Trip History
              </button>
              <button
                onClick={() => setActiveTab('schedules')}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'schedules'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Schedules
              </button>
            </div>

            {/* Stats Cards */}
            {activeTab === 'trips' && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalTrips}</div>
                  <div className="text-sm text-blue-600">Completed Trips</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="text-sm text-green-600">Total Revenue</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalDistance.toFixed(1)} km</div>
                  <div className="text-sm text-purple-600">Distance Covered</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.averageRevenue)}</div>
                  <div className="text-sm text-yellow-600">Avg per Trip</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">{stats.fuelEfficiency.toFixed(1)} km/L</div>
                  <div className="text-sm text-orange-600">Fuel Efficiency</div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Content */}
          {activeTab === 'trips' ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {filteredTrips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">No trips found for the selected period</div>
                  <p className="text-gray-400">Complete some trips to see your history here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trip Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Schedule
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passengers
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTrips.map((trip) => (
                        <tr key={trip.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{trip.routeName}</div>
                              <div className="text-sm text-gray-500">
                                {trip.startLocation} → {trip.endLocation}
                              </div>
                              <div className="text-xs text-gray-400">{formatDate(trip.date)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatTime(trip.departureTime)} - {formatTime(trip.arrivalTime)}
                            </div>
                            <div className="text-sm text-gray-500">Bus {trip.busNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTripStatusColor(trip.status)}`}
                            >
                              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {trip.bookedSeats}/{trip.totalSeats}
                            </div>
                            <div className="text-xs text-gray-500">
                              {((trip.bookedSeats / trip.totalSeats) * 100).toFixed(0)}% full
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(trip.revenue)}
                            </div>
                            <div className="text-xs text-gray-500">{trip.distance} km</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedTrip(trip);
                                setShowTripDetails(true);
                              }}
                              className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">My Assigned Schedules</h3>
              {schedules.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">No schedules assigned</div>
                  <p className="text-gray-400">Contact admin to get schedule assignments</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{schedule.route.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {schedule.route.startLocation} → {schedule.route.endLocation}
                      </p>
                      <div className="text-sm space-y-1">
                        <div>Day: {schedule.dayOfWeek}</div>
                        <div>Time: {schedule.departureTime} - {schedule.arrivalTime}</div>
                        <div>Bus: {schedule.busNumber}</div>
                        <div>Seats: {schedule.totalSeats}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trip Details Modal */}
      {showTripDetails && selectedTrip && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Trip Details - {selectedTrip.routeName}
                  </h3>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTripStatusColor(selectedTrip.status)}`}
                  >
                    {selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowTripDetails(false);
                    setSelectedTrip(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Route Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Route:</span>
                        <span className="font-medium">{selectedTrip.routeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">From:</span>
                        <span className="font-medium">{selectedTrip.startLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">To:</span>
                        <span className="font-medium">{selectedTrip.endLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium">{selectedTrip.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bus Number:</span>
                        <span className="font-medium">{selectedTrip.busNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Trip Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(selectedTrip.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Scheduled:</span>
                        <span className="font-medium">{selectedTrip.departureTime} - {selectedTrip.arrivalTime}</span>
                      </div>
                      {selectedTrip.actualDepartureTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Actual:</span>
                          <span className="font-medium">
                            {selectedTrip.actualDepartureTime} - {selectedTrip.actualArrivalTime || 'In Progress'}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passengers:</span>
                        <span className="font-medium">{selectedTrip.bookedSeats}/{selectedTrip.totalSeats}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-bold text-green-600">{formatCurrency(selectedTrip.revenue)}</span>
                      </div>
                      {selectedTrip.fuelConsumed && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel Used:</span>
                          <span className="font-medium">{selectedTrip.fuelConsumed}L</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedTrip.notes && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Trip Notes</h4>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{selectedTrip.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}