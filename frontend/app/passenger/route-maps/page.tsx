'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PassengerLayout from '../../components/PassengerLayout';
import RouteMap from '../../components/RouteMap';

interface Route {
  id: number;
  name: string;
  startLocation: string;
  endLocation: string;
  stops: string;
  distance: number;
  duration: string;
  frequency: string;
}

interface Schedule {
  id: number;
  routeId: number;
  busNumber: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  fare: number;
  seatLayout: {
    rows: number;
    seatsPerRow: number;
    occupiedSeats: string[];
    premiumSeats: string[];
  };
}

export default function RouteMapsPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showSeatDetails, setShowSeatDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchSchedules = async (routeId: number) => {
    setLoadingSchedules(true);
    try {
      // Mock schedules data - in production this would come from API
      const mockSchedules: Schedule[] = [
        {
          id: 1,
          routeId: routeId,
          busNumber: `DH-${1000 + routeId}`,
          departureTime: '08:00',
          arrivalTime: '14:00',
          totalSeats: 40,
          availableSeats: 28,
          fare: 450,
          seatLayout: {
            rows: 10,
            seatsPerRow: 4,
            occupiedSeats: ['A1', 'A2', 'B3', 'C1', 'C4', 'D2', 'E1', 'E3', 'F4', 'H2', 'I1', 'J3'],
            premiumSeats: ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4']
          }
        },
        {
          id: 2,
          routeId: routeId,
          busNumber: `DH-${2000 + routeId}`,
          departureTime: '14:30',
          arrivalTime: '20:30',
          totalSeats: 40,
          availableSeats: 32,
          fare: 450,
          seatLayout: {
            rows: 10,
            seatsPerRow: 4,
            occupiedSeats: ['B2', 'C3', 'D1', 'F2', 'G4', 'H1', 'I3', 'J2'],
            premiumSeats: ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4']
          }
        }
      ];
      setSchedules(mockSchedules);
      setSelectedSchedule(mockSchedules[0]);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRoutes(data);
      if (data.length > 0) {
        setSelectedRoute(data[0]);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      // Demo data for development
      const demoRoutes: Route[] = [
        {
          id: 1,
          name: 'Dhaka - Chittagong Express',
          startLocation: 'Dhaka',
          endLocation: 'Chittagong',
          stops: 'Dhaka, Cumilla, Chittagong',
          distance: 264,
          duration: '6 hours',
          frequency: 'Every 2 hours'
        },
        {
          id: 2,
          name: 'Dhaka - Sylhet Highway',
          startLocation: 'Dhaka',
          endLocation: 'Sylhet',
          stops: 'Dhaka, Narsingdi, Bhairab, Sylhet',
          distance: 247,
          duration: '5.5 hours',
          frequency: 'Every 3 hours'
        },
        {
          id: 3,
          name: 'Dhaka - Rajshahi Direct',
          startLocation: 'Dhaka',
          endLocation: 'Rajshahi',
          stops: 'Dhaka, Rajshahi',
          distance: 256,
          duration: '6 hours',
          frequency: 'Every 4 hours'
        },
        {
          id: 4,
          name: 'Chittagong - Sylhet Connector',
          startLocation: 'Chittagong',
          endLocation: 'Sylhet',
          stops: 'Chittagong, Cumilla, Feni, Sylhet',
          distance: 198,
          duration: '4.5 hours',
          frequency: 'Daily'
        }
      ];
      setRoutes(demoRoutes);
      setSelectedRoute(demoRoutes[0]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.endLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = filterLocation === 'all' ||
      route.startLocation === filterLocation ||
      route.endLocation === filterLocation;
    
    return matchesSearch && matchesLocation;
  });

  const uniqueLocations = Array.from(
    new Set(routes.flatMap(route => [route.startLocation, route.endLocation]))
  );

  if (loading) {
    return (
      <PassengerLayout>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 animate-spin flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">🗺️</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Route Maps</h3>
              <p className="text-gray-600">Please wait while we load the route information...</p>
            </div>
          </div>
        </div>
      </PassengerLayout>
    );
  }

  return (
    <PassengerLayout>
      <div className="container mx-auto px-4 pb-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Interactive Route Maps
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our bus routes with interactive maps showing departure points, stops, and destinations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search routes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  />
                  <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                </div>
                
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Routes List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredRoutes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => {
                      setSelectedRoute(route);
                      fetchSchedules(route.id);
                      setShowSeatDetails(false);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                      selectedRoute?.id === route.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 border-transparent'
                        : 'bg-white/50 hover:bg-white/80 hover:shadow-md border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedRoute?.id === route.id ? 'bg-white/20' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      }`}>
                        🚌
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm mb-1 truncate ${
                          selectedRoute?.id === route.id ? 'text-white' : 'text-gray-800'
                        }`}>
                          {route.name}
                        </h3>
                        <p className={`text-xs mb-2 ${
                          selectedRoute?.id === route.id ? 'text-white/90' : 'text-gray-600'
                        }`}>
                          {route.startLocation} → {route.endLocation}
                        </p>
                        <div className="flex justify-between text-xs">
                          <span className={selectedRoute?.id === route.id ? 'text-white/80' : 'text-gray-500'}>
                            {route.distance}km
                          </span>
                          <span className={selectedRoute?.id === route.id ? 'text-white/80' : 'text-gray-500'}>
                            {route.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRoutes.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-600">No routes found matching your criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Display */}
          <div className="lg:col-span-2">
            {selectedRoute ? (
              <div className="space-y-6">
                {/* Route Details Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      🚌
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedRoute.name}</h2>
                      <p className="text-gray-600">{selectedRoute.startLocation} to {selectedRoute.endLocation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">{selectedRoute.distance}km</div>
                      <div className="text-sm text-blue-800">Total Distance</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">{selectedRoute.duration}</div>
                      <div className="text-sm text-purple-800">Duration</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">{selectedRoute.frequency}</div>
                      <div className="text-sm text-green-800">Frequency</div>
                    </div>
                  </div>

                  {/* Stops */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span>🚏</span> Bus Stops
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoute.stops.split(',').map((stop, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-sm text-gray-700 border border-gray-300"
                        >
                          {stop.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Seat Details Button */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowSeatDetails(!showSeatDetails)}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span>{showSeatDetails ? 'Hide Seat Details' : 'View Seat Details'}</span>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 ${showSeatDetails ? 'rotate-180' : ''}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>

                {/* Seat Details Section */}
                {showSeatDetails && (
                  <div className="mb-6 space-y-6 animate-fade-in-up">
                    {/* Schedule Selection */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">S</span>
                        Available Schedules
                      </h4>
                      
                      {loadingSchedules ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 animate-spin flex items-center justify-center">
                            <div className="w-8 h-8 bg-white rounded-full"></div>
                          </div>
                          <p className="text-gray-600">Loading schedules...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {schedules.map((schedule) => (
                            <div
                              key={schedule.id}
                              onClick={() => setSelectedSchedule(schedule)}
                              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                                selectedSchedule?.id === schedule.id
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 border-transparent'
                                  : 'bg-white/50 hover:bg-white/80 hover:shadow-md border-gray-200'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h5 className={`font-bold text-lg ${selectedSchedule?.id === schedule.id ? 'text-white' : 'text-gray-800'}`}>
                                    {schedule.busNumber}
                                  </h5>
                                  <p className={`text-sm ${selectedSchedule?.id === schedule.id ? 'text-white/90' : 'text-gray-600'}`}>
                                    {schedule.departureTime} - {schedule.arrivalTime}
                                  </p>
                                </div>
                                <div className={`text-right ${selectedSchedule?.id === schedule.id ? 'text-white' : 'text-blue-600'}`}>
                                  <div className="font-bold text-xl">৳{schedule.fare}</div>
                                  <div className="text-sm opacity-80">per seat</div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${selectedSchedule?.id === schedule.id ? 'text-white/80' : 'text-gray-500'}`}>
                                  {schedule.availableSeats}/{schedule.totalSeats} available
                                </span>
                                <div className={`w-16 h-2 rounded-full ${selectedSchedule?.id === schedule.id ? 'bg-white/30' : 'bg-gray-200'}`}>
                                  <div 
                                    className={`h-full rounded-full ${
                                      selectedSchedule?.id === schedule.id ? 'bg-white' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${(schedule.availableSeats / schedule.totalSeats) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Seat Layout */}
                    {selectedSchedule && (
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
                        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">L</span>
                          Seat Layout - {selectedSchedule.busNumber}
                        </h4>
                        
                        {/* Seat Legend */}
                        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-500 rounded border-2 border-green-600 flex items-center justify-center text-white text-xs font-bold">✓</div>
                            <span className="text-sm text-gray-700">Available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-red-500 rounded border-2 border-red-600 flex items-center justify-center text-white text-xs font-bold">×</div>
                            <span className="text-sm text-gray-700">Occupied</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded border-2 border-yellow-600 flex items-center justify-center text-white text-xs font-bold">★</div>
                            <span className="text-sm text-gray-700">Premium (+৳50)</span>
                          </div>
                        </div>
                        
                        {/* Bus Layout */}
                        <div className="max-w-md mx-auto">
                          {/* Driver Section */}
                          <div className="bg-gray-200 rounded-t-3xl p-4 mb-4 text-center">
                            <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">D</span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">Driver</p>
                          </div>
                          
                          {/* Seats Grid */}
                          <div className="bg-white rounded-2xl p-6 shadow-inner border-2 border-gray-200">
                            <div className="grid gap-3">
                              {Array.from({ length: selectedSchedule.seatLayout.rows }, (_, rowIndex) => {
                                const rowLetter = String.fromCharCode(65 + rowIndex); // A, B, C, etc.
                                return (
                                  <div key={rowIndex} className="grid grid-cols-5 gap-2 items-center">
                                    {/* Left seats */}
                                    {[1, 2].map(seatNum => {
                                      const seatId = `${rowLetter}${seatNum}`;
                                      const isOccupied = selectedSchedule.seatLayout.occupiedSeats.includes(seatId);
                                      const isPremium = selectedSchedule.seatLayout.premiumSeats.includes(seatId);
                                      
                                      return (
                                        <div
                                          key={seatId}
                                          className={`w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                                            isOccupied
                                              ? 'bg-red-500 border-red-600 text-white cursor-not-allowed'
                                              : isPremium
                                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-600 text-white hover:scale-110 cursor-pointer'
                                              : 'bg-green-500 border-green-600 text-white hover:scale-110 cursor-pointer'
                                          }`}
                                          title={`Seat ${seatId} - ${isOccupied ? 'Occupied' : isPremium ? 'Premium (৳' + (selectedSchedule.fare + 50) + ')' : 'Available (৳' + selectedSchedule.fare + ')'}`}
                                        >
                                          {isOccupied ? '×' : isPremium ? '★' : '✓'}
                                        </div>
                                      );
                                    })}
                                    
                                    {/* Aisle */}
                                    <div className="w-2 flex items-center justify-center">
                                      <div className="w-0.5 h-6 bg-gray-300 rounded"></div>
                                    </div>
                                    
                                    {/* Right seats */}
                                    {[3, 4].map(seatNum => {
                                      const seatId = `${rowLetter}${seatNum}`;
                                      const isOccupied = selectedSchedule.seatLayout.occupiedSeats.includes(seatId);
                                      const isPremium = selectedSchedule.seatLayout.premiumSeats.includes(seatId);
                                      
                                      return (
                                        <div
                                          key={seatId}
                                          className={`w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                                            isOccupied
                                              ? 'bg-red-500 border-red-600 text-white cursor-not-allowed'
                                              : isPremium
                                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-600 text-white hover:scale-110 cursor-pointer'
                                              : 'bg-green-500 border-green-600 text-white hover:scale-110 cursor-pointer'
                                          }`}
                                          title={`Seat ${seatId} - ${isOccupied ? 'Occupied' : isPremium ? 'Premium (৳' + (selectedSchedule.fare + 50) + ')' : 'Available (৳' + selectedSchedule.fare + ')'}`}
                                        >
                                          {isOccupied ? '×' : isPremium ? '★' : '✓'}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Bus Back */}
                          <div className="bg-gray-200 rounded-b-3xl p-2 mt-4 text-center">
                            <p className="text-xs text-gray-600">Emergency Exit</p>
                          </div>
                        </div>
                        
                        {/* Seat Statistics */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                            <div className="text-2xl font-bold text-green-600">{selectedSchedule.availableSeats}</div>
                            <div className="text-sm text-green-800">Available Seats</div>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                            <div className="text-2xl font-bold text-red-600">{selectedSchedule.totalSeats - selectedSchedule.availableSeats}</div>
                            <div className="text-sm text-red-800">Occupied Seats</div>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <div className="text-2xl font-bold text-yellow-600">{selectedSchedule.seatLayout.premiumSeats.length}</div>
                            <div className="text-sm text-yellow-800">Premium Seats</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive Map */}
                <RouteMap route={selectedRoute} className="h-[500px] w-full" />
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 text-center h-[500px] flex items-center justify-center">
                <div>
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Route</h3>
                  <p className="text-gray-600">Choose a route from the sidebar to view it on the map</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PassengerLayout>
  );
}