'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';

interface SystemSettings {
  general: {
    systemName: string;
    companyName: string;
    supportEmail: string;
    supportPhone: string;
    address: string;
    timezone: string;
    language: string;
    currency: string;
  };
  booking: {
    advanceBookingDays: number;
    cancellationDeadlineHours: number;
    maxSeatsPerBooking: number;
    enableWaitingList: boolean;
    autoConfirmBookings: boolean;
    sendSMSNotifications: boolean;
    sendEmailNotifications: boolean;
  };
  payment: {
    enableOnlinePayment: boolean;
    enableCashPayment: boolean;
    refundProcessingDays: number;
    paymentGateway: string;
    minimumBalance: number;
    transactionFee: number;
  };
  security: {
    sessionTimeout: number;
    passwordMinLength: number;
    requireSpecialCharacters: boolean;
    enableTwoFactorAuth: boolean;
    maxLoginAttempts: number;
    accountLockoutDuration: number;
  };
  notifications: {
    emailSettings: {
      smtpServer: string;
      smtpPort: number;
      username: string;
      enableSSL: boolean;
    };
    smsSettings: {
      provider: string;
      apiKey: string;
      senderId: string;
    };
    pushNotifications: {
      enabled: boolean;
      firebaseKey: string;
    };
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    backupFrequency: string;
    logRetentionDays: number;
    enableDebugMode: boolean;
  };
}

