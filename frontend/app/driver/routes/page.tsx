'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverLayout from '../../components/DriverLayout';

interface Route {
  id: number;
  name: string;
  startLocation: string;
  endLocation: string;
  stops: string; // API returns comma-separated string
  distance: number | string;
  estimatedDuration: number;
  fare: number | string;
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function DriverRoutes() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeDriverPage = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const userData = localStorage.getItem('user');

      console.log('Initializing driver routes page...', { token: !!token, userType, userData: !!userData });

      // Optional authentication - routes can be viewed without login
      let authenticatedUser = null;
      if (token && userType === 'driver' && userData) {
        try {
          authenticatedUser = JSON.parse(userData!);
          setUser(authenticatedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      await fetchRoutesData();
    };

    const fetchRoutesData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        console.log('Fetching routes...', { token: !!token });
        
        const response = await fetch('http://localhost:3000/driver/routes/all', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication expired. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            localStorage.removeItem('user');
            router.push('/driver/login');
            return;
          }
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Failed to fetch routes: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Routes data:', data);
        setRoutes(data);
        setFilteredRoutes(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load routes: ${errorMessage}`);
        console.error('Error fetching routes:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeDriverPage();
  }, [router]);

  // Filter routes based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRoutes(routes);
    } else {
      const filtered = routes.filter(route => 
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.endLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.stops.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoutes(filtered);
    }
  }, [searchTerm, routes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect above
  };

  const viewRouteDetails = (route: Route) => {
    setSelectedRoute(route);
    setShowRouteDetails(true);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const formatFare = (fare: number | string): string => {
    const fareNumber = typeof fare === 'string' ? parseFloat(fare) : fare;
    return `৳${fareNumber.toFixed(2)}`;
  };

  if (loading) {
    return (
      <DriverLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </DriverLayout>
    );
  }

  return (
    <DriverLayout>
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Available Routes</h1>
                <p className="text-gray-600">Browse all bus routes in the system</p>
              </div>
              <div className="text-sm text-gray-600">
                Total Routes: <span className="font-semibold text-blue-600">{filteredRoutes.length}</span>
                {searchTerm && (
                  <span className="ml-2">
                    (Filtered from {routes.length})
                  </span>
                )}
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search routes by name, locations, or stops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
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

            {/* Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className={`bg-white border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow ${
                    !route.isActive ? 'opacity-60 border-gray-300' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{route.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            route.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {route.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{formatFare(route.fare)}</div>
                      <div className="text-sm text-gray-500">{formatDuration(route.estimatedDuration)}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">From:</span>
                      <span className="text-sm text-gray-800">{route.startLocation}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">To:</span>
                      <span className="text-sm text-gray-800">{route.endLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Distance:</span>
                      <span className="text-sm text-gray-800">{route.distance} km</span>
                    </div>
                  </div>

                  {route.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{route.description}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {route.stops.split(',').length} stops
                    </div>
                    <button
                      onClick={() => viewRouteDetails(route)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredRoutes.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  {searchTerm ? 'No routes found matching your search' : 'No routes available'}
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear search to see all routes
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Route Details Modal */}
      {showRouteDetails && selectedRoute && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedRoute.name}
                  </h3>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedRoute.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedRoute.isActive ? 'Active Route' : 'Inactive Route'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowRouteDetails(false);
                    setSelectedRoute(null);
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
                        <span className="text-gray-600">From:</span>
                        <span className="font-medium">{selectedRoute.startLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">To:</span>
                        <span className="font-medium">{selectedRoute.endLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium">{selectedRoute.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{formatDuration(selectedRoute.estimatedDuration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fare:</span>
                        <span className="font-bold text-blue-600">{formatFare(selectedRoute.fare)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Bus Stops ({selectedRoute.stops.split(',').length})</h4>
                    <div className="max-h-40 overflow-y-auto">
                      <ol className="space-y-2">
                        {selectedRoute.stops.split(',').map((stop, index) => (
                          <li key={index} className="flex items-center">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-3">
                              {index + 1}
                            </span>
                            <span className="text-sm text-gray-700">{stop.trim()}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRoute.description && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{selectedRoute.description}</p>
                </div>
              )}

              <div className="text-xs text-gray-500 border-t pt-4">
                <div className="flex justify-between">
                  <span>Created: {new Date(selectedRoute.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(selectedRoute.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DriverLayout>
  );
}