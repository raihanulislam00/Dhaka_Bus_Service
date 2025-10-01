'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from './Logo';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-3">
              {/* Passenger */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-purple-100 hover:border-purple-200 shadow-sm hover:shadow-md">
                  <span className="text-base">🎫</span>
                  <span>Passenger</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
                  <div className="p-2">
                    <Link
                      href="/passenger/login"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors group/item"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover/item:bg-purple-200 transition-colors">
                        <span className="text-lg">🚪</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Login</p>
                        <p className="text-xs text-gray-500">Access your account</p>
                      </div>
                    </Link>
                    <Link
                      href="/passenger/register"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors group/item"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover/item:bg-purple-200 transition-colors">
                        <span className="text-lg">✨</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Register</p>
                        <p className="text-xs text-gray-500">Create new account</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Driver */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-green-100 hover:border-green-200 shadow-sm hover:shadow-md">
                  <span className="text-base">🚌</span>
                  <span>Driver</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
                  <div className="p-2">
                    <Link
                      href="/driver/login"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors group/item"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-colors">
                        <span className="text-lg">🔑</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Login</p>
                        <p className="text-xs text-gray-500">Access driver portal</p>
                      </div>
                    </Link>
                    <Link
                      href="/driver/register"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors group/item"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-colors">
                        <span className="text-lg">👥</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Join Our Team</p>
                        <p className="text-xs text-gray-500">Become a driver</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Admin */}
              <Link
                href="/admin/login"
                className="group flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-base group-hover:rotate-12 transition-transform inline-block">⚙️</span>
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </Link>
            
            <div className="border-t border-gray-200 pt-4 space-y-4">
              {/* Passenger Section */}
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg">🎫</span>
                  <span className="font-semibold text-gray-800">Passenger</span>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/passenger/login"
                    className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <span className="text-base">🚪</span>
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/passenger/register"
                    className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <span className="text-base">✨</span>
                    <span>Register</span>
                  </Link>
                </div>
              </div>

              {/* Driver Section */}
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg">🚌</span>
                  <span className="font-semibold text-gray-800">Driver</span>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/driver/login"
                    className="flex items-center space-x-3 text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <span className="text-base">🔑</span>
                    <span>Driver Login</span>
                  </Link>
                  <Link
                    href="/driver/register"
                    className="flex items-center space-x-3 text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <span className="text-base">👥</span>
                    <span>Join Our Team</span>
                  </Link>
                </div>
              </div>

              {/* Admin Section */}
              <Link
                href="/admin/login"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg"
              >
                <span className="text-lg">⚙️</span>
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}