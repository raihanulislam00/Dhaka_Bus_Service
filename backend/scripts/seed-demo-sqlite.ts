import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seedDemoData() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    console.log('🌱 Seeding demo data for Dhaka Bus Service...');
    
    // Pre-hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const passengerPassword = await bcrypt.hash('passenger123', 10);
    const driverPassword = await bcrypt.hash('driver123', 10);
    
    // 👤 Create demo admin
    console.log('👤 Creating demo admin...');
    await dataSource.query(`
      INSERT OR REPLACE INTO admin (username, name, mail, country, password, joiningDate)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `, [
      'admin',
      'System Administrator', 
      'admin@dhakabus.com',
      'Bangladesh',
      adminPassword
    ]);
    
    // 🚶‍♂️ Create demo passengers
    console.log('🚶‍♂️ Creating demo passengers...');
    const passengers = [
      ['passenger1', 'Ahmed Rahman', 'ahmed@example.com', '01711111111', 'Dhanmondi, Dhaka'],
      ['passenger2', 'Fatima Khatun', 'fatima@example.com', '01722222222', 'Gulshan, Dhaka'],
      ['testpassenger', 'Test User', 'test@example.com', '01733333333', 'Uttara, Dhaka']
    ];
    
    for (const [username, fullName, mail, phone, address] of passengers) {
      await dataSource.query(`
        INSERT OR REPLACE INTO passengers (username, fullName, mail, phone, address, password, isActive, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))
      `, [username, fullName, mail, phone, address, passengerPassword]);
    }
    
    // 🚗 Create demo drivers
    console.log('🚗 Creating demo drivers...');
    const drivers = [
      ['driver1', 'Mohammad Ali', 'ali@example.com', '01744444444', 'DH-123456', 35],
      ['driver2', 'Karim Uddin', 'karim@example.com', '01755555555', 'DH-789012', 42],
      ['testdriver', 'Test Driver', 'testdriver@example.com', '01766666666', 'DH-345678', 38]
    ];
    
    for (const [username, fullName, email, phone, licenseNumber, age] of drivers) {
      await dataSource.query(`
        INSERT OR REPLACE INTO drivers (username, fullName, email, phone, licenseNumber, age, password, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
      `, [username, fullName, email, phone, licenseNumber, age, driverPassword]);
    }
    
    // 🛣️ Create demo routes
    console.log('🛣️ Creating demo routes...');
    const routes = [
      ['Dhaka to Chittagong', 'Kamalapur', 'Chittagong Central', 300.50, '6 hours'],
      ['Dhaka to Sylhet', 'Mohakhali', 'Sylhet Central', 250.75, '4.5 hours'],  
      ['Dhaka to Rajshahi', 'Gabtoli', 'Rajshahi Terminal', 280.00, '5 hours'],
      ['Dhaka to Cox\'s Bazar', 'Sayedabad', 'Cox\'s Bazar Station', 450.25, '8 hours']
    ];
    
    const routeIds: number[] = [];
    for (const [name, source, destination, ticketPrice, duration] of routes) {
      const result = await dataSource.query(`
        INSERT OR REPLACE INTO routes (routeName, source, destination, ticketPrice, duration, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `, [name, source, destination, ticketPrice, duration]);
      
      // Get the inserted route ID for schedules
      const [route] = await dataSource.query(`SELECT id FROM routes WHERE routeName = ?`, [name]);
      routeIds.push(route.id);
    }
    
    // 📅 Create demo schedules
    console.log('📅 Creating demo schedules...');
    for (const routeId of routeIds) {
      const schedules = [
        ['06:00:00', '12:00:00', 40],
        ['14:00:00', '20:00:00', 40], 
        ['22:00:00', '04:00:00', 40]
      ];
      
      for (const [departureTime, arrivalTime, totalSeats] of schedules) {
        await dataSource.query(`
          INSERT OR REPLACE INTO schedules (routeId, departureTime, arrivalTime, totalSeats, availableSeats, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [routeId, departureTime, arrivalTime, totalSeats, totalSeats]);
      }
    }
    
    console.log('✅ Demo data seeded successfully!');
    console.log('');
    console.log('🔐 Demo Login Credentials:');
    console.log('');
    console.log('👑 Admin:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('🚶‍♂️ Passengers:');
    console.log('   Username: passenger1, Password: passenger123');
    console.log('   Username: passenger2, Password: passenger123');
    console.log('   Username: testpassenger, Password: passenger123');
    console.log('');
    console.log('🚗 Drivers:');
    console.log('   Username: driver1, Password: driver123');
    console.log('   Username: driver2, Password: driver123');
    console.log('   Username: testdriver, Password: driver123');
    console.log('');
    console.log('🛣️ Available Routes:');
    console.log('   • Dhaka to Chittagong (৳300.50)');
    console.log('   • Dhaka to Sylhet (৳250.75)');
    console.log('   • Dhaka to Rajshahi (৳280.00)');
    console.log('   • Dhaka to Cox\'s Bazar (৳450.25)');
    console.log('');
    console.log('⏰ Schedule Times: 6:00 AM, 2:00 PM, 10:00 PM');
    console.log('🎫 Each schedule has 40 total seats');
    
  } catch (error) {
    console.error('❌ Demo seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seedDemoData().then(() => {
  console.log('🎉 Seeding complete! You can now test the application.');
  process.exit(0);
}).catch(error => {
  console.error('💥 Seeding failed:', error);
  process.exit(1);
});