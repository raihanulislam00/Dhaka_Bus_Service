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

interface SimpleBusTrackerProps {
  bus: Bus;
}

export default function SimpleBusTracker({ bus }: SimpleBusTrackerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [busMarker, setBusMarker] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Dhaka city center coordinates
  const dhakaCenter = { lat: 23.8103, lng: 90.4125 };
  
  useEffect(() => {
    loadLeafletMap();
  }, []);

  useEffect(() => {
    if (map && bus) {
      updateBusLocation();
    }
  }, [map, bus]);

  const loadLeafletMap = async () => {
    // Check if Leaflet is already loaded
    if (window.L) {
      initializeMap();
      return;
    }

    try {
      // Load Leaflet CSS first
      if (!document.querySelector('link[href*="leaflet"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        cssLink.crossOrigin = '';
        document.head.appendChild(cssLink);
      }

      // Load Leaflet JS
      if (!document.querySelector('script[src*="leaflet"]')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        script.onload = () => {
          // Wait a bit for Leaflet to fully initialize
          setTimeout(() => {
            if (window.L) {
              initializeMap();
            } else {
              console.error('Leaflet failed to load');
              // Fallback to simple static map
              showStaticMap();
            }
          }, 100);
        };
        
        script.onerror = () => {
          console.error('Failed to load Leaflet script');
          showStaticMap();
        };
        
        document.head.appendChild(script);
      }
    } catch (error) {
      console.error('Error loading Leaflet:', error);
      showStaticMap();
    }
  };

  const initializeMap = () => {
    if (mapRef.current && window.L) {
      // Initialize Leaflet map with OpenStreetMap tiles
      const mapInstance = window.L.map(mapRef.current).setView([bus.currentLocation.lat, bus.currentLocation.lng], 13);

      // Add OpenStreetMap tiles (free, no API key required)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      setMap(mapInstance);
      setIsLoaded(true);
    }
  };

  const updateBusLocation = () => {
    if (!map || !window.L) return;

    // Remove existing marker
    if (busMarker) {
      map.removeLayer(busMarker);
    }

    // Create custom bus icon
    const busIcon = window.L.divIcon({
      html: `
        <div style="
          background-color: #3B82F6;
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ${bus.status === 'approaching' ? 'animation: pulse 2s infinite;' : ''}
        ">
          🚌
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        </style>
      `,
      className: 'custom-bus-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    // Create new marker
    const marker = window.L.marker([bus.currentLocation.lat, bus.currentLocation.lng], {
      icon: busIcon
    }).addTo(map);

    // Add popup with bus info
    marker.bindPopup(`
      <div style="text-align: center; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; color: #3B82F6; font-size: 16px;">🚌 Bus ${bus.busNumber}</h3>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Driver:</strong> ${bus.driverName}</p>
        <p style="margin: 4px 0; font-size: 14px; text-transform: capitalize;"><strong>Status:</strong> ${bus.status}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #10B981;"><strong>ETA:</strong> ${bus.estimatedPickupTime}</p>
      </div>
    `).openPopup();

    setBusMarker(marker);

    // Center map on bus location
    map.setView([bus.currentLocation.lat, bus.currentLocation.lng], 13);

    // Add some nearby bus stops
    addBusStops();
  };

  const addBusStops = () => {
    if (!map || !window.L) return;

    const busStops = [
      { lat: bus.currentLocation.lat + 0.01, lng: bus.currentLocation.lng + 0.01, name: 'Gulshan Circle' },
      { lat: bus.currentLocation.lat - 0.01, lng: bus.currentLocation.lng - 0.01, name: 'Dhanmondi 27' },
      { lat: bus.currentLocation.lat + 0.005, lng: bus.currentLocation.lng - 0.005, name: 'Shahbagh' },
      { lat: bus.currentLocation.lat - 0.008, lng: bus.currentLocation.lng + 0.012, name: 'Uttara Sector 7' },
      { lat: bus.currentLocation.lat + 0.015, lng: bus.currentLocation.lng - 0.008, name: 'Mirpur 10' }
    ];

    busStops.forEach(stop => {
      const stopIcon = window.L.divIcon({
        html: `
          <div style="
            background-color: #10B981;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          ">
            🚏
          </div>
        `,
        className: 'custom-stop-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      window.L.marker([stop.lat, stop.lng], { icon: stopIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; padding: 4px;">
            <strong>${stop.name}</strong><br>
            <small>Bus Stop</small>
          </div>
        `);
    });
  };

  const showStaticMap = () => {
    // Fallback static map representation
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-full bg-blue-100 rounded-lg flex flex-col items-center justify-center p-4" style="min-height: 300px;">
          <div class="text-6xl mb-4">🗺️</div>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-blue-900 mb-2">Dhaka Bus Route Map</h3>
            <div class="bg-white rounded-lg p-4 mb-4 max-w-sm">
              <div class="flex items-center justify-between mb-2">
                <span class="text-blue-600 font-medium">Bus ${bus.busNumber}</span>
                <span class="text-sm text-gray-500">${bus.status}</span>
              </div>
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">🚌</div>
                <div class="flex-1">
                  <div class="text-sm font-medium">${bus.driverName}</div>
                  <div class="text-xs text-gray-500">Driver</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-sm text-gray-600">ETA: ${bus.estimatedPickupTime}</div>
                <div class="text-xs text-gray-500 mt-1">Location: ${bus.currentLocation.lat.toFixed(4)}, ${bus.currentLocation.lng.toFixed(4)}</div>
              </div>
            </div>
            <div class="text-sm text-blue-700">
              <div>📍 Route: Gulshan → Dhanmondi</div>
              <div class="mt-1">🚏 Next stops: Gulshan Circle, Shahbagh, Dhanmondi 27</div>
            </div>
          </div>
        </div>
      `;
    }
    setIsLoaded(true);
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
          busMarker.setLatLng([bus.currentLocation.lat, bus.currentLocation.lng]);
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
        <span className="text-sm text-gray-500">Updates every 5 seconds • OpenStreetMap</span>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg border border-gray-300"
        style={{ height: '300px' }}
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
        
        <div className="mt-2 flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">🚌</div>
            <span>Bus Location</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">🚏</div>
            <span>Bus Stops</span>
          </div>
        </div>
      </div>

      {/* Simple Route Info */}
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-blue-600 font-medium">Route Information</span>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-500">From:</span>
            <div className="font-medium">Gulshan</div>
          </div>
          <div>
            <span className="text-gray-500">To:</span>
            <div className="font-medium">Dhanmondi</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Declare Leaflet global
declare global {
  interface Window {
    L: any;
  }
}