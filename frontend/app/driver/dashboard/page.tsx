'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverLayout from '../../components/DriverLayout';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  fullName: string;
  status: string;
}

export default function DriverDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [lastLocationUpdate, setLastLocationUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('user');

    if (!token || userType !== 'driver' || !userData) {
      router.push('/driver/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/driver/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    router.push('/');
  };

  const updateLocation = async (latitude: number, longitude: number) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:3000/driver/${user.id}/location`,
        { latitude, longitude },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setLastLocationUpdate(new Date());
      console.log('Location updated successfully');
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setLocationSharing(true);
    
    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Error getting your location. Please check your location permissions.');
        setLocationSharing(false);
      }
    );

    // Update location every 30 seconds
    const locationInterval = setInterval(() => {
      if (locationSharing) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            updateLocation(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    }, 30000);

    // Store interval ID to clear later
    localStorage.setItem('locationInterval', locationInterval.toString());
  };

  const stopLocationSharing = () => {
    setLocationSharing(false);
    const intervalId = localStorage.getItem('locationInterval');
    if (intervalId) {
      clearInterval(parseInt(intervalId));
      localStorage.removeItem('locationInterval');
    }
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
      {/* Enhanced Header Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-gradient rounded-3xl shadow-large p-12 mb-12 animate-fade-in-up">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex justify-between items-center relative">
              <div className="animate-slide-in-left">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center animate-float">
                    <span className="text-3xl">🚌</span>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold gradient-text">
                      Welcome, {user?.fullName}!
                    </h1>
                    <p className="text-xl text-gray-600 mt-2 flex items-center gap-2">
                      <span className="text-2xl">🛣️</span>
                      Driver Dashboard
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-blue-100 px-6 py-3 rounded-2xl inline-block">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                      user?.status === 'active' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                    }`}>
                      Status: {user?.status || 'Pending'}
                    </span>
                    {lastLocationUpdate && (
                      <span className="text-green-800 font-medium text-sm">
                        📍 Location updated: {lastLocationUpdate.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="animate-slide-in-right">
                <button
                  onClick={handleLogout}
                  className="btn-danger px-8 py-4 text-lg hover-lift"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                    </svg>
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Driver Action Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Today's Schedule */}
            <div className="management-card hover-lift animate-fade-in-up delay-100">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl mr-4 shadow-lg animate-float">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">Today's Schedule</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="status-badge status-info">3 Routes Assigned</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                View your assigned routes, departure times, and passenger capacity for today's trips.
              </p>
              <button className="btn-primary w-full hover-lift">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  View Schedule
                </span>
              </button>
            </div>

            {/* Route Assignment */}
            <div className="management-card hover-lift animate-fade-in-up delay-200">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl mr-4 shadow-lg animate-float delay-100">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">My Routes</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="status-badge status-success">Active Routes</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage your assigned bus routes, view route maps, and check passenger information.
              </p>
              <button className="btn-success w-full hover-lift">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  View Routes
                </span>
              </button>
            </div>

            {/* Enhanced Location Sharing */}
            <div className="management-card hover-lift animate-fade-in-up delay-300">
              <div className="flex items-center mb-6">
                <div className={`p-4 rounded-2xl mr-4 shadow-lg animate-float delay-200 ${
                  locationSharing 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">Location Sharing</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`status-badge ${locationSharing ? 'status-active' : 'status-inactive'}`}>
                      {locationSharing ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                    {locationSharing && (
                      <span className="status-badge status-info animate-pulse">Live</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {locationSharing 
                  ? 'Your location is being shared with admin for real-time bus tracking and passenger information.' 
                  : 'Enable location sharing to help passengers track your bus and improve service reliability.'}
              </p>
              {lastLocationUpdate && (
                <div className="bg-green-50 p-3 rounded-xl border border-green-200 mb-4">
                  <p className="text-green-700 text-sm font-medium">
                    📍 Last updated: {lastLocationUpdate.toLocaleTimeString()}
                  </p>
                </div>
              )}
              <button
                onClick={locationSharing ? stopLocationSharing : startLocationSharing}
                className={`w-full py-3 px-4 rounded-2xl font-bold transition-all duration-300 hover-lift ${
                  locationSharing 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {locationSharing ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                      </svg>
                      Stop Sharing
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      Start Sharing Location
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Enhanced Status Notice */}
          {user?.status !== 'active' && (
            <div className="card-gradient rounded-3xl shadow-large p-8 mb-12 animate-fade-in-up delay-400 border-l-8 border-yellow-500">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-yellow-800 mb-3">Account Pending Approval</h3>
                  <p className="text-yellow-700 text-lg leading-relaxed mb-4">
                    Your driver account is currently under review by our administration team. You will be able to access all features once approved.
                  </p>
                  <div className="flex gap-3">
                    <span className="status-badge status-warning">Under Review</span>
                    <span className="status-badge status-pending">Pending Approval</span>
                  </div>
                  <div className="mt-4 bg-yellow-100 p-4 rounded-xl">
                    <p className="text-yellow-800 text-sm">
                      💡 <strong>Next Steps:</strong> The admin team will review your documents and contact information. This process typically takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Recent Activity */}
          <div className="card-gradient rounded-3xl shadow-large p-10 animate-fade-in-up delay-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold gradient-text flex items-center gap-3">
                  <span className="text-4xl">📈</span>
                  Recent Activity
                </h2>
                <p className="text-gray-600 mt-2">Your driving history and performance metrics</p>
              </div>
              <div className="flex gap-3">
                <button className="btn-outline text-sm px-4 py-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                    </svg>
                    Refresh
                  </span>
                </button>
              </div>
            </div>
            
            {user?.status === 'active' ? (
              <div className="space-y-6">
                {/* Mock recent activity for active drivers */}
                <div className="activity-item">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-gray-800">Trip completed</p>
                        <span className="flex items-center text-sm text-gray-500 gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                          </svg>
                          2 hours ago
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">Dhaka to Chittagong route - 45 passengers, on-time arrival</p>
                      <div className="flex gap-2 mt-3">
                        <span className="status-badge status-success">Completed</span>
                        <span className="status-badge status-info">On-time</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl">🚌</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Ready to Start Driving?</h3>
                <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
                  Once your account is approved, your trip history and performance metrics will appear here. Start building your driving record!
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <span className="status-badge status-info">Awaiting First Trip</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}