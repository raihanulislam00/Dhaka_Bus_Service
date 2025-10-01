import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "h-10 w-auto", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* SVG Logo */}
      <div className="relative">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Background Circle */}
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="url(#gradient1)"
            stroke="#1e40af"
            strokeWidth="2"
          />
          
          {/* Bus Body */}
          <rect
            x="8"
            y="18"
            width="32"
            height="16"
            rx="3"
            fill="#ffffff"
            stroke="#1e40af"
            strokeWidth="1.5"
          />
          
          {/* Bus Windows */}
          <rect x="10" y="20" width="6" height="4" rx="1" fill="#3b82f6" opacity="0.3" />
          <rect x="18" y="20" width="6" height="4" rx="1" fill="#3b82f6" opacity="0.3" />
          <rect x="26" y="20" width="6" height="4" rx="1" fill="#3b82f6" opacity="0.3" />
          <rect x="34" y="20" width="4" height="4" rx="1" fill="#3b82f6" opacity="0.3" />
          
          {/* Bus Door */}
          <rect x="10" y="26" width="4" height="6" rx="1" fill="#e5e7eb" stroke="#6b7280" strokeWidth="0.5" />
          
          {/* Bus Wheels */}
          <circle cx="14" cy="36" r="3" fill="#374151" />
          <circle cx="14" cy="36" r="1.5" fill="#6b7280" />
          <circle cx="34" cy="36" r="3" fill="#374151" />
          <circle cx="34" cy="36" r="1.5" fill="#6b7280" />
          
          {/* Bus Front Light */}
          <circle cx="41" cy="26" r="1.5" fill="#fbbf24" />
          
          {/* Bangladeshi Flag Colors Accent */}
          <rect x="36" y="28" width="2" height="4" fill="#006a4e" />
          <circle cx="37" cy="30" r="0.8" fill="#f42a41" />
          
          {/* Route Lines */}
          <path
            d="M6 12 Q24 8 42 12"
            stroke="#3b82f6"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="2,2"
          />
          
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="50%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Pulse Animation Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-20 animate-ping"></div>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Dhaka
            </span>
            <span className="text-xl font-bold text-gray-800">Bus</span>
          </div>
          <span className="text-xs font-medium text-gray-600 -mt-1">
            Service
          </span>
        </div>
      )}
    </div>
  );
}

// Compact version for smaller spaces
export function LogoCompact({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className="relative">
      <svg
        width="32"
        height="32"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} drop-shadow-md`}
      >
        <circle cx="24" cy="24" r="22" fill="url(#gradient1)" stroke="#1e40af" strokeWidth="2" />
        <rect x="8" y="18" width="32" height="16" rx="3" fill="#ffffff" stroke="#1e40af" strokeWidth="1.5" />
        <rect x="10" y="20" width="6" height="4" rx="1" fill="#3b82f6" opacity="0.3" />
        <rect x="18" y="20" width="6" height="4" rx="1" fill="#3b82f6" opacity="0.3" />
        <rect x="26" y="20" width="6" height="4" rx="1" fill="#3b82f6" opacity="0.3" />
        <rect x="34" y="20" width="4" height="4" rx="1" fill="#3b82f6" opacity="0.3" />
        <rect x="10" y="26" width="4" height="6" rx="1" fill="#e5e7eb" stroke="#6b7280" strokeWidth="0.5" />
        <circle cx="14" cy="36" r="3" fill="#374151" />
        <circle cx="14" cy="36" r="1.5" fill="#6b7280" />
        <circle cx="34" cy="36" r="3" fill="#374151" />
        <circle cx="34" cy="36" r="1.5" fill="#6b7280" />
        <circle cx="41" cy="26" r="1.5" fill="#fbbf24" />
        <rect x="36" y="28" width="2" height="4" fill="#006a4e" />
        <circle cx="37" cy="30" r="0.8" fill="#f42a41" />
        <path d="M6 12 Q24 8 42 12" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="50%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}