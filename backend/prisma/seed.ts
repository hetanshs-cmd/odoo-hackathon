import { PrismaClient, VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing data in correct dependency order
  await prisma.auditLog.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.organizationSettings.deleteMany();

  // 2. Organization Settings
  const org = await prisma.organizationSettings.create({
    data: {
      organizationName: 'TransitOps Logistics Ltd',
      timezone: 'UTC',
      currency: 'USD',
    },
  });
  console.log('Created organization settings:', org.organizationName);

  // 3. Permissions
  const permissionsData = [
    { name: 'read:users', description: 'Can read user data' },
    { name: 'write:users', description: 'Can create and modify users' },
    { name: 'read:vehicles', description: 'Can read vehicle logs' },
    { name: 'write:vehicles', description: 'Can manage vehicle registry' },
    { name: 'read:trips', description: 'Can view dispatches' },
    { name: 'write:trips', description: 'Can create and update dispatches' },
    { name: 'read:expenses', description: 'Can view financial transactions' },
    { name: 'write:expenses', description: 'Can record expenses and fuel' },
  ];

  const permissions: Record<string, any> = {};
  for (const perm of permissionsData) {
    permissions[perm.name] = await prisma.permission.create({ data: perm });
  }
  console.log(`Created ${Object.keys(permissions).length} permissions`);

  // 4. Roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      description: 'System Administrator with full access',
    },
  });

  const dispatcherRole = await prisma.role.create({
    data: {
      name: 'Dispatcher',
      description: 'Fleet manager responsible for trips and vehicles',
    },
  });

  const driverRole = await prisma.role.create({
    data: {
      name: 'Driver',
      description: 'Vehicle operators who log runs and fuel',
    },
  });
  console.log('Created Roles: Admin, Dispatcher, Driver');

  // 5. Role Permissions
  // Admin gets all permissions
  for (const perm of Object.values(permissions)) {
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Dispatcher gets subset
  const dispatcherPerms = ['read:users', 'read:vehicles', 'write:vehicles', 'read:trips', 'write:trips'];
  for (const name of dispatcherPerms) {
    await prisma.rolePermission.create({
      data: {
        roleId: dispatcherRole.id,
        permissionId: permissions[name].id,
      },
    });
  }
  console.log('Configured Role-Permission RBAC mapping');

  // 6. Users (Admin and Dispatcher)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Transit Admin',
      email: 'admin@transitops.com',
      passwordHash: '$2b$12$K1.L1u6MshX8hD3iCbeCneWq9d5HhW2eR5k9/G1J53j4S0w1.764G', // mock bcrypt hash
      roleId: adminRole.id,
    },
  });

  const dispatcherUser = await prisma.user.create({
    data: {
      name: 'Jane Dispatcher',
      email: 'jane@transitops.com',
      passwordHash: '$2b$12$K1.L1u6MshX8hD3iCbeCneWq9d5HhW2eR5k9/G1J53j4S0w1.764G',
      roleId: dispatcherRole.id,
    },
  });
  console.log('Created admin and dispatcher users');

  // 7. Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'TX-908-FL',
      nameModel: 'Volvo FH16 Semi-Truck',
      type: 'Heavy Duty Truck',
      maxLoadCapacity: 25000.00,
      odometer: 125000.00,
      acquisitionCost: 145000.00,
      status: VehicleStatus.AVAILABLE,
      currentLat: 34.052234,
      currentLng: -118.243684,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'CA-102-VAN',
      nameModel: 'Ford Transit Cargo Van',
      type: 'Cargo Van',
      maxLoadCapacity: 3500.00,
      odometer: 45000.00,
      acquisitionCost: 38000.00,
      status: VehicleStatus.IN_SHOP,
      currentLat: 37.774929,
      currentLng: -122.419416,
    },
  });
  console.log('Created vehicles');

  // 8. Drivers (with corresponding User accounts)
  const driverUser1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@transitops.com',
      passwordHash: '$2b$12$K1.L1u6MshX8hD3iCbeCneWq9d5HhW2eR5k9/G1J53j4S0w1.764G',
      roleId: driverRole.id,
    },
  });

  const driver1 = await prisma.driver.create({
    data: {
      userId: driverUser1.id,
      licenseNumber: 'DL-9876543-A',
      status: DriverStatus.AVAILABLE,
    },
  });
  console.log('Created drivers and linked user accounts');

  // 9. Trips
  const trip1 = await prisma.trip.create({
    data: {
      source: 'Warehouse A (Los Angeles)',
      destination: 'Distribution Center B (Phoenix)',
      sourceLat: 34.0522,
      sourceLng: -118.2437,
      destLat: 33.4484,
      destLng: -112.0740,
      vehicleId: vehicle1.id,
      driverId: driver1.id,
      cargoWeight: 18500.00,
      plannedDistance: 370.00,
      status: TripStatus.DRAFT,
      createdBy: dispatcherUser.id,
    },
  });
  console.log('Created sample trips');

  // 10. Maintenance Records
  await prisma.maintenanceRecord.create({
    data: {
      vehicleId: vehicle2.id,
      description: 'Scheduled 45,000 mile brake replacement and engine oil service.',
      cost: 450.00,
      status: MaintenanceStatus.ACTIVE,
      startedAt: new Date(),
    },
  });
  console.log('Created maintenance records');

  // 11. Fuel Logs
  await prisma.fuelLog.create({
    data: {
      vehicleId: vehicle1.id,
      driverId: driver1.id,
      fuelQuantity: 120.50,
      cost: 480.00,
      odometer: 125120.00,
      loggedAt: new Date(),
    },
  });
  console.log('Created fuel logs');

  // 12. Expenses
  await prisma.expense.create({
    data: {
      vehicleId: vehicle1.id,
      driverId: driver1.id,
      amount: 45.00,
      category: 'Tolls',
      description: 'Interstate highway toll charges',
      incurredAt: new Date(),
    },
  });
  console.log('Created expenses');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
