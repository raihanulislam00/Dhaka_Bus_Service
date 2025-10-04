'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

interface User {
  id: number;
  username: string;
  name: string;
  mail: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('user');

    if (!token || userType !== 'admin' || !userData) {
      router.push('/admin/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/admin/login');
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Enhanced Header Section */}
      <div className="mb-8">
          <div className="card-gradient rounded-3xl shadow-large p-12 mb-12 animate-fade-in-up">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex justify-between items-center relative">
              <div className="animate-slide-in-left">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-float">
                    <span className="text-3xl">👨‍💼</span>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold gradient-text">
                      Welcome, {user?.name}!
                    </h1>
                    <p className="text-xl text-gray-600 mt-2 flex items-center gap-2">
                      <span className="text-2xl">🏢</span>
                      Administration Dashboard
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-2xl inline-block">
                  <p className="text-blue-800 font-medium">
                    🌟 System running smoothly • Last login: Today, 9:30 AM
                  </p>
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

          {/* Enhanced Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="stats-card bg-gradient-to-br from-blue-500 to-blue-600 hover-lift animate-fade-in-up delay-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Total Passengers</p>
                  <p className="text-4xl font-bold text-white mb-2">1,234</p>
                  <p className="text-blue-200 text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    +12% this month
                  </p>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="stats-card bg-gradient-to-br from-green-500 to-emerald-600 hover-lift animate-fade-in-up delay-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-2">Active Drivers</p>
                  <p className="text-4xl font-bold text-white mb-2">89</p>
                  <p className="text-green-200 text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    3 online now
                  </p>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="stats-card bg-gradient-to-br from-purple-500 to-indigo-600 hover-lift animate-fade-in-up delay-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-2">Daily Trips</p>
                  <p className="text-4xl font-bold text-white mb-2">456</p>
                  <p className="text-purple-200 text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                    23 running now
                  </p>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="stats-card bg-gradient-to-br from-orange-500 to-red-500 hover-lift animate-fade-in-up delay-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-2">Today's Revenue</p>
                  <p className="text-4xl font-bold text-white mb-2">৳78,900</p>
                  <p className="text-orange-200 text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                    +8% from yesterday
                  </p>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8zM6 8a2 2 0 012 2v2H6V8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Management Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Manage Drivers */}
            <div className="management-card hover-lift animate-fade-in-up delay-100">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl mr-4 shadow-lg animate-float">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">Manage Drivers</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="status-badge status-active">89 Active</span>
                    <span className="status-badge status-pending">5 Pending</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Approve new drivers, manage accounts, and oversee driver performance and schedules.
              </p>
              <Link href="/admin/manage-drivers">
                <button className="btn-primary w-full hover-lift">
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                    Manage Drivers
                  </span>
                </button>
              </Link>
            </div>

            {/* Route Management */}
            <div className="management-card hover-lift animate-fade-in-up delay-200">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl mr-4 shadow-lg animate-float delay-100">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">Route Management</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="status-badge status-success">12 Active Routes</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Add new routes, modify existing paths, and manage route schedules and pricing.
              </p>
              <Link href="/admin/routes">
                <button className="btn-success w-full hover-lift">
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    Manage Routes
                  </span>
                </button>
              </Link>
            </div>

            {/* Passenger Management */}
            <div className="management-card hover-lift animate-fade-in-up delay-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-2xl mr-4 shadow-lg animate-float delay-200">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">Passenger Management</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="status-badge status-info">1,234 Users</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                View passenger profiles, manage bookings, and handle customer support issues.
              </p>
              <Link href="/admin/manage-passengers">
                <button className="btn-info w-full hover-lift">
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                    Manage Passengers
                  </span>
                </button>
              </Link>
            </div>

            {/* Reports & Analytics */}
            <div className="management-card hover-lift animate-fade-in-up delay-400">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl mr-4 shadow-lg animate-float delay-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h2a2 2 0 002-2V3a2 2 0 012 2v6h-3a4 4 0 01-8 0H4V5z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">Reports & Analytics</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="status-badge status-warning">Live Data</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Generate detailed reports, view system analytics, and track performance metrics.
              </p>
              <Link href="/admin/reports">
                <button className="btn-warning w-full hover-lift">
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h2a2 2 0 002-2V3a2 2 0 012 2v6h-3a4 4 0 01-8 0H4V5z" clipRule="evenodd"/>
                    </svg>
                    View Reports
                  </span>
                </button>
              </Link>
            </div>

            {/* System Settings */}
            <div className="management-card hover-lift animate-fade-in-up delay-500">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-4 rounded-2xl mr-4 shadow-lg animate-float delay-400">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">System Settings</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="status-badge status-neutral">Configured</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Configure system parameters, manage user permissions, and update application settings.
              </p>
              <Link href="/admin/settings">
                <button className="btn-secondary w-full hover-lift">
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                    </svg>
                    Settings
                  </span>
                </button>
              </Link>
            </div>

            {/* Schedule Management */}
            <div className="management-card hover-lift animate-fade-in-up delay-600">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl mr-4 shadow-lg animate-float delay-500">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">Schedule Management</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="status-badge status-primary">45 Schedules</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Create daily schedules, assign drivers to buses, and manage departure times.
              </p>
              <Link href="/admin/schedules">
                <button className="btn-primary w-full hover-lift">
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    Manage Schedules
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Enhanced Recent Activity */}
          <div className="card-gradient rounded-3xl shadow-large p-10 animate-fade-in-up delay-700">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold gradient-text flex items-center gap-3">
                  <span className="text-4xl">📊</span>
                  Recent System Activity
                </h2>
                <p className="text-gray-600 mt-2">Live updates from your bus service system</p>
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
                <button className="btn-outline text-sm px-4 py-2">View All</button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="activity-item">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-800">New driver registration</p>
                      <span className="flex items-center text-sm text-gray-500 gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        2 hours ago
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">John Doe applied for driver position - pending approval</p>
                    <div className="flex gap-2 mt-3">
                      <span className="status-badge status-pending">Pending Review</span>
                      <span className="status-badge status-new">New Application</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-800">Route schedule updated</p>
                      <span className="flex items-center text-sm text-gray-500 gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        4 hours ago
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">Dhanmondi to Gulshan route - departure time changed to 7:30 AM</p>
                    <div className="flex gap-2 mt-3">
                      <span className="status-badge status-info">Schedule Change</span>
                      <span className="status-badge status-success">Auto-notified</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-800">System backup completed</p>
                      <span className="flex items-center text-sm text-gray-500 gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        6 hours ago
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">Daily automated backup successfully created - 2.3GB archived</p>
                    <div className="flex gap-2 mt-3">
                      <span className="status-badge status-success">Completed</span>
                      <span className="status-badge status-auto">Automated</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-800">Peak hour analytics</p>
                      <span className="flex items-center text-sm text-gray-500 gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        8 hours ago
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">Morning rush: 95% capacity reached on 3 major routes</p>
                    <div className="flex gap-2 mt-3">
                      <span className="status-badge status-warning">High Demand</span>
                      <span className="status-badge status-info">Report Generated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </AdminLayout>
  );
}