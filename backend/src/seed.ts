import { PrismaClient, VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with sample records...');

  // 1. Create Role
  const role = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrator role',
    },
  });
  console.log(`Role created: ${role.name}`);

  // 2. Create User
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'admin@transitops.com' },
    update: {},
    create: {
      email: 'admin@transitops.com',
      name: 'Admin User',
      passwordHash,
      roleId: role.id,
      isActive: true,
      emailVerified: true,
    },
  });
  console.log(`User created: ${user.email}`);

  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@transitops.com' },
    update: {},
    create: {
      email: 'driver@transitops.com',
      name: 'Sample Driver',
      passwordHash,
      roleId: role.id, // using same role for simplicity in seed
      isActive: true,
    },
  });
  console.log(`Driver user created: ${driverUser.email}`);

  // 3. Create Region
  const region = await prisma.region.upsert({
    where: { name: 'North America' },
    update: {},
    create: {
      name: 'North America',
      centerLat: 40.7128,
      centerLng: -74.0060,
    },
  });
  console.log(`Region created: ${region.name}`);

  // 4. Create Driver
  const driver = await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: {},
    create: {
      userId: driverUser.id,
      licenseNumber: 'LIC-2024-ABC',
      licenseCategory: 'HEAVY',
      licenseExpiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year from now
      contactNumber: '+1987654321',
      status: DriverStatus.AVAILABLE,
      regionId: region.id,
    },
  });
  console.log(`Driver created: ${driver.licenseNumber}`);

  // 5. Create Vehicle
  const vehicle = await prisma.vehicle.upsert({
    where: { registrationNumber: 'XYZ-1234' },
    update: {},
    create: {
      registrationNumber: 'XYZ-1234',
      nameModel: 'Volvo FH16',
      type: 'TRUCK',
      maxLoadCapacity: 20000,
      odometer: 10500,
      acquisitionCost: 120000,
      status: VehicleStatus.AVAILABLE,
      regionId: region.id,
    },
  });
  console.log(`Vehicle created: ${vehicle.registrationNumber}`);

  // 6. Create Trip
  const trip = await prisma.trip.create({
    data: {
      vehicleId: vehicle.id,
      driverId: driver.id,
      regionId: region.id,
      source: 'New York',
      destination: 'Boston',
      status: TripStatus.SCHEDULED,
      plannedDistance: 215.5,
      cargoWeight: 15000,
      revenue: 500.00,
      createdBy: user.id,
    },
  });
  console.log(`Trip created: ID ${trip.id}`);

  // 7. Create Maintenance Record
  const maintenance = await prisma.maintenanceRecord.create({
    data: {
      vehicleId: vehicle.id,
      description: 'Replace brake pads',
      cost: 150.75,
      status: MaintenanceStatus.ACTIVE,
    },
  });
  console.log(`Maintenance created: ID ${maintenance.id}`);

  // 8. Create Fuel Log
  const fuelLog = await prisma.fuelLog.create({
    data: {
      vehicleId: vehicle.id,
      driverId: driver.id,
      tripId: trip.id,
      fuelQuantity: 45.5,
      cost: 180.00,
      odometer: 10550,
    },
  });
  console.log(`Fuel Log created: ID ${fuelLog.id}`);

  // 9. Create Expense
  const expense = await prisma.expense.create({
    data: {
      vehicleId: vehicle.id,
      driverId: driver.id,
      category: 'TOLL',
      amount: 15.00,
      description: 'Highway toll charge',
    },
  });
  console.log(`Expense created: ID ${expense.id}`);

  // 10. Create Settings
  const settings = await prisma.organizationSettings.findFirst();
  if (!settings) {
    await prisma.organizationSettings.create({
      data: {
        organizationName: 'TransitOps Default Org',
        timezone: 'America/New_York',
        currency: 'USD',
      },
    });
    console.log(`Organization settings created.`);
  } else {
    console.log(`Organization settings already exist.`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
