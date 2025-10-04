'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DriverLayout from '../../components/DriverLayout';

interface User {
  id: number;
  username: string;
  fullName: string;
  status: string;
}

interface EarningsData {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
  todayTrips: number;
  weekTrips: number;
  monthTrips: number;
  totalTrips: number;
  averagePerTrip: number;
  pendingPayments: number;
}

interface TripEarning {
  id: number;
  date: string;
  route: string;
  startTime: string;
  endTime: string;
  distance: number;
  fare: number;
  bonus: number;
  total: number;
  status: 'completed' | 'pending' | 'paid';
}

export default function DriverEarnings() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [earnings, setEarnings] = useState<EarningsData>({
    daily: 1250,
    weekly: 8750,
    monthly: 35600,
    total: 425000,
    todayTrips: 8,
    weekTrips: 56,
    monthTrips: 224,
    totalTrips: 2680,
    averagePerTrip: 159,
    pendingPayments: 4500
  });

  const [recentEarnings, setRecentEarnings] = useState<TripEarning[]>([
    {
      id: 1,
      date: '2025-10-04',
      route: 'Dhaka - Chittagong',
      startTime: '08:00',
      endTime: '14:30',
      distance: 244,
      fare: 1200,
      bonus: 150,
      total: 1350,
      status: 'completed'
    },
    {
      id: 2,
      date: '2025-10-04',
      route: 'Chittagong - Dhaka',
      startTime: '16:00',
      endTime: '22:30',
      distance: 244,
      fare: 1200,
      bonus: 100,
      total: 1300,
      status: 'pending'
    },
    {
      id: 3,
      date: '2025-10-03',
      route: 'Dhaka - Sylhet',
      startTime: '09:15',
      endTime: '15:45',
      distance: 303,
      fare: 1400,
      bonus: 200,
      total: 1600,
      status: 'paid'
    },
    {
      id: 4,
      date: '2025-10-03',
      route: 'Sylhet - Dhaka',
      startTime: '17:30',
      endTime: '23:45',
      distance: 303,
      fare: 1400,
      bonus: 150,
      total: 1550,
      status: 'paid'
    },
    {
      id: 5,
      date: '2025-10-02',
      route: 'Dhaka - Rajshahi',
      startTime: '07:45',
      endTime: '13:30',
      distance: 256,
      fare: 1300,
      bonus: 175,
      total: 1475,
      status: 'paid'
    }
  ]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPeriodEarnings = () => {
    switch (selectedPeriod) {
      case 'daily':
        return earnings.daily;
      case 'weekly':
        return earnings.weekly;
      case 'monthly':
        return earnings.monthly;
      case 'yearly':
        return earnings.total;
      default:
        return earnings.monthly;
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
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-3xl shadow-large p-8 text-white relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">💰 My Earnings</h1>
                <p className="text-green-100 text-lg">Track your income and trip performance</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold">{formatCurrency(getPeriodEarnings())}</div>
                  <div className="text-green-100 text-sm capitalize">{selectedPeriod} Earnings</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { key: 'daily', label: 'Today', icon: '📅' },
              { key: 'weekly', label: 'This Week', icon: '📊' },
              { key: 'monthly', label: 'This Month', icon: '📈' },
              { key: 'yearly', label: 'Total', icon: '🏆' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  selectedPeriod === period.key
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💵</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(earnings.monthly)}</div>
                <div className="text-blue-100">Monthly</div>
              </div>
            </div>
            <div className="text-blue-100 text-sm">+12% from last month</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚐</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{earnings.monthTrips}</div>
                <div className="text-emerald-100">Trips</div>
              </div>
            </div>
            <div className="text-emerald-100 text-sm">This month</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(earnings.averagePerTrip)}</div>
                <div className="text-purple-100">Avg/Trip</div>
              </div>
            </div>
            <div className="text-purple-100 text-sm">Per trip earnings</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(earnings.pendingPayments)}</div>
                <div className="text-orange-100">Pending</div>
              </div>
            </div>
            <div className="text-orange-100 text-sm">Awaiting payment</div>
          </div>
        </div>

        {/* Recent Earnings Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Recent Earnings</h2>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                  Export
                </span>
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"/>
                  </svg>
                  Filter
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-700">Route</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-700">Time</th>
                  <th className="text-right py-4 px-2 font-semibold text-gray-700">Distance</th>
                  <th className="text-right py-4 px-2 font-semibold text-gray-700">Base Fare</th>
                  <th className="text-right py-4 px-2 font-semibold text-gray-700">Bonus</th>
                  <th className="text-right py-4 px-2 font-semibold text-gray-700">Total</th>
                  <th className="text-center py-4 px-2 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEarnings.map((trip, index) => (
                  <tr key={trip.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-25' : ''}`}>
                    <td className="py-4 px-2">
                      <div className="font-medium text-gray-900">{formatDate(trip.date)}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="font-medium text-gray-900">{trip.route}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-gray-600 text-sm">
                        {trip.startTime} - {trip.endTime}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="text-gray-900">{trip.distance} km</div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="font-medium text-gray-900">{formatCurrency(trip.fare)}</div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="font-medium text-green-600">+{formatCurrency(trip.bonus)}</div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="font-bold text-gray-900 text-lg">{formatCurrency(trip.total)}</div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(trip.status)}`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Performance Insights
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Best performing route</span>
                <span className="font-semibold text-indigo-600">Dhaka - Sylhet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average rating</span>
                <span className="font-semibold text-yellow-600">4.8 ⭐</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">On-time percentage</span>
                <span className="font-semibold text-green-600">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fuel efficiency</span>
                <span className="font-semibold text-blue-600">12 km/L</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Earning Tips
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">Complete more long-distance routes for higher earnings</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">Maintain 95%+ on-time performance for bonus rewards</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">Accept extra shifts during peak hours</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">Keep fuel consumption low for efficiency bonuses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}