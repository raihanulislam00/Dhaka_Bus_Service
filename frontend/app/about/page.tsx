'use client';

import Layout from '../components/Layout';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
                About <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Dhaka Bus Service</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto animate-fade-in-up delay-300">
                Revolutionizing urban transportation in Dhaka with modern technology and exceptional service
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  To provide safe, reliable, and efficient public transportation services that connect communities 
                  across Dhaka while reducing traffic congestion and environmental impact. We strive to make every 
                  journey comfortable, affordable, and accessible for all.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <p className="text-blue-800 font-medium">
                    "Connecting lives, building communities, and shaping the future of urban mobility."
                  </p>
                </div>
              </div>
              <div className="animate-fade-in-up delay-300">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-2xl text-white shadow-2xl">
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-blue-100 leading-relaxed">
                    To become the leading public transportation provider in Bangladesh, setting new standards 
                    for service excellence, sustainability, and innovation. We envision a future where every 
                    citizen has access to world-class transportation that enhances their quality of life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in-up">
                Our Impact in Numbers
              </h2>
              <p className="text-xl text-gray-600 animate-fade-in-up delay-200">
                Making a difference in the lives of millions of people every day
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up delay-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
                <p className="text-gray-600 font-medium">Buses in Fleet</p>
              </div>
              <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up delay-200">
                <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
                <p className="text-gray-600 font-medium">Daily Passengers</p>
              </div>
              <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up delay-300">
                <div className="text-4xl font-bold text-purple-600 mb-2">25+</div>
                <p className="text-gray-600 font-medium">Routes Covered</p>
              </div>
              <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up delay-500">
                <div className="text-4xl font-bold text-orange-600 mb-2">5+</div>
                <p className="text-gray-600 font-medium">Years of Service</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-up">Our Story</h2>
              <div className="text-lg text-gray-600 space-y-6 leading-relaxed animate-fade-in-up delay-200">
                <p>
                  Founded in 2019, Dhaka Bus Service began as a vision to transform public transportation 
                  in Bangladesh's capital city. Recognizing the challenges faced by millions of commuters daily, 
                  our founders set out to create a service that would prioritize passenger safety, comfort, and reliability.
                </p>
                <p>
                  What started with a small fleet of 10 buses has grown into a comprehensive transportation 
                  network serving over 50,000 passengers daily. Our commitment to innovation led us to become 
                  one of the first bus services in Bangladesh to implement real-time GPS tracking, digital 
                  ticketing, and mobile app integration.
                </p>
                <p>
                  Today, we continue to expand our services while maintaining our core values of safety, 
                  reliability, and customer satisfaction. Our journey is far from over – we're constantly 
                  working towards making urban transportation more accessible, sustainable, and efficient for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in-up">
                Meet Our Leadership
              </h2>
              <p className="text-xl text-gray-600 animate-fade-in-up delay-200">
                Experienced professionals dedicated to serving our community
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up delay-100">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">MD. Rahman Ahmed</h3>
                <p className="text-blue-600 font-medium mb-4">Chief Executive Officer</p>
                <p className="text-gray-600">Leading our vision with 15+ years of experience in transportation management.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up delay-300">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Fatima Khatun</h3>
                <p className="text-green-600 font-medium mb-4">Operations Director</p>
                <p className="text-gray-600">Ensuring smooth daily operations and maintaining our high service standards.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up delay-500">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Karim Hassan</h3>
                <p className="text-purple-600 font-medium mb-4">Technology Head</p>
                <p className="text-gray-600">Driving innovation through cutting-edge technology and digital solutions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6 animate-fade-in-up">Join Our Journey</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-up delay-200">
              Be part of the transportation revolution. Whether you're a passenger looking for reliable service 
              or a driver wanting to make a difference, we welcome you to our family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-500">
              <Link
                href="/passenger/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Become a Passenger
              </Link>
              <Link
                href="/driver/register"
                className="bg-blue-800/50 backdrop-blur-sm hover:bg-blue-900/60 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 border-blue-400/50 hover:border-blue-300"
              >
                Join as Driver
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}