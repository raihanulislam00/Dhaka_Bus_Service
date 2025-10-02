# 🎭 DEMO CREDENTIALS FOR DHAKA BUS SERVICE

## 📋 Demo User Accounts

### 👤 ADMIN CREDENTIALS
```
Username: admin
Password: admin123
Email: admin@dhakabus.com
Full Name: System Administrator
```

### 👥 PASSENGER CREDENTIALS
```
Username: passenger1
Password: passenger123
Email: rahul@example.com
Full Name: Rahul Ahmed

Username: passenger2  
Password: passenger123
Email: fatima@example.com
Full Name: Fatima Khan

Username: testpassenger
Password: test123
Email: test@passenger.com
Full Name: Test Passenger
```

### 🚛 DRIVER CREDENTIALS
```
Username: driver1
Password: driver123
Email: karim@driver.com
Full Name: Md. Karim Uddin

Username: driver2
Password: driver123  
Email: rahman@driver.com
Full Name: Abdul Rahman

Username: testdriver
Password: test123
Email: test@driver.com
Full Name: Test Driver
```

## 🛣️ Demo Routes Available
- **Dhaka-Chittagong Express** (৳450) - 6.5 hours
- **Dhaka-Sylhet Deluxe** (৳420) - 6.25 hours  
- **Dhaka-Cox's Bazar Beach Express** (৳650) - 8 hours
- **Dhaka-Rangpur Northern Express** (৳500) - 7 hours

## 📅 Demo Schedules
Each route has multiple daily schedules:
- Morning departure: 08:00 AM
- Evening departure: 03:00 PM  
- Night departure: 10:00 PM

## 🔗 Access URLs

### Development
- **Frontend**: http://localhost:8000
- **Backend**: http://localhost:3000

### Production (Vercel/Railway)
- **Frontend**: https://your-app-name.vercel.app
- **Backend**: https://your-backend-name.up.railway.app

## 🧪 Testing Flow

### As Admin:
1. Login with `admin / admin123`
2. Create and manage routes
3. Create and manage schedules  
4. View all passengers and drivers
5. Monitor booking statistics

### As Passenger:
1. Login with `passenger1 / passenger123`
2. Browse available routes
3. Book multiple seats (up to 4 seats)
4. View booking history
5. Cancel bookings

### As Driver:
1. Login with `driver1 / driver123`
2. View assigned routes and schedules
3. Update location and status
4. View trip assignments

## 🌟 Key Features to Test

### Multiple Seat Booking
- Book 1-4 seats in a single transaction
- Visual seat selection interface
- Grouped booking management
- Booking group cancellation

### Real-time Updates  
- Live bus tracking
- Seat availability updates
- Booking notifications

### Role-based Access
- Admin dashboard with full control
- Passenger booking interface
- Driver operational dashboard

## 📝 Environment Variables for Vercel

```env
# Database (PostgreSQL on Railway/Supabase)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT
JWT_SECRET=your-secret-key-here

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=https://your-app-name.vercel.app
```

## 🚀 Quick Start Commands

```bash
# Development
npm run start:dev

# Production Build  
npm run build
npm run start:prod

# Database Seeding
npm run seed:demo
```

---

**Note**: These are demo credentials for testing purposes. In production, ensure to use strong passwords and proper security measures.