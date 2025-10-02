import { DataSource } from 'typeorm';
import { Driver } from '../src/driver/entities/driver';
import { Passenger } from '../src/passenger/entities/passenger.entities';
import { Ticket } from '../src/passenger/entities/ticket.entity';
import { AdminEntity } from '../src/admin/entities/admin.entity';
import { RouteEntity } from '../src/admin/entities/route.entity';
import { ScheduleEntity } from '../src/admin/entities/schedule.entity';

// PostgreSQL configuration
const postgresConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'dhaka_bus_service',
  entities: [Driver, Passenger, Ticket, AdminEntity, RouteEntity, ScheduleEntity],
  synchronize: true,
  logging: true,
});

// SQLite configuration (source)
const sqliteConfig = new DataSource({
  type: 'sqlite',
  database: './dhaka_bus_service.sqlite',
  entities: [Driver, Passenger, Ticket, AdminEntity, RouteEntity, ScheduleEntity],
  synchronize: false,
  logging: true,
});

async function migrateFromSQLiteToPostgreSQL() {
  console.log('🔄 Starting migration from SQLite to PostgreSQL...');

  try {
    // Initialize connections
    await sqliteConfig.initialize();
    console.log('✅ Connected to SQLite database');
    
    await postgresConfig.initialize();
    console.log('✅ Connected to PostgreSQL database');

    // Get repositories
    const sqliteAdminRepo = sqliteConfig.getRepository(AdminEntity);
    const postgresAdminRepo = postgresConfig.getRepository(AdminEntity);

    const sqliteRouteRepo = sqliteConfig.getRepository(RouteEntity);
    const postgresRouteRepo = postgresConfig.getRepository(RouteEntity);

    const sqliteScheduleRepo = sqliteConfig.getRepository(ScheduleEntity);
    const postgresScheduleRepo = postgresConfig.getRepository(ScheduleEntity);

    const sqliteDriverRepo = sqliteConfig.getRepository(Driver);
    const postgresDriverRepo = postgresConfig.getRepository(Driver);

    const sqlitePassengerRepo = sqliteConfig.getRepository(Passenger);
    const postgresPassengerRepo = postgresConfig.getRepository(Passenger);

    const sqliteTicketRepo = sqliteConfig.getRepository(Ticket);
    const postgresTicketRepo = postgresConfig.getRepository(Ticket);

    // Migrate Admins
    console.log('📊 Migrating Admins...');
    const admins = await sqliteAdminRepo.find();
    for (const admin of admins) {
      // Remove the ID to let PostgreSQL generate new ones
      const { id, ...adminData } = admin;
      await postgresAdminRepo.save(adminData);
    }
    console.log(`✅ Migrated ${admins.length} admins`);

    // Migrate Routes
    console.log('📊 Migrating Routes...');
    const routes = await sqliteRouteRepo.find();
    const routeIdMap = new Map<number, number>();
    for (const route of routes) {
      const { id, ...routeData } = route;
      const savedRoute = await postgresRouteRepo.save(routeData);
      routeIdMap.set(id, savedRoute.id);
    }
    console.log(`✅ Migrated ${routes.length} routes`);

    // Migrate Schedules
    console.log('📊 Migrating Schedules...');
    const schedules = await sqliteScheduleRepo.find();
    const scheduleIdMap = new Map<number, number>();
    for (const schedule of schedules) {
      const { id, ...scheduleData } = schedule;
      // Update route ID reference
      if (scheduleData.routeId && routeIdMap.has(scheduleData.routeId)) {
        scheduleData.routeId = routeIdMap.get(scheduleData.routeId)!;
      }
      const savedSchedule = await postgresScheduleRepo.save(scheduleData);
      scheduleIdMap.set(id, savedSchedule.id);
    }
    console.log(`✅ Migrated ${schedules.length} schedules`);

    // Migrate Drivers
    console.log('📊 Migrating Drivers...');
    const drivers = await sqliteDriverRepo.find();
    const driverIdMap = new Map<number, number>();
    for (const driver of drivers) {
      const { id, ...driverData } = driver;
      const savedDriver = await postgresDriverRepo.save(driverData);
      driverIdMap.set(id, savedDriver.id);
    }
    console.log(`✅ Migrated ${drivers.length} drivers`);

    // Migrate Passengers
    console.log('📊 Migrating Passengers...');
    const passengers = await sqlitePassengerRepo.find();
    const passengerIdMap = new Map<number, number>();
    for (const passenger of passengers) {
      const { id, ...passengerData } = passenger;
      const savedPassenger = await postgresPassengerRepo.save(passengerData);
      passengerIdMap.set(id, savedPassenger.id);
    }
    console.log(`✅ Migrated ${passengers.length} passengers`);

    // Migrate Tickets
    console.log('📊 Migrating Tickets...');
    const tickets = await sqliteTicketRepo.find({ relations: ['passenger'] });
    for (const ticket of tickets) {
      const { id, passenger, ...ticketData } = ticket;
      // Update schedule ID reference
      if (ticketData.scheduleId && scheduleIdMap.has(ticketData.scheduleId)) {
        ticketData.scheduleId = scheduleIdMap.get(ticketData.scheduleId)!;
      }
      // Update passenger reference
      if (passenger && passengerIdMap.has(passenger.id)) {
        const newPassenger = await postgresPassengerRepo.findOne({
          where: { id: passengerIdMap.get(passenger.id)! }
        });
        if (newPassenger) {
          await postgresTicketRepo.save({
            ...ticketData,
            passenger: newPassenger
          });
        }
      }
    }
    console.log(`✅ Migrated ${tickets.length} tickets`);

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close connections
    if (sqliteConfig.isInitialized) {
      await sqliteConfig.destroy();
    }
    if (postgresConfig.isInitialized) {
      await postgresConfig.destroy();
    }
  }
}