export default function AdminSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'booking' | 'payment' | 'security' | 'notifications' | 'maintenance'>('general');
  const [hasChanges, setHasChanges] = useState(false);
  
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      systemName: 'Dhaka Bus Service',
      companyName: 'Dhaka Transport Corporation',
      supportEmail: 'support@dhakabus.com',
      supportPhone: '+880-1XXX-XXXXXX',
      address: 'Dhaka, Bangladesh',
      timezone: 'Asia/Dhaka',
      language: 'English',
      currency: 'BDT'
    },
    booking: {
      advanceBookingDays: 30,
      cancellationDeadlineHours: 24,
      maxSeatsPerBooking: 6,
      enableWaitingList: true,
      autoConfirmBookings: false,
      sendSMSNotifications: true,
      sendEmailNotifications: true
    },
    payment: {
      enableOnlinePayment: true,
      enableCashPayment: true,
      refundProcessingDays: 7,
      paymentGateway: 'bKash',
      minimumBalance: 100,
      transactionFee: 2.5
    },
    security: {
      sessionTimeout: 60,
      passwordMinLength: 8,
      requireSpecialCharacters: true,
      enableTwoFactorAuth: false,
      maxLoginAttempts: 5,
      accountLockoutDuration: 30
    },
    notifications: {
      emailSettings: {
        smtpServer: 'smtp.gmail.com',
        smtpPort: 587,
        username: 'noreply@dhakabus.com',
        enableSSL: true
      },
      smsSettings: {
        provider: 'Twilio',
        apiKey: '••••••••••••••••',
        senderId: 'DhakaBus'
      },
      pushNotifications: {
        enabled: true,
        firebaseKey: '••••••••••••••••'
      }
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'System is under maintenance. Please check back later.',
      backupFrequency: 'daily',
      logRetentionDays: 90,
      enableDebugMode: false
    }
  });

  const [originalSettings, setOriginalSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'admin') {
      router.push('/admin/login');
      return;
    }

    // Store original settings for comparison
    setOriginalSettings(JSON.parse(JSON.stringify(settings)));
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [router]);

  useEffect(() => {
    // Check for changes
    if (originalSettings) {
      const hasChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      setHasChanges(hasChanged);
    }
  }, [settings, originalSettings]);

  const handleInputChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: keyof SystemSettings, subsection: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
      setHasChanges(false);
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings(JSON.parse(JSON.stringify(originalSettings)));
      setHasChanges(false);
    }
  };

  const testEmailSettings = () => {
    alert('Test email sent successfully!');
  };

  const testSMSSettings = () => {
    alert('Test SMS sent successfully!');
  };

  const runSystemBackup = () => {
    alert('System backup initiated. You will be notified when complete.');
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
        <div className="bg-gradient-to-r from-slate-600 via-gray-700 to-slate-800 rounded-3xl shadow-large p-8 text-white relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">⚙️ System Settings</h1>
                <p className="text-gray-200 text-lg">Configure and manage system preferences</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                {hasChanges && (
                  <>
                    <button
                      onClick={handleReset}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Reset Changes
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {hasChanges && (
              <div className="mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">You have unsaved changes</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'general', label: 'General', icon: '🏢' },
              { key: 'booking', label: 'Booking', icon: '🎫' },
              { key: 'payment', label: 'Payment', icon: '💳' },
              { key: 'security', label: 'Security', icon: '🔒' },
              { key: 'notifications', label: 'Notifications', icon: '📧' },
              { key: 'maintenance', label: 'Maintenance', icon: '🔧' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg'
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
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
                  <input
                    type="text"
                    value={settings.general.systemName}
                    onChange={(e) => handleInputChange('general', 'systemName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={settings.general.companyName}
                    onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                  <input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                  <input
                    type="tel"
                    value={settings.general.supportPhone}
                    onChange={(e) => handleInputChange('general', 'supportPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={settings.general.address}
                    onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Asia/Dhaka">Asia/Dhaka</option>
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Bengali">Bengali</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={settings.general.currency}
                    onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'booking' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advance Booking Days</label>
                  <input
                    type="number"
                    value={settings.booking.advanceBookingDays}
                    onChange={(e) => handleInputChange('booking', 'advanceBookingDays', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">How many days in advance can customers book</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Deadline (Hours)</label>
                  <input
                    type="number"
                    value={settings.booking.cancellationDeadlineHours}
                    onChange={(e) => handleInputChange('booking', 'cancellationDeadlineHours', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Minimum hours before departure for cancellation</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Seats Per Booking</label>
                  <input
                    type="number"
                    value={settings.booking.maxSeatsPerBooking}
                    onChange={(e) => handleInputChange('booking', 'maxSeatsPerBooking', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Booking Options</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Waiting List</h4>
                    <p className="text-sm text-gray-600">Allow customers to join waiting list when bus is full</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.booking.enableWaitingList}
                      onChange={(e) => handleInputChange('booking', 'enableWaitingList', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto Confirm Bookings</h4>
                    <p className="text-sm text-gray-600">Automatically confirm bookings without manual approval</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.booking.autoConfirmBookings}
                      onChange={(e) => handleInputChange('booking', 'autoConfirmBookings', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Send SMS notifications for booking updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.booking.sendSMSNotifications}
                      onChange={(e) => handleInputChange('booking', 'sendSMSNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Send email notifications for booking updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.booking.sendEmailNotifications}
                      onChange={(e) => handleInputChange('booking', 'sendEmailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Online Payment</h4>
                    <p className="text-sm text-gray-600">Allow customers to pay online using digital wallets</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.payment.enableOnlinePayment}
                      onChange={(e) => handleInputChange('payment', 'enableOnlinePayment', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Cash Payment</h4>
                    <p className="text-sm text-gray-600">Allow customers to pay with cash on the bus</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.payment.enableCashPayment}
                      onChange={(e) => handleInputChange('payment', 'enableCashPayment', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Refund Processing Days</label>
                  <input
                    type="number"
                    value={settings.payment.refundProcessingDays}
                    onChange={(e) => handleInputChange('payment', 'refundProcessingDays', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                  <select
                    value={settings.payment.paymentGateway}
                    onChange={(e) => handleInputChange('payment', 'paymentGateway', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="SSL Commerce">SSL Commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Balance (BDT)</label>
                  <input
                    type="number"
                    value={settings.payment.minimumBalance}
                    onChange={(e) => handleInputChange('payment', 'minimumBalance', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.payment.transactionFee}
                    onChange={(e) => handleInputChange('payment', 'transactionFee', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Minimum Length</label>
                  <input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Lockout Duration (Minutes)</label>
                  <input
                    type="number"
                    value={settings.security.accountLockoutDuration}
                    onChange={(e) => handleInputChange('security', 'accountLockoutDuration', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Security Options</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Require Special Characters</h4>
                    <p className="text-sm text-gray-600">Passwords must contain special characters</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.requireSpecialCharacters}
                      onChange={(e) => handleInputChange('security', 'requireSpecialCharacters', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.enableTwoFactorAuth}
                      onChange={(e) => handleInputChange('security', 'enableTwoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Settings</h2>
              
              {/* Email Settings */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Email Settings</h3>
                  <button
                    onClick={testEmailSettings}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Test Email
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
                    <input
                      type="text"
                      value={settings.notifications.emailSettings.smtpServer}
                      onChange={(e) => handleNestedInputChange('notifications', 'emailSettings', 'smtpServer', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                    <input
                      type="number"
                      value={settings.notifications.emailSettings.smtpPort}
                      onChange={(e) => handleNestedInputChange('notifications', 'emailSettings', 'smtpPort', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={settings.notifications.emailSettings.username}
                      onChange={(e) => handleNestedInputChange('notifications', 'emailSettings', 'username', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Enable SSL</h4>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailSettings.enableSSL}
                        onChange={(e) => handleNestedInputChange('notifications', 'emailSettings', 'enableSSL', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* SMS Settings */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">SMS Settings</h3>
                  <button
                    onClick={testSMSSettings}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Test SMS
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                    <select
                      value={settings.notifications.smsSettings.provider}
                      onChange={(e) => handleNestedInputChange('notifications', 'smsSettings', 'provider', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Twilio">Twilio</option>
                      <option value="BulkSMS">BulkSMS</option>
                      <option value="TextLocal">TextLocal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="password"
                      value={settings.notifications.smsSettings.apiKey}
                      onChange={(e) => handleNestedInputChange('notifications', 'smsSettings', 'apiKey', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sender ID</label>
                    <input
                      type="text"
                      value={settings.notifications.smsSettings.senderId}
                      onChange={(e) => handleNestedInputChange('notifications', 'smsSettings', 'senderId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Push Notifications */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Push Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Enable Push Notifications</h4>
                      <p className="text-sm text-gray-600">Send push notifications to mobile apps</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications.enabled}
                        onChange={(e) => handleNestedInputChange('notifications', 'pushNotifications', 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {settings.notifications.pushNotifications.enabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Firebase Key</label>
                      <input
                        type="password"
                        value={settings.notifications.pushNotifications.firebaseKey}
                        onChange={(e) => handleNestedInputChange('notifications', 'pushNotifications', 'firebaseKey', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Maintenance Settings</h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Maintenance Mode</h3>
                      <p className="text-sm text-gray-600">Enable to block user access during maintenance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenance.maintenanceMode}
                        onChange={(e) => handleInputChange('maintenance', 'maintenanceMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  
                  {settings.maintenance.maintenanceMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Message</label>
                      <textarea
                        value={settings.maintenance.maintenanceMessage}
                        onChange={(e) => handleInputChange('maintenance', 'maintenanceMessage', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Message to display to users during maintenance"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                    <select
                      value={settings.maintenance.backupFrequency}
                      onChange={(e) => handleInputChange('maintenance', 'backupFrequency', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Log Retention Days</label>
                    <input
                      type="number"
                      value={settings.maintenance.logRetentionDays}
                      onChange={(e) => handleInputChange('maintenance', 'logRetentionDays', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Debug Mode</h4>
                    <p className="text-sm text-gray-600">Show detailed error messages (not recommended for production)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenance.enableDebugMode}
                      onChange={(e) => handleInputChange('maintenance', 'enableDebugMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">System Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={runSystemBackup}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      Run Backup Now
                    </button>
                    <button
                      onClick={() => alert('System cache cleared!')}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      Clear Cache
                    </button>
                    <button
                      onClick={() => alert('System restarted!')}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      Restart System
                    </button>
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