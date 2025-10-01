'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../lib/api';
import { FormValidator } from '../lib/validation';

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginPageProps {
  userType: 'passenger' | 'driver' | 'admin';
}

export default function LoginPage({ userType }: LoginPageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Add event listeners for real-time validation
    const form = document.getElementById('loginForm');
    if (form) {
      const inputs = form.querySelectorAll('input');
      inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
      });
    }

    return () => {
      // Cleanup event listeners
      const form = document.getElementById('loginForm');
      if (form) {
        const inputs = form.querySelectorAll('input');
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
      case 'username':
        validation = FormValidator.validateUsername(value);
        break;
      case 'password':
        validation = FormValidator.validateRequired(value, 'Password');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): boolean => {
    const validationRules = {
      username: [FormValidator.validateUsername],
      password: [(value: string) => FormValidator.validateRequired(value, 'Password')]
    };

    const { isValid, errors } = FormValidator.validateForm(formData as unknown as Record<string, string>, validationRules);
    
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
    FormValidator.clearErrors();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let response;
      
      // Use appropriate API based on user type
      switch (userType) {
        case 'passenger':
          response = await authAPI.loginPassenger(formData);
          break;
        case 'driver':
          response = await authAPI.loginDriver(formData);
          break;
        case 'admin':
          response = await authAPI.loginAdmin(formData);
          break;
        default:
          throw new Error('Invalid user type');
      }

      const data = response.data;

      // Store the token in localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('user', JSON.stringify(data[userType]));

      // Redirect to dashboard
      router.push(`/${userType}/dashboard`);
      
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (userType) {
      case 'passenger': return 'Passenger Login';
      case 'driver': return 'Driver Login';
      case 'admin': return 'Admin Login';
    }
  };

  const getRegisterLink = () => {
    return `/${userType}/register`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{getTitle()}</h1>
          <p className="text-gray-600">Sign in to Dhaka Bus Service</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form id="loginForm" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link 
              href={getRegisterLink()} 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Register here
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