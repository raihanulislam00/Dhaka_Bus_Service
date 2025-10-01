'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverNavbar from '../../components/DriverNavbar';
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
      <div className="min-h-screen bg-gray-50">
        <DriverNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DriverNavbar username={user?.username} />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome, {user?.fullName}!
                </h1>
                <p className="text-gray-600">Driver Dashboard</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Status: {user?.status || 'Pending'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Today's Schedule</h3>
              </div>
              <p className="text-gray-600 mb-4">View your assigned routes for today</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                View Schedule
              </button>
            </div>

            {/* Route Assignment */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">My Routes</h3>
              </div>
              <p className="text-gray-600 mb-4">Manage your assigned bus routes</p>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                View Routes
              </button>
            </div>

            {/* Location Sharing */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg mr-4 ${locationSharing ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <svg className={`w-6 h-6 ${locationSharing ? 'text-green-600' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Location Sharing</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {locationSharing ? 'Currently sharing location with admin' : 'Share your location for real-time tracking'}
              </p>
              {lastLocationUpdate && (
                <p className="text-xs text-gray-500 mb-4">
                  Last updated: {lastLocationUpdate.toLocaleTimeString()}
                </p>
              )}
              <button
                onClick={locationSharing ? stopLocationSharing : startLocationSharing}
                className={`w-full py-2 px-4 rounded-lg transition-colors ${
                  locationSharing 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {locationSharing ? '🚫 Stop Sharing' : '📍 Start Sharing'}
              </button>
            </div>
          </div>

          {/* Status Notice */}
          {user?.status !== 'active' && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">Account Pending Approval</h3>
                  <p className="text-yellow-700">
                    Your driver account is currently under review. You will be able to access all features once approved by the administration.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            <div className="text-gray-600">
              <p>No recent activity to show. Your trip history will appear here once you start driving.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}