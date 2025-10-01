'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../../components/AdminNavbar';
import { generalAPI } from '../../lib/api';
import BasicBusTracker from '../../components/BasicBusTracker';

interface Driver {
  id: number;
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  age: number;
  status: 'active' | 'inactive';
  currentLatitude?: number | string;
  currentLongitude?: number | string;
  lastLocationUpdate?: string;
  createdAt: string;
}

export default function ManageDrivers() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Driver>>({});
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'admin') {
      router.push('/admin/login');
      return;
    }

    loadDrivers();
  }, [router]);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const response = await generalAPI.getAllDriversWithLocation();
      setDrivers(response.data);
    } catch (error) {
      console.error('Error loading drivers:', error);
      alert('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (driverId: number, newStatus: 'active' | 'inactive') => {
    try {
      await generalAPI.updateDriverStatus(driverId, newStatus);
      await loadDrivers();
      alert(`Driver status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating driver status:', error);
      alert('Failed to update driver status');
    }
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setEditFormData({
      fullName: driver.fullName,
      email: driver.email,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      age: driver.age,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedDriver) return;

    try {
      await generalAPI.updateDriverDetails(selectedDriver.id, editFormData);
      await loadDrivers();
      setIsEditModalOpen(false);
      alert('Driver details updated successfully');
    } catch (error) {
      console.error('Error updating driver details:', error);
      alert('Failed to update driver details');
    }
  };

  const showDriverLocation = async (driver: Driver) => {
    setSelectedDriver(driver);
    setIsLocationModalOpen(true);
  };

  const filteredDrivers = drivers.filter(driver => {
    if (filter === 'all') return true;
    return driver.status === filter;
  });

  const getLocationStatus = (driver: Driver) => {
    if (!driver.currentLatitude || !driver.currentLongitude) {
      return { status: 'No Location', color: 'text-gray-500', bg: 'bg-gray-100' };
    }
    
    const lastUpdate = new Date(driver.lastLocationUpdate || '');
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
    
    if (diffMinutes < 5) {
      return { status: 'Live', color: 'text-green-600', bg: 'bg-green-100' };
    } else if (diffMinutes < 30) {
      return { status: 'Recent', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    } else {
      return { status: 'Outdated', color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👨‍✈️ Manage Drivers</h1>
          <p className="text-gray-600">Manage driver accounts, status, and track their locations in real-time</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-1 inline-flex">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {status === 'all' ? 'All Drivers' : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs">
                ({status === 'all' ? drivers.length : drivers.filter(d => d.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => {
            const locationStatus = getLocationStatus(driver);
            return (
              <div key={driver.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {driver.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{driver.fullName}</h3>
                      <p className="text-sm text-gray-500">@{driver.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      driver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{driver.email || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium">{driver.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">License:</span>
                    <span className="font-medium">{driver.licenseNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium">{driver.age}</span>
                  </div>
                </div>

                {/* Location Status */}
                <div className={`p-3 rounded-lg mb-4 ${locationStatus.bg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📍</span>
                      <span className={`text-sm font-medium ${locationStatus.color}`}>
                        {locationStatus.status}
                      </span>
                    </div>
                    {driver.currentLatitude && driver.currentLongitude && (
                      <button
                        onClick={() => showDriverLocation(driver)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        View on Map
                      </button>
                    )}
                  </div>
                  {driver.lastLocationUpdate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {new Date(driver.lastLocationUpdate).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditDriver(driver)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Edit Details
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange(driver.id, driver.status === 'active' ? 'inactive' : 'active')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      driver.status === 'active'
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {driver.status === 'active' ? '🚫 Deactivate' : '✅ Activate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDrivers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👨‍✈️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'No drivers have registered yet.' : `No ${filter} drivers found.`}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Driver Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFormData.fullName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <input
                  type="text"
                  value={editFormData.licenseNumber || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, licenseNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={editFormData.age || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, age: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                📍 {selectedDriver.fullName}'s Location
              </h2>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            {selectedDriver.currentLatitude && selectedDriver.currentLongitude ? (
              <BasicBusTracker
                bus={{
                  id: selectedDriver.id,
                  busNumber: `Driver-${selectedDriver.id}`,
                  driverName: selectedDriver.fullName,
                  currentLocation: {
                    lat: parseFloat(selectedDriver.currentLatitude.toString()),
                    lng: parseFloat(selectedDriver.currentLongitude.toString()),
                  },
                  status: selectedDriver.status === 'active' ? 'approaching' : 'departed',
                  estimatedPickupTime: selectedDriver.status === 'active' ? 'Active' : 'Inactive',
                }}
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Location Data</h3>
                <p className="text-gray-500">This driver hasn't shared their location yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}