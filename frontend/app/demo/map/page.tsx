'use client';

import { useState } from 'react';
import BasicBusTracker from '../../components/BasicBusTracker';
import PassengerNavbar from '../../components/PassengerNavbar';

export default function MapDemoPage() {
  // Demo bus data for Dhaka city
  const [demoBus] = useState({
    id: 1,
    busNumber: 'DH-101',
    driverName: 'Mohammad Rahman',
    currentLocation: {
      lat: 23.8103, // Dhaka city center
      lng: 90.4125
    },
    status: 'approaching' as const,
    estimatedPickupTime: '5 minutes'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <PassengerNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🗺️ Live Bus Tracking Demo
            </h1>
            <p className="text-gray-600">
              Real-time bus tracking using OpenStreetMap (No API key required!)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BasicBusTracker bus={demoBus} />
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">🚌 Bus Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Bus Number:</span>
                    <span className="font-medium">{demoBus.busNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Driver:</span>
                    <span className="font-medium">{demoBus.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Status:</span>
                    <span className="font-medium capitalize">{demoBus.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">ETA:</span>
                    <span className="font-medium text-green-600">{demoBus.estimatedPickupTime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">✨ Features</h3>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• Real-time bus location</li>
                  <li>• Interactive map controls</li>
                  <li>• Bus stop markers</li>
                  <li>• Status indicators</li>
                  <li>• Live movement simulation</li>
                  <li>• No API key needed!</li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">🌍 Map Info</h3>
                <div className="space-y-1 text-sm text-yellow-800">
                  <p>• Using OpenStreetMap</p>
                  <p>• Free and open source</p>
                  <p>• No API key required</p>
                  <p>• Updates every 5 seconds</p>
                  <p>• Covers all of Bangladesh</p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">📍 Route</h3>
                <div className="text-sm text-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Gulshan Circle</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 ml-1.5 mb-2"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Dhanmondi 27</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">Real-time</div>
              <div className="text-sm opacity-90">Live Updates</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">Free</div>
              <div className="text-sm opacity-90">No API Key</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">Interactive</div>
              <div className="text-sm opacity-90">Full Control</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Click on the bus or bus stop markers for more information!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}