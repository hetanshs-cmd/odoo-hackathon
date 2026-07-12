import {
  PrismaClient,
  TripStatus,
  VehicleStatus,
  DriverStatus,
  MaintenanceStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {
  async getStats() {
    const totalVehicles = await prisma.vehicle.count();
    const activeVehicles = await prisma.vehicle.count({
      where: { status: VehicleStatus.AVAILABLE },
    }); // active meaning available or maybe in use
    const onTripVehicles = await prisma.vehicle.count({ where: { status: VehicleStatus.ON_TRIP } });

    const totalDrivers = await prisma.driver.count();
    const availableDrivers = await prisma.driver.count({
      where: { status: DriverStatus.AVAILABLE },
    });
    const onTripDrivers = await prisma.driver.count({ where: { status: DriverStatus.ON_TRIP } });

    const totalActiveTrips = await prisma.trip.count({
      where: { status: TripStatus.IN_PROGRESS },
    });
    const completedTrips = await prisma.trip.count({
      where: { status: TripStatus.COMPLETED },
    });

    const activeMaintenance = await prisma.maintenanceRecord.count({
      where: { status: MaintenanceStatus.ACTIVE },
    });

    return {
      vehicles: {
        total: totalVehicles,
        available: activeVehicles,
        onTrip: onTripVehicles,
      },
      drivers: {
        total: totalDrivers,
        available: availableDrivers,
        onTrip: onTripDrivers,
      },
      trips: {
        active: totalActiveTrips,
        completed: completedTrips,
      },
      maintenance: {
        active: activeMaintenance,
      },
    };
  }
}

export const dashboardService = new DashboardService();
