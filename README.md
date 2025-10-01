# 🚌 Dhaka Bus Service

A comprehensive bus service management system built with NestJS (backend) and Next.js (frontend) that provides seamless transportation management for passengers, drivers, and administrators.

## 🌟 Features

### 👥 For Passengers
- **User Registration & Authentication** - Secure signup and login system
- **Ticket Booking & Management** - Easy ticket booking with seat selection
- **Route & Schedule Viewing** - Real-time bus schedules and route information
- **Journey History Tracking** - Complete travel history and digital receipts
- **Real-time Bus Tracking** - Track your bus location in real-time
- **Payment Integration** - Multiple payment options for convenience

### 🚗 For Drivers
- **Driver Registration & Login** - Professional driver onboarding
- **Route Assignment Management** - View assigned routes and schedules
- **Trip Reporting** - Report trip status and passenger counts
- **Schedule Management** - Access daily and weekly schedules
- **Status Updates** - Update trip status and delays in real-time

### 👨‍💼 For Admins
- **Complete System Management** - Full control over the entire system
- **Driver Approval & Management** - Review and approve driver applications
- **Passenger Account Management** - Monitor and manage passenger accounts  
- **Route & Schedule Configuration** - Create and modify bus routes and schedules
- **Analytics & Reporting** - Comprehensive system analytics and reports
- **Revenue Management** - Track earnings and financial reports

## ️ Technology Stack

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: SQLite/PostgreSQL with TypeORM
- **Authentication**: JWT tokens with Passport.js
- **Validation**: class-validator & class-transformer
- **Password Hashing**: bcrypt
- **File Upload**: Multer for document handling
- **Real-time**: WebSocket support for live updates

### Frontend (Next.js)
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4.0
- **Routing**: App Router with dynamic routes
- **State Management**: React hooks and context
- **HTTP Client**: Axios for API communication
- **Real-time**: Pusher for live updates
- **Maps**: Interactive mapping for bus tracking

## 📁 Project Structure

```
Dhaka_Bus_Service/
├── 📄 README.md                    # Main documentation
├── 📄 BOOKING_SYSTEM_README.md     # Booking system details
├── 📄 package.json                 # Root package configuration
├── 📁 screenshots/                 # Application screenshots
├── 📁 backend/                     # NestJS backend application
│   ├── 📁 src/
│   │   ├── 📁 admin/              # Admin module & controllers
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   ├── 📁 dto/            # Data transfer objects
│   │   │   ├── 📁 entities/       # Database entities
│   │   │   ├── 📁 guards/         # Authentication guards
│   │   │   └── 📁 services/       # Business logic services
│   │   ├── 📁 driver/             # Driver module & controllers
│   │   │   ├── driver.controller.ts
│   │   │   ├── driver.service.ts
│   │   │   └── 📁 dto/            # Driver DTOs
│   │   ├── 📁 passenger/          # Passenger module & controllers
│   │   │   ├── passenger.controller.ts
│   │   │   ├── passenger.service.ts
│   │   │   ├── 📁 dto/            # Passenger DTOs
│   │   │   └── 📁 entities/       # Passenger entities
│   │   ├── app.module.ts          # Main application module
│   │   └── main.ts                # Application entry point
│   ├── 📁 scripts/                # Utility scripts
│   │   ├── seed-routes.ts         # Database seeding
│   │   └── test-routes.ts         # Route testing
│   ├── 📁 uploads/                # File upload storage
│   │   ├── 📁 nid/               # National ID documents
│   │   └── 📁 photos/            # Profile photos
│   ├── dhaka_bus_service.sqlite   # SQLite database
│   └── 📄 package.json           # Backend dependencies
├── 📁 frontend/                   # Next.js frontend application
│   ├── 📁 app/
│   │   ├── 📁 admin/             # Admin portal pages
│   │   │   ├── 📁 dashboard/     # Admin dashboard
│   │   │   ├── 📁 login/         # Admin authentication
│   │   │   ├── 📁 register/      # Admin registration
│   │   │   ├── 📁 manage-drivers/    # Driver management
│   │   │   ├── 📁 manage-passengers/ # Passenger management
│   │   │   ├── 📁 routes/        # Route management
│   │   │   └── 📁 schedules/     # Schedule management
│   │   ├── 📁 driver/            # Driver portal pages
│   │   │   ├── 📁 dashboard/     # Driver dashboard
│   │   │   ├── 📁 login/         # Driver authentication
│   │   │   ├── 📁 register/      # Driver registration
│   │   │   ├── 📁 routes/        # Driver routes
│   │   │   ├── 📁 schedules/     # Driver schedules
│   │   │   └── 📁 trips/         # Trip management
│   │   ├── 📁 passenger/         # Passenger portal pages
│   │   │   ├── 📁 dashboard/     # Passenger dashboard
│   │   │   ├── 📁 login/         # Passenger authentication
│   │   │   ├── 📁 register/      # Passenger registration
│   │   │   └── 📁 book-ticket/   # Ticket booking
│   │   ├── 📁 components/        # Reusable UI components
│   │   │   ├── Navbar.tsx        # Navigation components
│   │   │   ├── Layout.tsx        # Page layouts
│   │   │   ├── BusTracker.tsx    # Bus tracking components
│   │   │   └── PaymentModal.tsx  # Payment interface
│   │   ├── 📁 about/             # About page
│   │   ├── 📁 contact/           # Contact page
│   │   ├── 📁 demo/              # Demo features
│   │   ├── page.tsx              # Homepage
│   │   └── layout.tsx            # Root layout
│   ├── 📁 public/                # Static assets
│   └── 📄 package.json          # Frontend dependencies
└── 📁 node_modules/              # Dependencies
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **SQLite** (included) or **PostgreSQL** (optional)
- **Git** for version control

### 🔧 Quick Start

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/raihanulislam00/Dhaka_Bus_Service.git
cd Dhaka_Bus_Service
```

