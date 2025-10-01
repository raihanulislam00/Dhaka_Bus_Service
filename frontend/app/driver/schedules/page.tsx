'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DriverNavbar from '../../components/DriverNavbar';
import api from '../../lib/api';

interface Route {
  id: number;
  name: string;
  startLocation: string;
  endLocation: string;
  fare: number;
  distance: number;
}

interface Schedule {
  id: number;
  routeId: number;
  route: Route;
  busNumber: string;
  departureTime: string;
  arrivalTime: string;
  dayOfWeek: string;
  totalSeats: number;
  availableSeats: number;
  isActive: boolean;
  notes?: string;
  assignedDriverId?: number;
}

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DriverSchedules() {
  const router = useRouter();
  const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
  const [mySchedules, setMySchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'my-schedules'>('available');

  useEffect(() => {
    // Check driver authentication
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('user');

    if (!token || userType !== 'driver') {
      router.push('/driver/login');
      return;
    }

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }

    loadSchedules();
  }, [router]);

  const loadSchedules = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const [availableResponse, mySchedulesResponse] = await Promise.all([
        api.get('/driver/schedules/available'),
        api.get(`/driver/${userData.id}/schedules`)
      ]);
      
      setAvailableSchedules(availableResponse.data);
      setMySchedules(mySchedulesResponse.data);
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectSchedule = async (scheduleId: number) => {
    try {
      await api.post(`/driver/${user.id}/schedules/${scheduleId}/select`);
      loadSchedules();
      alert('Schedule selected successfully!');
    } catch (error) {
      console.error('Error selecting schedule:', error);
      alert('Failed to select schedule. It may already be assigned to another driver.');
    }
  };

  const unselectSchedule = async (scheduleId: number) => {
    if (!confirm('Are you sure you want to unselect this schedule?')) return;

    try {
      await api.post(`/driver/${user.id}/schedules/${scheduleId}/unselect`);
      loadSchedules();
      alert('Schedule unselected successfully!');
    } catch (error) {
      console.error('Error unselecting schedule:', error);
      alert('Failed to unselect schedule.');
    }
  };

  const groupSchedulesByDay = (schedules: Schedule[]) => {
    const grouped = schedules.reduce((acc, schedule) => {
      if (!acc[schedule.dayOfWeek]) {
        acc[schedule.dayOfWeek] = [];
      }
      acc[schedule.dayOfWeek].push(schedule);
      return acc;
    }, {} as { [key: string]: Schedule[] });

    // Sort schedules within each day by departure time
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    });

    return grouped;
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DriverNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  const availableGrouped = groupSchedulesByDay(availableSchedules);
  const mySchedulesGrouped = groupSchedulesByDay(mySchedules);

  return (
    <div className="min-h-screen bg-gray-50">
      <DriverNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-2">Select and manage your driving schedules</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'available'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Available Schedules ({availableSchedules.length})
          </button>
          <button
            onClick={() => setActiveTab('my-schedules')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-schedules'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Schedules ({mySchedules.length})
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Available Schedules</h2>
              
              {Object.keys(availableGrouped).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">No available schedules</div>
                  <p className="text-gray-400 mt-2">All schedules are currently assigned to drivers</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {DAYS_ORDER.filter(day => availableGrouped[day]).map(day => (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{day}</h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {availableGrouped[day].map(schedule => (
                          <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">Bus {schedule.busNumber}</h4>
                                <p className="text-sm text-gray-600">{schedule.route.name}</p>
                              </div>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Available
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-700 mb-2">
                              <p>{schedule.route.startLocation} → {schedule.route.endLocation}</p>
                              <p>{formatTime(schedule.departureTime)} - {formatTime(schedule.arrivalTime)}</p>
                              <p>{schedule.totalSeats} seats • ৳{schedule.route.fare} fare</p>
                              {schedule.route.distance && <p>{schedule.route.distance} km</p>}
                            </div>

                            {schedule.notes && (
                              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-3">
                                {schedule.notes}
                              </p>
                            )}

                            <button
                              onClick={() => selectSchedule(schedule.id)}
                              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Select Schedule
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'my-schedules' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">My Schedules</h2>
              
              {Object.keys(mySchedulesGrouped).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">No schedules selected</div>
                  <p className="text-gray-400 mt-2">Select schedules from the Available Schedules tab</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {DAYS_ORDER.filter(day => mySchedulesGrouped[day]).map(day => (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{day}</h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mySchedulesGrouped[day].map(schedule => (
                          <div key={schedule.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">Bus {schedule.busNumber}</h4>
                                <p className="text-sm text-gray-600">{schedule.route.name}</p>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Assigned
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-700 mb-2">
                              <p>{schedule.route.startLocation} → {schedule.route.endLocation}</p>
                              <p>{formatTime(schedule.departureTime)} - {formatTime(schedule.arrivalTime)}</p>
                              <p>{schedule.totalSeats} seats • ৳{schedule.route.fare} fare</p>
                              {schedule.route.distance && <p>{schedule.route.distance} km</p>}
                            </div>

                            {schedule.notes && (
                              <p className="text-sm text-gray-600 bg-white p-2 rounded mb-3">
                                {schedule.notes}
                              </p>
                            )}

                            <button
                              onClick={() => unselectSchedule(schedule.id)}
                              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Unselect Schedule
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Weekly Schedule Summary</h2>
          <div className="grid grid-cols-7 gap-2">
            {DAYS_ORDER.map(day => (
              <div key={day} className="text-center">
                <h3 className="text-sm font-medium text-gray-900 mb-2">{day.substring(0, 3)}</h3>
                <div className="space-y-1">
                  {mySchedulesGrouped[day] ? (
                    mySchedulesGrouped[day].map(schedule => (
                      <div key={schedule.id} className="text-xs bg-green-100 text-green-800 p-1 rounded">
                        {schedule.busNumber}
                        <br />
                        {formatTime(schedule.departureTime)}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 p-1">Free</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}