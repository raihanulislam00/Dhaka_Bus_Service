'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DriverLayout from '../../components/DriverLayout';

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseExpiry: string;
  joinDate: string;
  status: string;
  rating: number;
  totalTrips: number;
  experience: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents: {
    profilePhoto: string;
    license: string;
    nidCard: string;
    medicalCertificate: string;
  };
  vehicle: {
    busNumber: string;
    model: string;
    year: number;
    capacity: number;
    fuelType: string;
  };
}

export default function DriverProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'documents' | 'vehicle' | 'performance'>('personal');
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('user');

    if (!token || userType !== 'driver' || !userData) {
      router.push('/driver/login');
      return;
    }

    try {
      // Mock user data - in real app, fetch from API
      const mockUser: User = {
        id: 1,
        username: 'driver_ahmed',
        fullName: 'Ahmed Hassan',
        email: 'ahmed.hassan@dhakabus.com',
        phone: '+880-1712-345678',
        address: '123 Dhanmondi, Dhaka-1205, Bangladesh',
        dateOfBirth: '1985-03-15',
        licenseNumber: 'DL-DHAKA-12345678',
        licenseExpiry: '2026-03-15',
        joinDate: '2020-01-15',
        status: 'active',
        rating: 4.78,
        totalTrips: 2680,
        experience: '8 years',
        emergencyContact: {
          name: 'Fatima Hassan',
          phone: '+880-1712-987654',
          relationship: 'Wife'
        },
        documents: {
          profilePhoto: '/placeholder-avatar.jpg',
          license: '/documents/license.pdf',
          nidCard: '/documents/nid.pdf',
          medicalCertificate: '/documents/medical.pdf'
        },
        vehicle: {
          busNumber: 'DH-1234',
          model: 'Tata LP 913',
          year: 2019,
          capacity: 45,
          fuelType: 'Diesel'
        }
      };
      
      setUser(mockUser);
      setEditForm(mockUser);
    } catch (error) {
      console.error('Error loading user data:', error);
      router.push('/driver/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSave = () => {
    if (editForm && user) {
      setUser({ ...user, ...editForm });
      setIsEditing(false);
      // In real app, send API request to update user data
    }
  };

  const handleCancel = () => {
    setEditForm(user || {});
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  if (!user) {
    return (
      <DriverLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-red-600">Error loading profile</div>
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
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
                  <svg className="w-20 h-20 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-lg">⭐</span>
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{user.fullName}</h1>
                <p className="text-green-100 text-lg mb-4">Professional Bus Driver</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <div className="text-2xl font-bold">{user.rating}</div>
                    <div className="text-green-100 text-sm">Rating</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <div className="text-2xl font-bold">{user.totalTrips.toLocaleString()}</div>
                    <div className="text-green-100 text-sm">Total Trips</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <div className="text-2xl font-bold">{user.experience}</div>
                    <div className="text-green-100 text-sm">Experience</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border bg-white/90 ${getStatusColor(user.status).replace('bg-', 'text-').replace('text-', 'text-')}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                      Edit Profile
                    </span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-white text-green-600 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'personal', label: 'Personal Info', icon: '👤' },
              { key: 'documents', label: 'Documents', icon: '📄' },
              { key: 'vehicle', label: 'Vehicle Info', icon: '🚐' },
              { key: 'performance', label: 'Performance', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
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
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.fullName || ''}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.fullName}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.username}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.email}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.phone}</div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.address}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formatDate(user.dateOfBirth)}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formatDate(user.joinDate)}</div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.emergencyContact?.name || ''}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          emergencyContact: { ...editForm.emergencyContact!, name: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.emergencyContact.name}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.emergencyContact?.phone || ''}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          emergencyContact: { ...editForm.emergencyContact!, phone: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.emergencyContact.phone}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.emergencyContact?.relationship || ''}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          emergencyContact: { ...editForm.emergencyContact!, relationship: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.emergencyContact.relationship}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Documents & Licenses</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.licenseNumber}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formatDate(user.licenseExpiry)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { key: 'profilePhoto', label: 'Profile Photo', icon: '📷' },
                  { key: 'license', label: 'Driving License', icon: '🪪' },
                  { key: 'nidCard', label: 'NID Card', icon: '🆔' },
                  { key: 'medicalCertificate', label: 'Medical Certificate', icon: '🏥' }
                ].map((doc) => (
                  <div key={doc.key} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center border border-gray-200">
                    <div className="text-4xl mb-3">{doc.icon}</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{doc.label}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Verified
                        </span>
                      </div>
                      <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors">
                        View Document
                      </button>
                      <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                        Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vehicle' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bus Number</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 text-lg font-bold">{user.vehicle.busNumber}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.vehicle.model}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.vehicle.year}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.vehicle.capacity} passengers</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.vehicle.fuelType}</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚐</span>
                  Vehicle Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm text-gray-600">Insurance Valid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm text-gray-600">Fitness Certificate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm text-gray-600">Route Permit</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Metrics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{user.rating}</div>
                      <div className="text-blue-100">Rating</div>
                    </div>
                  </div>
                  <div className="text-blue-100 text-sm">Excellent performance</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🕐</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">94%</div>
                      <div className="text-green-100">On-time</div>
                    </div>
                  </div>
                  <div className="text-green-100 text-sm">Punctuality score</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⛽</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">12.5</div>
                      <div className="text-purple-100">km/L</div>
                    </div>
                  </div>
                  <div className="text-purple-100 text-sm">Fuel efficiency</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-orange-100">Awards</div>
                    </div>
                  </div>
                  <div className="text-orange-100 text-sm">Recognition badges</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Perfect Week', description: '7 days with 100% on-time performance', date: 'Oct 2025' },
                      { title: 'Customer Favorite', description: 'Highest rating for September', date: 'Sep 2025' },
                      { title: 'Fuel Saver', description: 'Best fuel efficiency this quarter', date: 'Aug 2025' },
                      { title: 'Safety Star', description: '1000 trips without incidents', date: 'Jul 2025' }
                    ].map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">🏆</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{achievement.title}</div>
                          <div className="text-sm text-gray-600">{achievement.description}</div>
                          <div className="text-xs text-gray-500">{achievement.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Trends</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Passenger Satisfaction</span>
                        <span>94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Schedule Adherence</span>
                        <span>91%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Safety Score</span>
                        <span>98%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fuel Efficiency</span>
                        <span>87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DriverLayout>
  );
}