#### 2️⃣ Install Root Dependencies
```bash
npm install
```

#### 3️⃣ Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

**Database Configuration:**
The project uses SQLite by default for development. The database file is located at `backend/dhaka_bus_service.sqlite`.

For PostgreSQL (optional):
```typescript
// In src/app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'your_password',
  database: 'dhaka_bus_service',
  autoLoadEntities: true,
  synchronize: true, // Only for development
})
```

**Seed the database with sample data:**
```bash
npm run seed:routes
```

**Start the backend server:**
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

#### 4️⃣ Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

**Start the frontend development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:8000`

#### 5️⃣ Access the Application

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api (if Swagger is configured)

### 🔐 Default Test Accounts

After seeding the database, you can use these test accounts:

**Admin Account:**
- Email: admin@dhakabus.com
- Password: admin123

**Driver Account:**
- Email: driver@dhakabus.com  
- Password: driver123

**Passenger Account:**
- Email: passenger@dhakabus.com
- Password: passenger123

## 🔌 API Endpoints

### 🔐 Authentication Endpoints

#### Passenger Authentication
```http
POST /passenger/register    # Register a new passenger
POST /passenger/login       # Passenger login
GET  /passenger/profile     # Get passenger profile
PUT  /passenger/profile     # Update passenger profile
```

#### Driver Authentication  
```http
POST /driver/register       # Register a new driver
POST /driver/login          # Driver login
GET  /driver/profile        # Get driver profile
PUT  /driver/profile        # Update driver profile
PATCH /driver/status        # Update driver status
```

#### Admin Authentication
```http
POST /admin/register        # Register a new admin
POST /admin/login           # Admin login
GET  /admin/profile         # Get admin profile
```

### 🎫 Booking & Ticket Endpoints
```http
POST /tickets/book          # Book a new ticket
GET  /tickets/passenger/:id # Get passenger's tickets
GET  /tickets/:id          # Get ticket details
PUT  /tickets/:id/cancel   # Cancel a ticket
```

### 🚌 Route & Schedule Endpoints
```http
GET  /routes               # Get all routes
GET  /routes/:id           # Get specific route
POST /routes               # Create new route (Admin)
PUT  /routes/:id           # Update route (Admin)
DELETE /routes/:id         # Delete route (Admin)

