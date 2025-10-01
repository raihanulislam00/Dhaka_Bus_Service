'use client';

import { useEffect, useRef, useState } from 'react';

interface Bus {
  id: number;
  busNumber: string;
  driverName: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  status: 'approaching' | 'boarding' | 'departed' | 'arrived';
  estimatedPickupTime: string;
}

interface BusTrackerProps {
  bus: Bus;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function BusTracker({ bus }: BusTrackerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [busMarker, setBusMarker] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = initializeMap;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (map && bus) {
      updateBusLocation();
    }
  }, [map, bus]);

  const initializeMap = () => {
    if (mapRef.current && window.google) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: bus.currentLocation,
        zoom: 13,
        styles: [
          {
            featureType: 'transit.station.bus',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      setMap(mapInstance);
      setIsLoaded(true);
    }
  };

  const updateBusLocation = () => {
    if (!map || !window.google) return;

    // Remove existing marker
    if (busMarker) {
      busMarker.setMap(null);
    }

    // Create bus icon
    const busIcon = {
      url: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="24" height="16" rx="2" fill="#3B82F6"/>
          <rect x="6" y="10" width="4" height="3" fill="white" opacity="0.8"/>
          <rect x="10" y="10" width="4" height="3" fill="white" opacity="0.8"/>
          <rect x="14" y="10" width="4" height="3" fill="white" opacity="0.8"/>
          <rect x="18" y="10" width="4" height="3" fill="white" opacity="0.8"/>
          <rect x="22" y="10" width="4" height="3" fill="white" opacity="0.8"/>
          <circle cx="10" cy="26" r="3" fill="#1F2937"/>
          <circle cx="22" cy="26" r="3" fill="#1F2937"/>
          <circle cx="10" cy="26" r="1.5" fill="white"/>
          <circle cx="22" cy="26" r="1.5" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16)
    };

    // Create new marker
    const marker = new window.google.maps.Marker({
      position: bus.currentLocation,
      map: map,
      icon: busIcon,
      title: `Bus ${bus.busNumber} - ${bus.status}`,
      animation: window.google.maps.Animation.BOUNCE
    });

    // Create info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-3">
          <h3 class="font-semibold text-blue-600">Bus ${bus.busNumber}</h3>
          <p class="text-sm text-gray-600">Driver: ${bus.driverName}</p>
          <p class="text-sm font-medium capitalize">${bus.status}</p>
          <p class="text-sm text-green-600">ETA: ${bus.estimatedPickupTime}</p>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    setBusMarker(marker);

    // Center map on bus location
    map.setCenter(bus.currentLocation);

    // Add some nearby bus stops
    addBusStops();
  };

  const addBusStops = () => {
    const busStops = [
      { lat: bus.currentLocation.lat + 0.01, lng: bus.currentLocation.lng + 0.01, name: 'Gulshan Circle' },
      { lat: bus.currentLocation.lat - 0.01, lng: bus.currentLocation.lng - 0.01, name: 'Dhanmondi 27' },
      { lat: bus.currentLocation.lat + 0.005, lng: bus.currentLocation.lng - 0.005, name: 'Shahbagh' }
    ];

    busStops.forEach(stop => {
      const stopMarker = new window.google.maps.Marker({
        position: { lat: stop.lat, lng: stop.lng },
        map: map,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#10B981" stroke="white" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🚏</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24)
        },
        title: stop.name
      });
    });
  };

  // Simulate real-time updates
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      // Simulate bus movement (in real app, this would come from WebSocket or API)
      if (bus.status === 'approaching' || bus.status === 'boarding') {
        // Small random movement to simulate live tracking
        const newLat = bus.currentLocation.lat + (Math.random() - 0.5) * 0.001;
        const newLng = bus.currentLocation.lng + (Math.random() - 0.5) * 0.001;
        
        bus.currentLocation = { lat: newLat, lng: newLng };
        
        if (busMarker && map) {
          busMarker.setPosition(bus.currentLocation);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoaded, bus, busMarker, map]);

  if (!isLoaded) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Live Bus Tracking 🚌</h4>
        <span className="text-sm text-gray-500">Updates every 5 seconds</span>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg border border-gray-300"
      />
      
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
        
        <div className="mt-2 text-xs text-gray-500">
          📍 Current location: {bus.currentLocation.lat.toFixed(4)}, {bus.currentLocation.lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
}