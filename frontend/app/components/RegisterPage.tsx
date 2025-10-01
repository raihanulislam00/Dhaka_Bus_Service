'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../lib/api';
import { FormValidator } from '../lib/validation';

interface RegisterFormData {
  fullName: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  age?: number;
  licenseNumber?: string;
  address?: string;
  gender?: string;
}

interface RegisterPageProps {
  userType: 'passenger' | 'driver';
}

export default function RegisterPage({ userType }: RegisterPageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    age: undefined,
    licenseNumber: '',
    address: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Add event listeners for real-time validation
    const form = document.getElementById('registerForm');
    if (form) {
      const inputs = form.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
      });
    }

    return () => {
      // Cleanup event listeners
      const form = document.getElementById('registerForm');
      if (form) {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.removeEventListener('blur', validateField);
          input.removeEventListener('input', clearFieldError);
        });
      }
    };
  }, []);

  const validateField = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    
    let validation;
    switch (name) {
      case 'fullName':
        validation = FormValidator.validateFullName(value);
        break;
      case 'username':
        validation = FormValidator.validateUsername(value);
        break;
      case 'password':
        validation = FormValidator.validatePassword(value);
        break;
      case 'email':
        validation = value ? FormValidator.validateEmail(value) : { isValid: true, message: '' };
        break;
      case 'phone':
        validation = FormValidator.validatePhone(value);
        break;
      case 'age':
        validation = userType === 'driver' ? FormValidator.validateAge(value) : { isValid: true, message: '' };
        break;
      default:
        return;
    }

    if (!validation.isValid) {
      showFieldError(target, validation.message);
    } else {
      clearFieldError(e);
    }
  };

  const showFieldError = (input: HTMLInputElement, message: string) => {
    // Clear any existing error
    const fakeEvent = { target: input } as unknown as Event;
    clearFieldError(fakeEvent);
    
    // Add error styling
    input.classList.remove('border-gray-300');
    input.classList.add('border-red-500');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    // Insert error message
    if (input.parentNode) {
      input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
  };

  const clearFieldError = (e: Event) => {
    const target = e.target as HTMLInputElement;
    
    // Remove error styling
    target.classList.remove('border-red-500');
    target.classList.add('border-gray-300');
    
    // Remove error message
    const errorMessage = target.parentNode?.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || undefined : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const validateForm = (): boolean => {
    const validationRules: Record<string, Function[]> = {
      fullName: [FormValidator.validateFullName],
      username: [FormValidator.validateUsername],
      password: [FormValidator.validatePassword],
    };

    // Add conditional validations based on user type and form data
    if (formData.email) {
      validationRules.email = [FormValidator.validateEmail];
    }
    if (formData.phone) {
      validationRules.phone = [FormValidator.validatePhone];
    }
    if (userType === 'driver') {
      validationRules.age = [FormValidator.validateAge];
    }

    const formDataForValidation = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, String(value || '')])
    );

    const { isValid, errors } = FormValidator.validateForm(formDataForValidation, validationRules);
    
    if (!isValid) {
      FormValidator.displayErrors(errors);
      return false;
    }

    FormValidator.clearErrors();
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setSuccess('');
    FormValidator.clearErrors();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Filter out empty fields
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '' && value !== undefined)
      );

      // Transform data based on user type
      let submitData;
      if (userType === 'passenger') {
        // For passenger, map 'email' field to 'mail' and filter out driver-specific fields
        submitData = { ...filteredData };
        if (submitData.email) {
          submitData.mail = submitData.email;
          delete submitData.email;
        }
        // Remove fields not expected by passenger DTO
        delete submitData.age;
        delete submitData.licenseNumber;
      } else {
        submitData = filteredData;
      }

      let response;
      
      switch (userType) {
        case 'passenger':
          response = await authAPI.registerPassenger(submitData);
          break;
        case 'driver':
          response = await authAPI.registerDriver(submitData);
          break;
        default:
          throw new Error('Invalid user type');
      }

      setSuccess('Registration successful! Please login to continue.');
      setTimeout(() => {
        router.push(`/${userType}/login`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.status === 404) {
        errorMessage = 'API endpoint not found. The backend service may be down.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message?.includes('Authentication Required')) {
        errorMessage = 'API access is restricted. Please contact support.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return userType === 'passenger' ? 'Passenger Registration' : 'Driver Registration';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{getTitle()}</h1>
          <p className="text-gray-600">Create your account for Dhaka Bus Service</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form id="registerForm" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                placeholder="01XXXXXXXXX"
              />
            </div>

            {userType === 'driver' && (
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                  required
                  min="18"
                  max="70"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter your age"
                />
              </div>
            )}
          </div>

          {userType === 'driver' && (
            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                placeholder="Enter your driving license number"
              />
            </div>
          )}

          {userType === 'passenger' && (
            <>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link 
              href={`/${userType}/login`} 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}