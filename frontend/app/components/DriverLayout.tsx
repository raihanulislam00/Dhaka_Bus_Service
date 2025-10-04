'use client';

import { useState } from 'react';
import DriverSidebar from './DriverSidebar';

interface DriverLayoutProps {
  children: React.ReactNode;
}

export default function DriverLayout({ children }: DriverLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Start expanded by default

  // Generate the margin class dynamically
  const getMainContentClasses = () => {
    const baseClasses = "transition-all duration-300 p-6 pt-20 lg:pt-6";
    const marginClass = sidebarCollapsed ? "lg:ml-20" : "lg:ml-80";
    return `${baseClasses} ${marginClass}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Sidebar */}
      <DriverSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main Content */}
      <div className={getMainContentClasses()}>
        {children}
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 lg:hidden z-30 transition-opacity duration-300 ${
          !sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarCollapsed(true)}
      />
    </div>
  );
}