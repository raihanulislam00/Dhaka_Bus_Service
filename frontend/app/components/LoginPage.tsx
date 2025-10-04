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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-md w-full">
        <div className="card-gradient rounded-3xl shadow-large p-10 border animate-fade-in-up">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg animate-float">
              {userType === 'passenger' && (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              )}
              {userType === 'driver' && (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"/>
                </svg>
              )}
              {userType === 'admin' && (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
              )}
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-3 animate-fade-in-down delay-200">{getTitle()}</h1>
            <p className="text-gray-600 text-lg animate-fade-in delay-300">Welcome back! Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-xl animate-fade-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            </div>
          )}

          <form id="loginForm" onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up delay-500">
            <div className="animate-slide-in-left delay-600">
              <label htmlFor="username" className="block text-sm font-bold text-gray-800 mb-3">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  Username
                </span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="input-enhanced hover-lift"
                placeholder="Enter your username"
              />
            </div>

            <div className="animate-slide-in-left delay-700">
              <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-3">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                  Password
                </span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="input-enhanced hover-lift"
                placeholder="Enter your password"
              />
            </div>

            <div className="animate-fade-in-up delay-1000">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-4 hover-lift"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner w-5 h-5 mr-3"></div>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Sign In
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center animate-fade-in delay-1200">
            <p className="text-gray-600 mb-4">
              Don't have an account?{' '}
              <Link 
                href={getRegisterLink()} 
                className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Register here
              </Link>
            </p>
            
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors group"
            >
              <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}