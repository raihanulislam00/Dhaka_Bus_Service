'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PassengerLayout from '../../components/PassengerLayout';
import AuthGuard from '../../components/AuthGuard';

interface PassengerProfile {
  id: number;
  username: string;
  fullName: string;
  mail?: string;
  phone?: string;
  address?: string;
  gender?: string;
  createdAt: string;
}

function ProfileContent() {
  const router = useRouter();
  const [user, setUser] = useState<PassengerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PassengerProfile>>({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData(parsedUser);
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // Here you would normally make an API call to update the profile
      // For now, we'll just update localStorage
      if (user) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData(user || {});
    setEditing(false);
  };

  if (loading) {
    return (
      <PassengerLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner w-16 h-16"></div>
        </div>
      </PassengerLayout>
    );
  }

  return (
    <PassengerLayout>
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="card-gradient rounded-3xl shadow-large p-12 mb-12 animate-fade-in-up">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center animate-float">
                  <span className="text-4xl">👤</span>
                </div>
                <div>
                  <h1 className="text-5xl font-bold gradient-text">My Profile</h1>
                  <p className="text-xl text-gray-600 mt-2">Manage your account information</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="card-gradient rounded-3xl shadow-large p-10 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold gradient-text">Account Information</h2>
              <div className="flex gap-3">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-primary px-6 py-3"
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
                      className="btn-success px-6 py-3"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Save Changes
                      </span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-secondary px-6 py-3"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                        Cancel
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                      Full Name
                    </span>
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleInputChange}
                      className="input-enhanced"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="bg-white/60 p-4 rounded-xl border border-white/20">
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.fullName || 'Not provided'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                      </svg>
                      Username
                    </span>
                  </label>
                  <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                    <p className="text-lg font-semibold text-gray-600">
                      {user?.username || 'Not available'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Username cannot be changed</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      Email
                    </span>
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="mail"
                      value={formData.mail || ''}
                      onChange={handleInputChange}
                      className="input-enhanced"
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <div className="bg-white/60 p-4 rounded-xl border border-white/20">
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.mail || 'Not provided'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact & Personal Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                      Phone Number
                    </span>
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="input-enhanced"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="bg-white/60 p-4 rounded-xl border border-white/20">
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.phone || 'Not provided'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      Address
                    </span>
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className="input-enhanced"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <div className="bg-white/60 p-4 rounded-xl border border-white/20">
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.address || 'Not provided'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                      Gender
                    </span>
                  </label>
                  {editing ? (
                    <select
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleInputChange}
                      className="input-enhanced"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div className="bg-white/60 p-4 rounded-xl border border-white/20">
                      <p className="text-lg font-semibold text-gray-800 capitalize">
                        {user?.gender || 'Not specified'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="mt-10 pt-8 border-t border-white/30">
              <h3 className="text-2xl font-bold gradient-text mb-6">Account Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center bg-white/60 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center bg-white/60 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">2</div>
                  <div className="text-sm text-gray-600">Completed Trips</div>
                </div>
                <div className="text-center bg-white/60 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">৳1,650</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="text-center bg-white/60 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {user?.createdAt ? 
                      Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) 
                      : '0'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Days as Member</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PassengerLayout>
  );
}

export default function Profile() {
  return (
    <AuthGuard 
      requiredUserType="passenger"
      fallback={
        <PassengerLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl">Loading...</div>
          </div>
        </PassengerLayout>
      }
    >
      <ProfileContent />
    </AuthGuard>
  );
}