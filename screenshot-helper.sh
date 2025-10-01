#!/bin/bash

# Screenshot automation script for Dhaka Bus Service
# This script helps navigate to different pages for screenshot taking

echo "🚌 Dhaka Bus Service - Screenshot Helper"
echo "======================================="
echo ""

# Check if servers are running
echo "Checking if servers are running..."

# Check backend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Backend server is running on http://localhost:3000"
else
    echo "❌ Backend server is not running. Start it with:"
    echo "   cd backend && npm run start:dev"
    exit 1
fi

# Check frontend  
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Frontend server is running on http://localhost:8000"
else
    echo "❌ Frontend server is not running. Start it with:"
    echo "   cd frontend && npm run dev"
    exit 1
fi

echo ""
echo "📸 Screenshot URLs - Open these in your browser:"
echo "================================================"

echo ""
echo "🏠 MAIN PAGES:"
echo "Homepage:        http://localhost:8000"
echo "About Page:      http://localhost:8000/about"  
echo "Contact Page:    http://localhost:8000/contact"

echo ""
echo "👥 PASSENGER PAGES:"
echo "Register:        http://localhost:8000/passenger/register"
echo "Login:           http://localhost:8000/passenger/login"
echo "Dashboard:       http://localhost:8000/passenger/dashboard"
echo "Book Ticket:     http://localhost:8000/passenger/book-ticket"

echo ""
echo "🚗 DRIVER PAGES:"
echo "Register:        http://localhost:8000/driver/register"
echo "Login:           http://localhost:8000/driver/login"
echo "Dashboard:       http://localhost:8000/driver/dashboard"
echo "Routes:          http://localhost:8000/driver/routes"
echo "Schedules:       http://localhost:8000/driver/schedules"
echo "Trips:           http://localhost:8000/driver/trips"

echo ""
echo "👨‍💼 ADMIN PAGES:"
echo "Login:           http://localhost:8000/admin/login"
echo "Register:        http://localhost:8000/admin/register"
echo "Dashboard:       http://localhost:8000/admin/dashboard"
echo "Manage Drivers:  http://localhost:8000/admin/manage-drivers"
echo "Manage Pass.:    http://localhost:8000/admin/manage-passengers"
echo "Routes:          http://localhost:8000/admin/routes"
echo "Schedules:       http://localhost:8000/admin/schedules"

echo ""
echo "🗺️ DEMO FEATURES:"
echo "Bus Tracking:    http://localhost:8000/demo/map"

echo ""
echo "📱 SCREENSHOT TIPS:"
echo "==================="
echo "1. Use browser width: 1920px for desktop screenshots"
echo "2. Use responsive mode for mobile screenshots"  
echo "3. Clear browser cache if pages don't load properly"
echo "4. Take both desktop and mobile versions"
echo "5. Save screenshots in /screenshots/ directory"
echo "6. Use exact filenames as specified in README.md"

echo ""
echo "🔧 TROUBLESHOOTING:"
echo "==================="
echo "• If pages show errors, check browser console (F12)"
echo "• Ensure database is seeded: cd backend && npm run seed:routes"
echo "• Clear localStorage if authentication issues occur"
echo "• Restart servers if experiencing issues"

echo ""
echo "Happy screenshotting! 📸"