async function seedPostgreSQLDatabase() {
  console.log('🌱 Seeding PostgreSQL database...');

  try {
    await postgresConfig.initialize();
    console.log('✅ Connected to PostgreSQL database');

    // Seed Admin
    const adminRepo = postgresConfig.getRepository(AdminEntity);
    const existingAdmin = await adminRepo.findOne({ where: { username: 'admin' } });
    
    if (!existingAdmin) {
      const admin = adminRepo.create({
        username: 'admin',
        name: 'System Administrator',
        mail: 'admin@dhakabus.com',
        country: 'Bangladesh',
        password: 'admin123@', // Will be hashed by the entity
        socialMediaLink: 'https://linkedin.com/admin',
      });
      await adminRepo.save(admin);
      console.log('✅ Created admin user');
    }

    // Seed Routes
    const routeRepo = postgresConfig.getRepository(RouteEntity);
    const existingRoutes = await routeRepo.count();
    
    if (existingRoutes === 0) {
      const routes = [
        {
          name: 'Dhaka-Chittagong Express',
          startLocation: 'Dhaka',
          endLocation: 'Chittagong',
          distance: 264,
          estimatedDuration: 390, // 6.5 hours in minutes
          fare: 450,
          description: 'Express service with AC and entertainment',
          stops: 'Dhaka, Cumilla, Chittagong',
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
          description: 'Direct service to the longest sea beach',
          stops: 'Dhaka, Cumilla, Chittagong, Cox\'s Bazar',
          isActive: true,
        }
      ];

      for (const routeData of routes) {
        const route = routeRepo.create(routeData);
        await routeRepo.save(route);
      }
      console.log(`✅ Created ${routes.length} routes`);
    }

    // Seed Schedules
    const scheduleRepo = postgresConfig.getRepository(ScheduleEntity);
    const existingSchedules = await scheduleRepo.count();
    
    if (existingSchedules === 0) {
      const routes = await routeRepo.find();
      const schedules: Partial<ScheduleEntity>[] = [];

      for (const route of routes) {
        // Create morning and evening schedules for each route
        schedules.push({
          routeId: route.id,
          busNumber: `${route.startLocation.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
          departureTime: '08:00',
          arrivalTime: route.estimatedDuration > 400 ? '16:00' : '14:00',
          dayOfWeek: 'daily',
          totalSeats: 40,
          availableSeats: 40,
          isActive: true,
          notes: 'Morning departure',
        });

        schedules.push({
          routeId: route.id,
          busNumber: `${route.startLocation.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
          departureTime: '15:00',
          arrivalTime: route.estimatedDuration > 400 ? '23:00' : '21:00',
          dayOfWeek: 'daily',
          totalSeats: 40,
          availableSeats: 40,
          isActive: true,
          notes: 'Evening departure',
        });
      }

      for (const scheduleData of schedules) {
        const schedule = scheduleRepo.create(scheduleData);
        await scheduleRepo.save(schedule);
      }
      console.log(`✅ Created ${schedules.length} schedules`);
    }

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    if (postgresConfig.isInitialized) {
      await postgresConfig.destroy();
    }
  }
}

// Command line arguments handling
const command = process.argv[2];

if (command === 'migrate') {
  migrateFromSQLiteToPostgreSQL();
} else if (command === 'seed') {
  seedPostgreSQLDatabase();
} else {
  console.log('Usage:');
  console.log('  npm run migrate:sqlite-to-postgres  # Migrate existing SQLite data to PostgreSQL');
  console.log('  npm run seed:postgres              # Seed PostgreSQL with initial data');
}