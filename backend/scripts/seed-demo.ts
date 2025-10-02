import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PassengerService } from '../src/passenger/passenger.service';
import { DriverService } from '../src/driver/driver.service';
import { AdminService } from '../src/admin/admin.service';
import { RouteService } from '../src/admin/services/route.service';
import { ScheduleService } from '../src/admin/services/schedule.service';
import { CreatePassengerDto } from '../src/passenger/dto/createPassenger.dto';
import { CreateDriverDto } from '../src/driver/create-driver.dto';
import { CreateAdminDto } from '../src/admin/dto/createAdmin.dto';
import { CreateRouteDto } from '../src/admin/dto/create-route.dto';
import { CreateScheduleDto } from '../src/admin/dto/create-schedule.dto';
import { RouteEntity } from '../src/admin/entities/route.entity';

async function seedDemoData() {
  console.log('🌱 Seeding demo data for Dhaka Bus Service...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const passengerService = app.get(PassengerService);
    const driverService = app.get(DriverService);
    const adminService = app.get(AdminService);
    const routeService = app.get(RouteService);
    const scheduleService = app.get(ScheduleService);

    // 1. Create Demo Admin
    console.log('👤 Creating demo admin...');
    try {
      const adminData: CreateAdminDto = {
        username: 'admin',
        name: 'System Administrator',
        mail: 'admin@dhakabus.com',
        password: 'admin123@',
        socialMediaLink: 'https://linkedin.com/admin',
        country: 'Bangladesh',
      };
      
      await adminService.create(adminData);
      console.log('✅ Admin created: username=admin, password=admin123');
    } catch (error) {
      if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        console.log('ℹ️ Admin already exists');
      } else {
        console.log('⚠️ Admin creation failed:', error.message);
      }
    }

    // 2. Create Demo Passengers
    console.log('👥 Creating demo passengers...');
    const passengers = [
      {
        username: 'passenger1',
        fullName: 'Rahul Ahmed',
        mail: 'rahul@example.com',
        phone: '01711111111',
        address: 'Dhanmondi, Dhaka',
        gender: 'male',
        password: 'passenger123',
      },
      {
        username: 'passenger2', 
        fullName: 'Fatima Khan',
        mail: 'fatima@example.com',
        phone: '01722222222',
        address: 'Gulshan, Dhaka',
        gender: 'female',
        password: 'passenger123',
      },
      {
        username: 'testpassenger',
        fullName: 'Test Passenger',
        mail: 'test@passenger.com',
        phone: '01733333333',
        address: 'Uttara, Dhaka',
        gender: 'male',
        password: 'test123',
      }
    ];

    for (const passengerData of passengers) {
      try {
        await passengerService.create(passengerData);
        console.log(`✅ Passenger created: username=${passengerData.username}, password=${passengerData.password}`);
      } catch (error) {
        if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
          console.log(`ℹ️ Passenger ${passengerData.username} already exists`);
        } else {
          console.log(`⚠️ Passenger ${passengerData.username} creation failed:`, error.message);
        }
      }
    }

    // 3. Create Demo Drivers
    console.log('🚛 Creating demo drivers...');
    const drivers = [
      {
        username: 'driver1',
        fullName: 'Md. Karim Uddin',
        email: 'karim@driver.com',
        phone: '01744444444',
        password: 'driver123',
        licenseNumber: 'DL123456789',
        age: 39,
      },
      {
        username: 'driver2',
        fullName: 'Abdul Rahman',
        email: 'rahman@driver.com', 
        phone: '01755555555',
        password: 'driver123',
        licenseNumber: 'DL987654321',
        age: 43,
      },
      {
        username: 'testdriver',
        fullName: 'Test Driver',
        email: 'test@driver.com',
        phone: '01766666666',
        password: 'test123',
        licenseNumber: 'DL111222333',
        age: 35,
      }
    ];

    for (const driverData of drivers) {
      try {
        await driverService.createDriver(driverData);
        console.log(`✅ Driver created: username=${driverData.username}, password=${driverData.password}`);
      } catch (error) {
        if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
          console.log(`ℹ️ Driver ${driverData.username} already exists`);
        } else {
          console.log(`⚠️ Driver ${driverData.username} creation failed:`, error.message);
        }
      }
    }

    // 4. Create Demo Routes
    console.log('🛣️ Creating demo routes...');
    const routes: CreateRouteDto[] = [
      {
        name: 'Dhaka-Chittagong Express',
        startLocation: 'Dhaka',
        endLocation: 'Chittagong', 
        distance: 264,
        estimatedDuration: 390, // 6.5 hours in minutes
        fare: 450,
        description: 'Express service with AC and entertainment system',
        stops: 'Dhaka, Comilla, Chittagong',
        isActive: true,
      },
      {
        name: 'Dhaka-Sylhet Deluxe',
        startLocation: 'Dhaka',
        endLocation: 'Sylhet',
        distance: 247,
        estimatedDuration: 375, // 6.25 hours in minutes
        fare: 420,
        description: 'Deluxe service with comfortable seating',
        stops: 'Dhaka, Narsingdi, Bhairab, Sylhet',
        isActive: true,
      },
      {
        name: 'Dhaka-Cox\'s Bazar Beach Express',
        startLocation: 'Dhaka',
        endLocation: 'Cox\'s Bazar',
        distance: 414,
        estimatedDuration: 480, // 8 hours in minutes
        fare: 650,
        description: 'Direct service to the world\'s longest sea beach',
        stops: 'Dhaka, Comilla, Chittagong, Cox\'s Bazar',
        isActive: true,
      },
      {
        name: 'Dhaka-Rangpur Northern Express',
        startLocation: 'Dhaka',
        endLocation: 'Rangpur',
        distance: 303,
        estimatedDuration: 420, // 7 hours in minutes  
        fare: 500,
        description: 'Northern route with scenic views',
        stops: 'Dhaka, Tangail, Bogura, Rangpur',
        isActive: true,
      }
    ];

    const createdRoutes: RouteEntity[] = [];
    for (const routeData of routes) {
      try {
        const route = await routeService.create(routeData);
        createdRoutes.push(route);
        console.log(`✅ Route created: ${routeData.name} (৳${routeData.fare})`);
      } catch (error) {
        if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
          console.log(`ℹ️ Route ${routeData.name} already exists`);
          // Try to find existing route
          try {
            const existingRoutes = await routeService.findAll();
            const existingRoute = existingRoutes.find(r => r.name === routeData.name);
            if (existingRoute) {
              createdRoutes.push(existingRoute);
            }
          } catch (findError) {
            console.log('Could not find existing route');
          }
        } else {
          console.log(`⚠️ Route ${routeData.name} creation failed:`, error.message);
        }
      }
    }

    // 5. Create Demo Schedules
    console.log('📅 Creating demo schedules...');
    let scheduleCount = 0;
    
    for (const route of createdRoutes) {
      if (!route) continue;
      
      const schedules: CreateScheduleDto[] = [
        {
          routeId: route.id,
          busNumber: `DH-${Math.floor(Math.random() * 9000) + 1000}`,
          departureTime: '08:00',
          arrivalTime: '14:30',
          dayOfWeek: 'Monday',
          totalSeats: 40,
          notes: 'Morning departure - Express service',
        },
        {
          routeId: route.id,
          busNumber: `DH-${Math.floor(Math.random() * 9000) + 1000}`,
          departureTime: '15:00',
          arrivalTime: '21:30',
          dayOfWeek: 'Tuesday',
          totalSeats: 40,
          notes: 'Evening departure - Regular service',
        },
        {
          routeId: route.id,
          busNumber: `DH-${Math.floor(Math.random() * 9000) + 1000}`,
          departureTime: '22:00',
          arrivalTime: '05:00',
          dayOfWeek: 'Wednesday',
          totalSeats: 35,
          notes: 'Night departure - Sleeper service',
        }
      ];

      for (const scheduleData of schedules) {
        try {
          await scheduleService.create(scheduleData);
          scheduleCount++;
          console.log(`✅ Schedule created: Bus ${scheduleData.busNumber} - ${scheduleData.departureTime}`);
        } catch (error) {
          console.log(`⚠️ Schedule creation failed for bus ${scheduleData.busNumber}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Demo data seeding completed successfully!');
    console.log('\n📋 DEMO CREDENTIALS FOR TESTING:');
    console.log('\n👤 ADMIN CREDENTIALS:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@dhakabus.com');
    
    console.log('\n👥 PASSENGER CREDENTIALS:');
    console.log('   Username: passenger1 | Password: passenger123 | Name: Rahul Ahmed');
    console.log('   Username: passenger2 | Password: passenger123 | Name: Fatima Khan');
    console.log('   Username: testpassenger | Password: test123 | Name: Test Passenger');
    
    console.log('\n🚛 DRIVER CREDENTIALS:');
    console.log('   Username: driver1 | Password: driver123 | Name: Md. Karim Uddin');
    console.log('   Username: driver2 | Password: driver123 | Name: Abdul Rahman');
    console.log('   Username: testdriver | Password: test123 | Name: Test Driver');
    
    console.log('\n📊 SEEDED DATA SUMMARY:');
    console.log(`   • ${routes.length} Routes created`);
    console.log(`   • ${scheduleCount} Schedules created`);
    console.log(`   • 3 Passengers created`);
    console.log(`   • 3 Drivers created`);
    console.log(`   • 1 Admin created`);
    
    console.log('\n🌐 ACCESS URLS:');
    console.log('   Frontend: http://localhost:8000 (dev) or https://your-vercel-url.com (prod)');
    console.log('   Backend: http://localhost:3000 (dev) or https://your-railway-url.com (prod)');
    
    console.log('\n🔗 QUICK TEST FLOW:');
    console.log('   1. Login as admin → Create/manage routes and schedules');
    console.log('   2. Login as passenger → Book tickets (up to 4 seats)');
    console.log('   3. Login as driver → View assigned schedules and routes');

  } catch (error) {
    console.error('❌ Demo seeding failed:', error);
  } finally {
    await app.close();
  }
}

// Run the seeding
seedDemoData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});