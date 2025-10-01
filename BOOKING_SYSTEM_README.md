# Dhaka Bus Service - Real-time Ticket Booking System

## Overview
A comprehensive bus service application with real-time ticket booking, GPS tracking, and payment integration.

## Features

### 🎫 Ticket Booking System
- **Multi-step booking process**: Route selection → Bus selection → Seat selection → Payment
- **Real-time seat availability**: Live updates on seat status
- **Interactive seat map**: Visual seat selection interface
- **Booking confirmation**: Instant confirmation with ticket details

### 🚌 Real-time Bus Tracking
- **Live GPS tracking**: Real-time bus location on Google Maps
- **ETA calculations**: Estimated arrival times for passengers
- **Status updates**: Bus approaching, boarding, departed notifications
- **Bus stop markers**: Nearby bus stops displayed on map

### 💳 Payment System
- **Multiple payment methods**:
  - bKash (Mobile Banking)
  - Nagad (Mobile Banking)
  - Rocket (Mobile Banking)
  - Credit/Debit Cards
  - Bank Transfer
- **Secure payment processing**: Form validation and secure transactions
- **Payment confirmation**: Instant payment success notifications

### 🔔 Real-time Notifications (PusherJS)
- **Browser notifications**: System-level notifications
- **In-app notifications**: Beautiful notification toasts
- **Real-time updates**: Live booking confirmations, payment status
- **Bus status alerts**: Bus approaching, delays, cancellations

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the frontend directory:

```env
# Google Maps API Key (Required for bus tracking)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key

# Pusher Configuration (Required for real-time notifications)
NEXT_PUBLIC_PUSHER_KEY=your_actual_pusher_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap2

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Google Maps Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Maps JavaScript API
4. Create API key and add it to `.env.local`

### 3. Pusher Setup
1. Sign up at [Pusher.com](https://pusher.com/)
2. Create a new app
3. Get your app keys and add to `.env.local`

### 4. Install Dependencies
```bash
cd frontend
npm install
```

### 5. Run Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:8000`

## Usage

### For Passengers
1. **Login**: Navigate to `/auth/login` and login as passenger
2. **Dashboard**: View your bookings and account info
3. **Book Ticket**: 
   - Go to "Book Ticket" in navigation
   - Select route and preferred time
   - Choose your bus from available options
   - Select seats from interactive seat map
   - Complete payment through preferred method
   - Receive booking confirmation and notifications

### Real-time Features
- **Live tracking**: Watch bus location on map during booking
- **Seat updates**: See real-time seat availability changes
- **Notifications**: Get notified about booking status, payment confirmation
- **Bus alerts**: Receive notifications when bus is approaching

## Technical Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling
- **Axios**: HTTP client for API calls
- **Google Maps API**: Interactive maps and tracking
- **PusherJS**: Real-time WebSocket connections

### Backend
- **NestJS**: Node.js framework with TypeScript
- **PostgreSQL**: Database for booking data
- **JWT**: Authentication tokens
- **CORS**: Cross-origin resource sharing

## API Endpoints

### Passenger Booking
- `GET /routes` - Get available routes
- `GET /buses/:routeId` - Get buses for route
- `POST /bookings` - Create new booking
- `POST /payments` - Process payment

### Real-time Data
- WebSocket connections via Pusher for:
  - Booking confirmations
  - Payment status updates
  - Bus location updates
  - Seat availability changes

## File Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── BusTracker.tsx          # Google Maps bus tracking
│   │   ├── PaymentModal.tsx        # Payment processing modal
│   │   ├── PassengerNavbar.tsx     # Navigation for passengers
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts                  # HTTP client configuration
│   │   ├── pusher.ts               # Real-time notifications
│   │   └── validation.ts           # Form validation
│   ├── passenger/
│   │   ├── book-ticket/
│   │   │   └── page.tsx           # Main booking interface
│   │   ├── dashboard/
│   │   └── ...
│   └── ...
└── ...
```

## Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test booking flow end-to-end
5. Submit pull request

## Support
For technical support or feature requests, please create an issue in the repository.

---

**Note**: Make sure to replace placeholder API keys with actual values for full functionality.