'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';

interface Route {
  id: number;
  name: string;
  startLocation: string;
  endLocation: string;
  stops: string[] | string | null;
  distance: number;
  estimatedDuration: number;
  fare: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
}

export default function RouteManagement() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  // Helper function to safely handle stops data
  const getStopsArray = (stops: string[] | string | null): string[] => {
    if (Array.isArray(stops)) {
      return stops;
    }
    if (typeof stops === 'string') {
      // If it's a string, try to parse it or split it
      try {
        const parsed = JSON.parse(stops);
        return Array.isArray(parsed) ? parsed : [stops];
      } catch {
        // If JSON parsing fails, treat as comma-separated string
        return stops.split(',').map(stop => stop.trim()).filter(stop => stop);
      }
    }
    return [];
  };

  const getStopsDisplay = (stops: string[] | string | null): string => {
    const stopsArray = getStopsArray(stops);
    return stopsArray.length > 0 ? stopsArray.join(' → ') : 'No stops defined';
  };
  const [formData, setFormData] = useState({
    name: '',
    startLocation: '',
    endLocation: '',
    stops: [''],
    distance: '',
    estimatedDuration: '',
    fare: '',
    description: '',
  });

  useEffect(() => {
    // Check admin authentication - for now, let's load routes regardless for testing
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    // For testing purposes, always load routes
    loadRoutes();

    // TODO: Re-enable authentication check later
    // if (!token || userType !== 'admin') {
    //   router.push('/admin/login');
    //   return;
    // }
  }, [router]);

  const loadRoutes = async () => {
    try {
      console.log('Loading routes...');
      // For testing, make direct API call without authentication
      const response = await fetch('http://localhost:3000/admin/routes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Routes loaded successfully:', data);
      setRoutes(data);
    } catch (error: any) {
      console.error('Error loading routes:', error);
      console.error('Error details:', {
        message: error.message
      });
      
      // Show user-friendly error message
      alert(`Failed to load routes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const routeData = {
        ...formData,
        distance: parseFloat(formData.distance),
        estimatedDuration: parseInt(formData.estimatedDuration),
        fare: parseFloat(formData.fare),
        stops: formData.stops.filter(stop => stop.trim() !== ''),
      };

      if (editingRoute) {
        await api.put(`/admin/routes/${editingRoute.id}`, routeData);
      } else {
        await api.post('/admin/routes', routeData);
      }

      resetForm();
      loadRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    const stopsArray = getStopsArray(route.stops);
    setFormData({
      name: route.name,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      stops: stopsArray.length > 0 ? stopsArray : [''],
      distance: route.distance.toString(),
      estimatedDuration: route.estimatedDuration.toString(),
      fare: route.fare.toString(),
      description: route.description || '',
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (routeId: number) => {
    if (!confirm('Are you sure you want to delete this route?')) return;

    try {
      await api.delete(`/admin/routes/${routeId}`);
      loadRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const toggleActive = async (routeId: number) => {
    try {
      await api.patch(`/admin/routes/${routeId}/toggle`);
      loadRoutes();
    } catch (error) {
      console.error('Error toggling route status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startLocation: '',
      endLocation: '',
      stops: [''],
      distance: '',
      estimatedDuration: '',
      fare: '',
      description: '',
    });
    setEditingRoute(null);
    setShowCreateForm(false);
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, '']
    }));
  };

  const removeStop = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const updateStop = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => i === index ? value : stop)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Route Management</h1>
            <p className="text-gray-600 mt-2">Create and manage bus routes (Fixed)</p>
          </div>        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {showCreateForm ? 'Cancel' : '+ Create New Route'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingRoute ? 'Edit Route' : 'Create New Route'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Gulshan to Dhanmondi Express"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fare (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.fare}
                    onChange={(e) => setFormData(prev => ({ ...prev, fare: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="50.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.startLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, startLocation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Gulshan Circle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.endLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, endLocation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Dhanmondi 27"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.distance}
                    onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="15.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Duration (minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="45"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stops
                </label>
                {formData.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={stop}
                      onChange={(e) => updateStop(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={`Stop ${index + 1}`}
                    />
                    {formData.stops.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStop(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStop}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  + Add Another Stop
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional information about this route..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {editingRoute ? 'Update Route' : 'Create Route'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Routes ({routes.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start → End
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fare
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {routes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{route.name}</div>
                        <div className="text-sm text-gray-500">
                          {getStopsDisplay(route.stops)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.startLocation} → {route.endLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.distance} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.estimatedDuration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ৳{route.fare}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        route.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {route.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(route)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(route.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {route.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(route.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {routes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No routes found</div>
              <p className="text-gray-400 mt-2">Create your first route to get started</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}