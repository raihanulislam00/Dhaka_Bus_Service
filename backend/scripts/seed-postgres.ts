import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Simple PostgreSQL seeding script
async function seedDatabase() {
  console.log('🌱 Seeding PostgreSQL database...');

  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'dhaka_bus_service',
    synchronize: true,
    logging: false,
    entities: ['src/**/*.entity{.ts,.js}'],
  });

  try {
    await AppDataSource.initialize();
    console.log('✅ Connected to PostgreSQL database');

    // Create Admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await AppDataSource.query(`
      INSERT INTO admin (username, "fullName", mail, phone, address, country, password, "joiningDate")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (username) DO NOTHING
    `, ['admin', 'System Administrator', 'admin@dhakabus.com', '01700000000', 'Dhaka, Bangladesh', 'Bangladesh', hashedPassword]);

    // Create Routes
    console.log('🛣️ Creating routes...');
    await AppDataSource.query(`
      INSERT INTO routes (name, "startLocation", "endLocation", distance, "estimatedDuration", fare, description, stops, "isActive", "createdAt", "updatedAt")
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()),
      ($10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW()),
      ($19, $20, $21, $22, $23, $24, $25, $26, $27, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
    `, [
      'Dhaka-Chittagong Express', 'Dhaka', 'Chittagong', 264, 390, 450, 'Express service with AC', 'Dhaka, Cumilla, Chittagong', true,
      'Dhaka-Sylhet Deluxe', 'Dhaka', 'Sylhet', 247, 375, 420, 'Deluxe service', 'Dhaka, Narsingdi, Bhairab, Sylhet', true,
      'Dhaka-Cox\'s Bazar Express', 'Dhaka', 'Cox\'s Bazar', 414, 480, 650, 'Beach express service', 'Dhaka, Cumilla, Chittagong, Cox\'s Bazar', true
    ]);

    // Get route IDs
    const routes = await AppDataSource.query('SELECT id, name FROM routes');
    console.log(`✅ Found ${routes.length} routes`);

    // Create Schedules
    console.log('📅 Creating schedules...');
    for (const route of routes) {
      // Morning schedule
      await AppDataSource.query(`
        INSERT INTO schedules ("routeId", "busNumber", "departureTime", "arrivalTime", "dayOfWeek", "totalSeats", "availableSeats", "isActive", notes, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [
        route.id,
        `DH-${Math.floor(Math.random() * 9000) + 1000}`,
        '08:00',
        '14:30',
        'daily',
        40,
        40,
        true,
        'Morning departure'
      ]);

      // Evening schedule
      await AppDataSource.query(`
        INSERT INTO schedules ("routeId", "busNumber", "departureTime", "arrivalTime", "dayOfWeek", "totalSeats", "availableSeats", "isActive", notes, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [
        route.id,
        `DH-${Math.floor(Math.random() * 9000) + 1000}`,
        '15:00',
        '21:30',
        'daily',
        40,
        40,
        true,
        'Evening departure'
      ]);
    }

    // Create sample passenger
    console.log('👥 Creating sample passenger...');
    const passengerPassword = await bcrypt.hash('passenger123', 10);
    await AppDataSource.query(`
      INSERT INTO passengers (username, "fullName", mail, phone, address, gender, password, "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      ON CONFLICT (username) DO NOTHING
    `, ['testpassenger', 'Test Passenger', 'passenger@test.com', '01700000001', 'Dhaka, Bangladesh', 'male', passengerPassword, true]);

    console.log('🎉 Database seeding completed successfully!');
    console.log('📝 Login credentials:');
    console.log('   Admin: username=admin, password=admin123');
    console.log('   Passenger: username=testpassenger, password=passenger123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seedDatabase();