GET  /schedules            # Get all schedules
GET  /schedules/route/:id  # Get schedules for route
POST /schedules            # Create schedule (Admin)
PUT  /schedules/:id        # Update schedule (Admin)
```

### 👨‍💼 Admin Management Endpoints
```http
GET    /admin/passengers   # Get all passengers
GET    /admin/drivers      # Get all drivers
PATCH  /admin/drivers/:id/approve    # Approve driver
PATCH  /admin/drivers/:id/reject     # Reject driver
DELETE /admin/passengers/:id         # Delete passenger
GET    /admin/analytics    # Get system analytics
```

### 🚗 Driver Operational Endpoints
```http
GET  /driver/routes        # Get assigned routes
GET  /driver/schedules     # Get driver schedules
POST /driver/trips/start   # Start a trip
POST /driver/trips/end     # End a trip
PUT  /driver/trips/:id/status  # Update trip status
```

## 🗃️ Database Schema

### 👤 User Management Tables

#### Passengers Table
```sql
- id (Primary Key)
- firstName, lastName
- email (Unique)
- password (Hashed)
- phoneNumber
- dateOfBirth
- address
- createdAt, updatedAt
- isActive (Boolean)
```

#### Drivers Table
```sql
- id (Primary Key)
- firstName, lastName
- email (Unique)
- password (Hashed)
- phoneNumber
- licenseNumber (Unique)
- experienceYears
- status (pending/approved/rejected/inactive)
- nidDocument (File path)
- profilePhoto (File path)
- createdAt, updatedAt
```

#### Admin Table
```sql
- id (Primary Key)
- firstName, lastName
- email (Unique)
- password (Hashed)
- role (super_admin/admin)
- permissions (JSON)
- createdAt, updatedAt
```

### 🚌 Operational Tables

#### Routes Table
```sql
- id (Primary Key)
- routeName
- startLocation
- endLocation
- distance (in km)
- estimatedDuration
- fare
- stops (JSON Array)
- isActive (Boolean)
- createdAt, updatedAt
```

#### Schedules Table
```sql
- id (Primary Key)
- routeId (Foreign Key)
- driverId (Foreign Key)
- busNumber
- departureTime
- arrivalTime
- availableSeats
- totalSeats
- isActive (Boolean)
- createdAt, updatedAt
```

#### Tickets Table
```sql
- id (Primary Key)
- passengerId (Foreign Key)
- scheduleId (Foreign Key)
- seatNumber
- bookingDate
- journeyDate
- fare
- paymentStatus (pending/paid/refunded)
- ticketStatus (active/cancelled/used)
- paymentMethod
- transactionId
- createdAt, updatedAt
```

#### Trips Table
```sql
- id (Primary Key)
- scheduleId (Foreign Key)
- driverId (Foreign Key)
- startTime
- endTime
- currentLocation (GPS coordinates)
- status (not_started/in_progress/completed/cancelled)
- passengerCount
- notes
- createdAt, updatedAt
```

## Authentication Flow

1. Users register through the respective registration endpoints
2. Upon successful registration, users can login using their credentials
3. JWT tokens are issued upon successful authentication
4. Tokens are stored in localStorage and used for subsequent API calls
5. Protected routes require valid JWT tokens

## User Roles & Permissions

### Passenger
- Can register and login
- Can book tickets
- Can view their booking history
- Can view routes and schedules

### Driver
- Can register and login
- Initial status is "inactive" pending admin approval
- Can view assigned routes and schedules
- Can submit trip reports

### Admin
- Can login (registration typically done by super admin)
- Can approve/reject driver applications
- Can manage all passengers and drivers
- Can configure routes and schedules
- Can view system analytics

## 📊 Development Status

### ✅ Completed Features
- **User Authentication System** - Complete registration and login for all user types
- **Database Models & Relationships** - Full ERD implementation with TypeORM
- **Backend API Structure** - RESTful APIs with NestJS
- **Frontend UI Components** - Responsive design with Tailwind CSS
- **Route Management** - Admin can create and manage bus routes
- **User Dashboards** - Personalized dashboards for each user role
- **File Upload System** - Document and photo upload functionality
- **Security Implementation** - JWT authentication and password hashing
- **Database Seeding** - Sample data for testing and development

### 🚧 In Progress
- **Ticket Booking System** - Advanced booking with seat selection
- **Real-time Bus Tracking** - GPS integration and live location updates
- **Payment Gateway Integration** - Multiple payment methods support
- **Schedule Management** - Dynamic schedule creation and management
- **Notification System** - Email and SMS notifications
- **Mobile Responsiveness** - Enhanced mobile user experience

### 📋 Planned Features
- **Mobile Application** - React Native mobile app
- **Advanced Analytics** - Business intelligence and reporting
- **Multi-language Support** - Bengali and English localization
- **Offline Mode** - PWA capabilities for offline access
- **Integration APIs** - Third-party service integrations
- **AI Features** - Route optimization and predictive analytics
- **IoT Integration** - Smart bus monitoring systems

### 🎯 Current Sprint Goals
1. Complete ticket booking flow
2. Implement real-time tracking
3. Add payment processing
4. Enhance admin analytics
5. Improve mobile responsiveness

### 📈 Progress Metrics
- **Backend Completion**: 75%
- **Frontend Completion**: 70%
- **Testing Coverage**: 60%
- **Documentation**: 85%
- **Mobile Responsiveness**: 65%

## 🧪 Testing

### Running Tests

**Backend Tests:**
```bash
cd backend

# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

**Frontend Tests:**
```bash
cd frontend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component and service level testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user flow testing
- **Performance Tests**: Load and stress testing

## 🚀 Deployment

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in production mode
docker-compose -f docker-compose.prod.yml up
```

### Environment Variables

**Backend (.env):**
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=dhaka_bus_service
JWT_SECRET=your-jwt-secret
UPLOAD_PATH=./uploads
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=your-cluster
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes
5. **Test** thoroughly
6. **Commit** your changes (`git commit -m 'Add amazing feature'`)
7. **Push** to your branch (`git push origin feature/amazing-feature`)
8. **Submit** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Follow existing code style and conventions
- Update documentation for new features
- Ensure responsive design principles

### Code Review Process
1. All submissions require review
2. Automated tests must pass
3. Code coverage should not decrease
4. Follow security best practices

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed  
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided

## 🆘 Support & Help

### Getting Help
- 📧 **Email**: support@dhakabus.com
- 🐛 **Bug Reports**: [Create an Issue](https://github.com/raihanulislam00/Dhaka_Bus_Service/issues)
- 💡 **Feature Requests**: [Feature Request Template](https://github.com/raihanulislam00/Dhaka_Bus_Service/issues/new?template=feature_request.md)
- 📖 **Documentation**: [Wiki](https://github.com/raihanulislam00/Dhaka_Bus_Service/wiki)

### Community
- 💬 **Discussions**: [GitHub Discussions](https://github.com/raihanulislam00/Dhaka_Bus_Service/discussions)
- 📱 **Discord**: [Join our Discord](https://discord.gg/dhakabus)
- 🐦 **Twitter**: [@DhakaBusService](https://twitter.com/dhakabus)

### Frequently Asked Questions

**Q: How do I reset my password?**
A: Use the "Forgot Password" link on the login page.

**Q: Can I book tickets for multiple passengers?**
A: Yes, you can book multiple seats in a single transaction.

**Q: How do I become a driver?**
A: Register as a driver and wait for admin approval after document verification.

**Q: Is the system available 24/7?**
A: Yes, the booking system is available round the clock.

## 🙏 Acknowledgments

- **NestJS Team** - For the amazing backend framework
- **Next.js Team** - For the powerful React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **TypeORM** - For the excellent ORM solution
- **All Contributors** - Thank you for your valuable contributions!

---

<div align="center">

**Made with ❤️ by the Dhaka Bus Service Team**

[⬆ Back to Top](#-dhaka-bus-service)

</div>