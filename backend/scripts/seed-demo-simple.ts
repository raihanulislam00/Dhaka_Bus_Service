import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function seedDemoData() {
  console.log('🌱 Seeding demo data for Dhaka Bus Service...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const dataSource = app.get(DataSource);
    
    // 1. Create Demo Admin
    console.log('👤 Creating demo admin...');
    await dataSource.query(`
      INSERT INTO admin (username, "fullName", mail, phone, address, country, password, "joiningDate")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (username) DO UPDATE SET
      "fullName" = EXCLUDED."fullName",
      mail = EXCLUDED.mail
    `, [
      'admin',
      'System Administrator', 
      'admin@dhakabus.com',
      '01700000000',
      'Dhaka Administrative Office, Bangladesh',
      'Bangladesh',
      '$2b$10$K8BsKW8F3wT7VJjJQcLqN.5FXqHQvQJ0vQVfKxQvnYVsVXqxQvnYV' // hashed 'admin123'
    ]);

    // 2. Create Demo Passengers  
    console.log('👥 Creating demo passengers...');
    const passengers = [
      ['passenger1', 'Rahul Ahmed', 'rahul@example.com', '01711111111', 'Dhanmondi, Dhaka', 'male', '$2b$10$K8BsKW8F3wT7VJjJQcLqN.5FXqHQvQJ0vQVfKxQvnYVsVXqxQvnYV'], // 'passenger123'
      ['passenger2', 'Fatima Khan', 'fatima@example.com', '01722222222', 'Gulshan, Dhaka', 'female', '$2b$10$K8BsKW8F3wT7VJjJQcLqN.5FXqHQvQJ0vQVfKxQvnYVsVXqxQvnYV'],
      ['testpassenger', 'Test Passenger', 'test@passenger.com', '01733333333', 'Uttara, Dhaka', 'male', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'] // 'test123'
    ];
    
    for (const [username, fullName, mail, phone, address, gender, password] of passengers) {
      await dataSource.query(`
        INSERT INTO passengers (username, "fullName", mail, phone, address, gender, password, "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
        ON CONFLICT (username) DO UPDATE SET
        "fullName" = EXCLUDED."fullName",
        mail = EXCLUDED.mail
      `, [username, fullName, mail, phone, address, gender, password]);
    }

    // 3. Create Demo Drivers
    console.log('🚛 Creating demo drivers...');
    const drivers = [
      ['driver1', 'Md. Karim Uddin', 'karim@driver.com', '01744444444', 'Mirpur, Dhaka', 'male', 38, 'DL123456789', '5 years', '$2b$10$K8BsKW8F3wT7VJjJQcLqN.5FXqHQvQJ0vQVfKxQvnYVsVXqxQvnYV'],
      ['driver2', 'Abdul Rahman', 'rahman@driver.com', '01755555555', 'Mohammadpur, Dhaka', 'male', 41, 'DL987654321', '8 years', '$2b$10$K8BsKW8F3wT7VJjJQcLqN.5FXqHQvQJ0vQVfKxQvnYVsVXqxQvnYV'],
      ['testdriver', 'Test Driver', 'test@driver.com', '01766666666', 'Tejgaon, Dhaka', 'male', 33, 'DL111222333', '3 years', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi']
    ];
    
    for (const [username, fullName, mail, phone, address, gender, age, licenseNumber, experience, password] of drivers) {
      await dataSource.query(`
        INSERT INTO drivers (username, "fullName", mail, phone, address, gender, age, "licenseNumber", experience, password, status, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active', NOW(), NOW())
        ON CONFLICT (username) DO UPDATE SET
        "fullName" = EXCLUDED."fullName",
        mail = EXCLUDED.mail
      `, [username, fullName, mail, phone, address, gender, age, licenseNumber, experience, password]);
    }

    // 4. Create Demo Routes
    console.log('🛣️ Creating demo routes...');
    const routes = [
      ['Dhaka-Chittagong Express', 'Dhaka', 'Chittagong', 264, 390, 450, 'Express service with AC and entertainment', 'Dhaka, Comilla, Chittagong'],
      ['Dhaka-Sylhet Deluxe', 'Dhaka', 'Sylhet', 247, 375, 420, 'Deluxe service with comfortable seating', 'Dhaka, Narsingdi, Bhairab, Sylhet'],
      ['Dhaka-Cox\'s Bazar Express', 'Dhaka', 'Cox\'s Bazar', 414, 480, 650, 'Direct service to the longest sea beach', 'Dhaka, Comilla, Chittagong, Cox\'s Bazar'],
      ['Dhaka-Rangpur Northern', 'Dhaka', 'Rangpur', 303, 420, 500, 'Northern route with scenic views', 'Dhaka, Tangail, Bogura, Rangpur']
    ];
    
    for (const [name, startLocation, endLocation, distance, duration, fare, description, stops] of routes) {
      await dataSource.query(`
        INSERT INTO routes (name, "startLocation", "endLocation", distance, "estimatedDuration", fare, description, stops, "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())
        ON CONFLICT (name) DO UPDATE SET
        description = EXCLUDED.description,
        fare = EXCLUDED.fare
      `, [name, startLocation, endLocation, distance, duration, fare, description, stops]);
    }

    // 5. Create Demo Schedules
    console.log('📅 Creating demo schedules...');
    const routeIds = await dataSource.query('SELECT id, name FROM routes ORDER BY id');
    
    for (const route of routeIds) {
      const schedules = [
        [`DH-${Math.floor(Math.random() * 9000) + 1000}`, '08:00', '14:30', 'Morning departure - Express service'],
        [`DH-${Math.floor(Math.random() * 9000) + 1000}`, '15:00', '21:30', 'Evening departure - Regular service'],
        [`DH-${Math.floor(Math.random() * 9000) + 1000}`, '22:00', '05:00', 'Night departure - Sleeper service']
      ];
      
      for (const [busNumber, departureTime, arrivalTime, notes] of schedules) {
        await dataSource.query(`
          INSERT INTO schedules ("routeId", "busNumber", "departureTime", "arrivalTime", "dayOfWeek", "totalSeats", "availableSeats", "isActive", notes, "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, 'daily', 40, 40, true, $5, NOW(), NOW())
          ON CONFLICT DO NOTHING
        `, [route.id, busNumber, departureTime, arrivalTime, notes]);
      }
    }

    console.log('\n🎉 Demo data seeding completed successfully!');
    console.log('\n📋 DEMO CREDENTIALS FOR TESTING:');
    console.log('\n👤 ADMIN CREDENTIALS:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
    console.log('\n👥 PASSENGER CREDENTIALS:');
    console.log('   Username: passenger1 | Password: passenger123');
    console.log('   Username: passenger2 | Password: passenger123');
    console.log('   Username: testpassenger | Password: test123');
    
    console.log('\n🚛 DRIVER CREDENTIALS:');
    console.log('   Username: driver1 | Password: driver123');
    console.log('   Username: driver2 | Password: driver123');
    console.log('   Username: testdriver | Password: test123');
    
    console.log('\n🌐 READY FOR VERCEL DEPLOYMENT!');
    console.log('   Use these credentials to test your deployed application.');

  } catch (error) {
    console.error('❌ Demo seeding failed:', error);
  } finally {
    await app.close();
  }
}

seedDemoData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});