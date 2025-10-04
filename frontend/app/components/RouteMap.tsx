'use client';

import { useEffect, useRef } from 'react';

// Leaflet types for better TypeScript support
interface LeafletMap {
  setView: (center: [number, number], zoom: number) => void;
  remove: () => void;
  fitBounds: (bounds: any, options?: any) => void;
  eachLayer: (fn: (layer: any) => void) => void;
  removeLayer: (layer: any) => void;
}

interface LeafletMarker {
  addTo: (map: LeafletMap) => void;
  bindPopup: (content: string) => LeafletMarker;
}

interface LeafletPolyline {
  addTo: (map: LeafletMap) => void;
}

interface LeafletFeatureGroup {
  getBounds: () => any;
}

interface Leaflet {
  map: (elementId: string) => LeafletMap;
  tileLayer: (url: string, options: any) => any;
  marker: (coords: [number, number], options?: any) => LeafletMarker;
  polyline: (coords: [number, number][], options: any) => LeafletPolyline;
  icon: (options: any) => any;
  featureGroup: (layers: any[]) => LeafletFeatureGroup;
}

declare global {
  interface Window {
    L: any; // Use any to avoid conflicts with existing Leaflet types
  }
}

interface RouteMapProps {
  route: {
    id: number;
    name: string;
    startLocation: string;
    endLocation: string;
    stops: string;
    distance: number;
  };
  className?: string;
}

// Coordinates for major Bangladesh cities and locations
const locationCoordinates: Record<string, [number, number]> = {
  'Dhaka': [23.8103, 90.4125],
  'Chittagong': [22.3475, 91.8123],
  'Sylhet': [24.8949, 91.8687],
  'Rajshahi': [24.3745, 88.6042],
  'Khulna': [22.8456, 89.5403],
  'Barisal': [22.7010, 90.3535],
  'Rangpur': [25.7439, 89.2752],
  'Cumilla': [23.4607, 91.1809],
  'Narsingdi': [23.9322, 90.7151],
  'Bhairab': [24.0525, 90.9760],
  'Feni': [23.0158, 91.3976],
};

export default function RouteMap({ route, className = '' }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(cssLink);
      }

      // Load JS
      if (!window.L) {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
    };

    loadLeaflet().then(() => {
      if (mapRef.current && window.L && !leafletMapRef.current) {
        initializeMap();
      }
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (leafletMapRef.current && window.L) {
      updateRoute();
    }
  }, [route]);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) {
      console.warn('Map container or Leaflet not ready');
      return;
    }

    try {
      // Create map instance
      const map = window.L.map(mapRef.current.id).setView([23.8103, 90.4125], 7);
      leafletMapRef.current = map;

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Wait a bit before updating route to ensure map is fully initialized
      setTimeout(() => {
        updateRoute();
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const updateRoute = () => {
    if (!leafletMapRef.current || !window.L) {
      console.warn('Map or Leaflet not ready');
      return;
    }

    const map = leafletMapRef.current;
    
    // Clear existing layers first
    try {
      map.eachLayer((layer: any) => {
        if (layer.options && (layer.options.attribution || layer._url)) {
          // Keep tile layers
          return;
        }
        map.removeLayer(layer);
      });
    } catch (error) {
      console.warn('Error clearing layers:', error);
    }

    // Validate route data
    if (!route || !route.startLocation || !route.endLocation) {
      console.warn('Invalid route data');
      return;
    }

    // Get coordinates for start and end locations
    const startCoords = locationCoordinates[route.startLocation];
    const endCoords = locationCoordinates[route.endLocation];

    if (!startCoords || !endCoords) {
      console.warn('Coordinates not found for route locations:', route.startLocation, route.endLocation);
      return;
    }

    // Create custom icons
    const startIcon = window.L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#fff" stroke-width="2"/>
          <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">BUS</text>
        </svg>
      `),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const endIcon = window.L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="#fff" stroke-width="2"/>
          <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">END</text>
        </svg>
      `),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add markers for start and end points
    try {
      const startMarker = window.L.marker(startCoords, { icon: startIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <strong style="color: #10b981; font-size: 16px;">Departure</strong><br/>
            <span style="font-size: 14px; color: #374151;">${route.startLocation}</span><br/>
            <small style="color: #6b7280;">Route: ${route.name}</small>
          </div>
        `);

      const endMarker = window.L.marker(endCoords, { icon: endIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <strong style="color: #ef4444; font-size: 16px;">Destination</strong><br/>
            <span style="font-size: 14px; color: #374151;">${route.endLocation}</span><br/>
            <small style="color: #6b7280;">Distance: ${route.distance}km</small>
          </div>
        `);
    } catch (error) {
      console.error('Error adding markers:', error);
      return;
    }

    // Create route line with intermediate stops
    const routeCoords: [number, number][] = [startCoords];
    
    // Add intermediate stop coordinates if available
    try {
      const stops = route.stops ? route.stops.split(',').map(stop => stop.trim()) : [];
      stops.forEach(stop => {
        if (stop && stop !== route.startLocation && stop !== route.endLocation) {
          const stopCoords = locationCoordinates[stop];
          if (stopCoords) {
            routeCoords.push(stopCoords);
            
            try {
              // Add stop marker
              const stopIcon = window.L.icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
                    <rect x="10" y="8" width="4" height="8" fill="white" rx="1"/>
                  </svg>
                `),
                iconSize: [24, 24],
                iconAnchor: [12, 24],
                popupAnchor: [0, -24],
              });

              window.L.marker(stopCoords, { icon: stopIcon })
                .addTo(map)
                .bindPopup(`
                  <div style="text-align: center; padding: 6px;">
                    <strong style="color: #3b82f6; font-size: 14px;">Bus Stop</strong><br/>
                    <span style="font-size: 12px; color: #374151;">${stop}</span>
                  </div>
                `);
            } catch (error) {
              console.warn('Error adding stop marker for:', stop, error);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Error processing stops:', error);
    }
    
    routeCoords.push(endCoords);

    // Draw the route line
    try {
      if (routeCoords.length >= 2) {
        window.L.polyline(routeCoords, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 5',
        }).addTo(map);
      }
    } catch (error) {
      console.error('Error drawing route line:', error);
    }

    // Fit map to show the entire route
    try {
      const markers = [
        window.L.marker(startCoords),
        window.L.marker(endCoords)
      ];
      
      const group = window.L.featureGroup(markers);
      const bounds = group.getBounds();
      
      if (bounds && bounds.isValid && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      } else {
        throw new Error('Invalid bounds');
      }
    } catch (error) {
      console.warn('Error fitting bounds, using fallback:', error);
      // Fallback: center on start location
      try {
        map.setView(startCoords, 8);
      } catch (fallbackError) {
        console.error('Fallback setView failed:', fallbackError);
      }
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}>
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">M</span>
              Route Map
            </h3>
            <p className="text-sm text-gray-600">{route.name}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Distance</div>
            <div className="text-lg font-bold text-blue-600">{route.distance}km</div>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
            <span>Departure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">•</div>
            <span>Bus Stop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">E</div>
            <span>Destination</span>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-5">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 animate-spin flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-blue-500">MAP</span>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading Route Map...</p>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        id={`route-map-${route.id}`}
        className="w-full h-full min-h-[400px] bg-gray-100"
      />
    </div>
  );
}