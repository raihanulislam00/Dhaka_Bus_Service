'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';

interface ReportsData {
  overview: {
    totalRevenue: number;
    totalTrips: number;
    totalPassengers: number;
    totalDrivers: number;
    averageOccupancy: number;
    onTimePerformance: number;
  };
  revenueByRoute: Array<{
    routeName: string;
    revenue: number;
    trips: number;
    passengers: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    trips: number;
  }>;
  driverPerformance: Array<{
    name: string;
    trips: number;
    rating: number;
    onTimePercentage: number;
    revenue: number;
  }>;
  passengerAnalytics: {
    newRegistrations: number;
    activeUsers: number;
    bookingTrends: Array<{
      date: string;
      bookings: number;
    }>;
  };
}

export default function AdminReports() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'performance' | 'analytics'>('overview');
  
  const [reportsData, setReportsData] = useState<ReportsData>({
    overview: {
      totalRevenue: 2450000,
      totalTrips: 15420,
      totalPassengers: 234500,
      totalDrivers: 145,
      averageOccupancy: 78.5,
      onTimePerformance: 92.3
    },
    revenueByRoute: [
      { routeName: 'Dhaka - Chittagong', revenue: 890000, trips: 2450, passengers: 45000 },
      { routeName: 'Dhaka - Sylhet', revenue: 650000, trips: 1850, passengers: 32000 },
      { routeName: 'Dhaka - Rajshahi', revenue: 420000, trips: 1680, passengers: 28500 },
      { routeName: 'Dhaka - Khulna', revenue: 380000, trips: 1520, passengers: 25000 },
      { routeName: 'Dhaka - Barisal', revenue: 320000, trips: 1280, passengers: 21000 }
    ],
    monthlyRevenue: [
      { month: 'Jan 2025', revenue: 1850000, trips: 12500 },
      { month: 'Feb 2025', revenue: 1920000, trips: 13200 },
      { month: 'Mar 2025', revenue: 2100000, trips: 14100 },
      { month: 'Apr 2025', revenue: 2250000, trips: 14800 },
      { month: 'May 2025', revenue: 2180000, trips: 14500 },
      { month: 'Jun 2025', revenue: 2350000, trips: 15200 },
      { month: 'Jul 2025', revenue: 2420000, trips: 15600 },
      { month: 'Aug 2025', revenue: 2380000, trips: 15300 },
      { month: 'Sep 2025', revenue: 2450000, trips: 15420 }
    ],
    driverPerformance: [
      { name: 'Ahmed Hassan', trips: 285, rating: 4.9, onTimePercentage: 96, revenue: 45200 },
      { name: 'Mohammad Ali', trips: 278, rating: 4.8, onTimePercentage: 94, revenue: 43800 },
      { name: 'Rahman Sheikh', trips: 265, rating: 4.7, onTimePercentage: 92, revenue: 42100 },
      { name: 'Karim Uddin', trips: 258, rating: 4.8, onTimePercentage: 91, revenue: 41500 },
      { name: 'Nasir Ahmed', trips: 245, rating: 4.6, onTimePercentage: 89, revenue: 39800 }
    ],
    passengerAnalytics: {
      newRegistrations: 1250,
      activeUsers: 18500,
      bookingTrends: [
        { date: '2025-09-01', bookings: 450 },
        { date: '2025-09-08', bookings: 520 },
        { date: '2025-09-15', bookings: 485 },
        { date: '2025-09-22', bookings: 610 },
        { date: '2025-09-29', bookings: 580 }
      ]
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'admin') {
      router.push('/admin/login');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const exportReport = (type: string) => {
    // Mock export functionality
    alert(`Exporting ${type} report...`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-large p-8 text-white relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">📊 System Reports</h1>
                <p className="text-blue-100 text-lg">Comprehensive analytics and performance insights</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <button
                  onClick={() => exportReport('comprehensive')}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Export Report
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { key: 'daily', label: 'Daily', icon: '📅' },
              { key: 'weekly', label: 'Weekly', icon: '📊' },
              { key: 'monthly', label: 'Monthly', icon: '📈' },
              { key: 'yearly', label: 'Yearly', icon: '🏆' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  selectedPeriod === period.key
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{period.icon}</span>
                  {period.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'overview', label: 'Overview', icon: '📋' },
              { key: 'revenue', label: 'Revenue', icon: '💰' },
              { key: 'performance', label: 'Performance', icon: '⭐' },
              { key: 'analytics', label: 'Analytics', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
              
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatCurrency(reportsData.overview.totalRevenue)}</div>
                      <div className="text-green-100">Total Revenue</div>
                    </div>
                  </div>
                  <div className="text-green-100 text-sm">+15% from last period</div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🚐</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatNumber(reportsData.overview.totalTrips)}</div>
                      <div className="text-blue-100">Total Trips</div>
                    </div>
                  </div>
                  <div className="text-blue-100 text-sm">+8% from last period</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatNumber(reportsData.overview.totalPassengers)}</div>
                      <div className="text-purple-100">Total Passengers</div>
                    </div>
                  </div>
                  <div className="text-purple-100 text-sm">+12% from last period</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🚛</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{reportsData.overview.totalDrivers}</div>
                      <div className="text-orange-100">Active Drivers</div>
                    </div>
                  </div>
                  <div className="text-orange-100 text-sm">+3 new drivers</div>
                </div>

                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{reportsData.overview.averageOccupancy}%</div>
                      <div className="text-teal-100">Avg Occupancy</div>
                    </div>
                  </div>
                  <div className="text-teal-100 text-sm">+2.5% improvement</div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⏰</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{reportsData.overview.onTimePerformance}%</div>
                      <div className="text-indigo-100">On-Time Performance</div>
                    </div>
                  </div>
                  <div className="text-indigo-100 text-sm">+1.2% improvement</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Revenue Analysis</h2>
                <button
                  onClick={() => exportReport('revenue')}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Export Revenue Report
                </button>
              </div>

              {/* Revenue by Route */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Revenue by Route</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Route</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">Revenue</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">Trips</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">Passengers</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">Avg/Trip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsData.revenueByRoute.map((route, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-2 font-medium text-gray-900">{route.routeName}</td>
                          <td className="py-4 px-2 text-right font-bold text-green-600">{formatCurrency(route.revenue)}</td>
                          <td className="py-4 px-2 text-right text-gray-900">{formatNumber(route.trips)}</td>
                          <td className="py-4 px-2 text-right text-gray-900">{formatNumber(route.passengers)}</td>
                          <td className="py-4 px-2 text-right text-blue-600 font-medium">
                            {formatCurrency(Math.round(route.revenue / route.trips))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Revenue Trend */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Monthly Revenue Trend</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {reportsData.monthlyRevenue.slice(-5).map((month, index) => (
                    <div key={index} className="text-center bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-2">{month.month}</div>
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(month.revenue)}</div>
                      <div className="text-xs text-gray-500">{formatNumber(month.trips)} trips</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Performance Metrics</h2>
                <button
                  onClick={() => exportReport('performance')}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Export Performance Report
                </button>
              </div>

              {/* Top Performing Drivers */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Top Performing Drivers</h3>
                <div className="space-y-4">
                  {reportsData.driverPerformance.map((driver, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-600">{driver.trips} trips completed</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-yellow-600">{driver.rating} ⭐</div>
                          <div className="text-gray-500">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-green-600">{driver.onTimePercentage}%</div>
                          <div className="text-gray-500">On-time</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-600">{formatCurrency(driver.revenue)}</div>
                          <div className="text-gray-500">Revenue</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">System Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>On-time Performance</span>
                        <span>{reportsData.overview.onTimePerformance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${reportsData.overview.onTimePerformance}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Occupancy</span>
                        <span>{reportsData.overview.averageOccupancy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${reportsData.overview.averageOccupancy}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Customer Satisfaction</span>
                        <span>94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Quality</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Average Rating</span>
                      <span className="font-bold text-yellow-600">4.7 ⭐</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Complaint Resolution</span>
                      <span className="font-bold text-green-600">98%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Safety Score</span>
                      <span className="font-bold text-blue-600">96%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Fleet Availability</span>
                      <span className="font-bold text-indigo-600">89%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Passenger Analytics</h2>
                <button
                  onClick={() => exportReport('analytics')}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Export Analytics Report
                </button>
              </div>

              {/* Passenger Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{formatNumber(reportsData.passengerAnalytics.newRegistrations)}</div>
                  <div className="text-cyan-100">New Registrations</div>
                  <div className="text-cyan-200 text-sm mt-2">This month</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{formatNumber(reportsData.passengerAnalytics.activeUsers)}</div>
                  <div className="text-green-100">Active Users</div>
                  <div className="text-green-200 text-sm mt-2">Monthly active</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">87%</div>
                  <div className="text-purple-100">Mobile Usage</div>
                  <div className="text-purple-200 text-sm mt-2">App vs Web</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">73%</div>
                  <div className="text-orange-100">Repeat Customers</div>
                  <div className="text-orange-200 text-sm mt-2">Return rate</div>
                </div>
              </div>

              {/* Booking Trends */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Weekly Booking Trends</h3>
                <div className="grid grid-cols-5 gap-4">
                  {reportsData.passengerAnalytics.bookingTrends.map((trend, index) => (
                    <div key={index} className="text-center bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-2">Week {index + 1}</div>
                      <div className="text-lg font-bold text-indigo-600">{trend.bookings}</div>
                      <div className="text-xs text-gray-500">bookings</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Demographics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Peak Booking Hours</h3>
                  <div className="space-y-3">
                    {[
                      { time: '06:00 - 09:00', percentage: 35, label: 'Morning Rush' },
                      { time: '12:00 - 14:00', percentage: 25, label: 'Lunch Hours' },
                      { time: '17:00 - 20:00', percentage: 40, label: 'Evening Rush' }
                    ].map((hour, index) => (
                      <div key={index} className="bg-white rounded-lg p-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{hour.time}</span>
                          <span>{hour.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: `${hour.percentage}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-600">{hour.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Routes</h3>
                  <div className="space-y-3">
                    {reportsData.revenueByRoute.slice(0, 3).map((route, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{route.routeName}</div>
                          <div className="text-sm text-gray-600">{formatNumber(route.passengers)} passengers</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-teal-600">{formatNumber(route.trips)}</div>
                          <div className="text-xs text-gray-500">trips</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}