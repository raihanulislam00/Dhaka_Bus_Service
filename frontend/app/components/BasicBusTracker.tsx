'use client';

import { useEffect, useState } from 'react';

interface Bus {
  id: number;
  busNumber: string;
  driverName: string;
  currentLocation: {
    lat: number | string;
    lng: number | string;
  };
  status: 'approaching' | 'boarding' | 'departed' | 'arrived';
  estimatedPickupTime: string;
}

interface BasicBusTrackerProps {
  bus: Bus;
}

export default function BasicBusTracker({ bus }: BasicBusTrackerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert coordinates to numbers and validate
  const latitude = Number(bus.currentLocation.lat);
  const longitude = Number(bus.currentLocation.lng);
  const hasValidCoordinates = !isNaN(latitude) && !isNaN(longitude);

  const busStops = [
    { name: 'Gulshan Circle', distance: '0.5 km', time: '2 min' },
    { name: 'Shahbagh', distance: '1.2 km', time: '5 min' },
    { name: 'Dhanmondi 27', distance: '2.1 km', time: '8 min' },
    { name: 'Uttara Sector 7', distance: '3.5 km', time: '12 min' }
  ];

  if (!hasValidCoordinates) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Bus Tracking 🚌</h4>
          <span className="text-sm text-gray-500">Updated: {currentTime.toLocaleTimeString()}</span>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-yellow-600 text-4xl mb-4">📍</div>
          <h3 className="text-lg font-medium text-yellow-900 mb-2">Invalid Location Data</h3>
          <p className="text-yellow-700">
            The location coordinates for {bus.driverName} are invalid or missing.
          </p>
          <p className="text-sm text-yellow-600 mt-2">
            Coordinates: lat: {bus.currentLocation.lat}, lng: {bus.currentLocation.lng}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Live Bus Tracking 🚌</h4>
        <span className="text-sm text-gray-500">Updated: {currentTime.toLocaleTimeString()}</span>
      </div>
      
      {/* Interactive Bus Map Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-blue-200 p-6" style={{ minHeight: '300px' }}>
        <div className="relative h-64 bg-white rounded-lg shadow-inner p-4 overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 400 300">
              {/* Roads */}
              <path d="M50 150 L350 150" stroke="#3B82F6" strokeWidth="4" strokeDasharray="10,5" />
              <path d="M200 50 L200 250" stroke="#3B82F6" strokeWidth="3" strokeDasharray="8,4" />
              <path d="M100 100 L300 200" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6,3" />
              
              {/* Areas */}
              <rect x="80" y="80" width="60" height="40" fill="#10B981" opacity="0.2" rx="4" />
              <rect x="260" y="180" width="60" height="40" fill="#F59E0B" opacity="0.2" rx="4" />
              <circle cx="150" cy="120" r="25" fill="#8B5CF6" opacity="0.2" />
            </svg>
          </div>

          {/* Bus Route Line */}
          <div className="absolute top-16 left-8 right-8">
            <div className="relative">
              <div className="h-1 bg-blue-300 rounded-full"></div>
              <div className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-1000" 
                   style={{ width: bus.status === 'approaching' ? '30%' : bus.status === 'boarding' ? '60%' : '90%' }}>
              </div>
            </div>
          </div>

          {/* Bus Stops */}
          {busStops.map((stop, index) => (
            <div key={stop.name} 
                 className="absolute transform -translate-x-1/2 -translate-y-1/2"
                 style={{ 
                   left: `${20 + (index * 20)}%`, 
                   top: `${60 + (Math.sin(index) * 15)}%` 
                 }}>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                <div className="mt-2 text-xs text-center bg-white px-2 py-1 rounded shadow-sm border">
                  <div className="font-medium text-gray-800">{stop.name}</div>
                  <div className="text-gray-500">{stop.time}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Moving Bus Icon */}
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-2000"
               style={{ 
                 left: bus.status === 'approaching' ? '25%' : bus.status === 'boarding' ? '50%' : '75%',
                 top: '60%'
               }}>
            <div className={`w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg ${
              bus.status === 'approaching' ? 'animate-bounce' : ''
            }`}>
              🚌
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              {bus.busNumber}
            </div>
          </div>

          {/* Live Indicator */}
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-xs font-medium text-red-600">LIVE</span>
          </div>

          {/* Dhaka City Label */}
          <div className="absolute bottom-4 left-4 text-xs text-gray-500 font-medium">
            📍 Dhaka City, Bangladesh
          </div>
        </div>
      </div>
      
      {/* Bus Status Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              bus.status === 'approaching' ? 'bg-yellow-500 animate-pulse' :
              bus.status === 'boarding' ? 'bg-green-500 animate-pulse' :
              bus.status === 'departed' ? 'bg-red-500' :
              'bg-blue-500'
            }`}></div>
            <span className="text-sm font-medium capitalize">{bus.status}</span>
          </div>
          <div className="text-sm text-gray-600">
            ETA: <span className="font-medium text-blue-600">{bus.estimatedPickupTime}</span>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Bus Number:</span>
            <div className="font-medium text-blue-600">{bus.busNumber}</div>
          </div>
          <div>
            <span className="text-gray-500">Driver:</span>
            <div className="font-medium">{bus.driverName}</div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          📍 Current location: {hasValidCoordinates ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : 'Invalid coordinates'}
        </div>
      </div>

      {/* Next Stops */}
      <div className="bg-white rounded-lg border p-4">
        <h5 className="font-medium text-gray-900 mb-3">🚏 Upcoming Stops</h5>
        <div className="space-y-2">
          {busStops.map((stop, index) => (
            <div key={stop.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm font-medium">{stop.name}</span>
              </div>
              <div className="text-xs text-gray-500">
                <span className="mr-2">{stop.distance}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{stop.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Summary */}
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span>Start: Gulshan</span>
        </div>
        <div className="flex-1 h-px bg-gray-300 relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span>End: Dhanmondi</span>
        </div>
      </div>
    </div>
  );
}