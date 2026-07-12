import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportsService {
  async getRevenueReport(startDate?: Date, endDate?: Date) {
    const trips = await prisma.trip.findMany({
      where: {
        completedAt: {
          gte: startDate || undefined,
          lte: endDate || undefined,
        },
        revenue: { not: null },
      },
      select: {
        completedAt: true,
        revenue: true,
      },
    });

    const revenueByDate: Record<string, number> = {};
    let totalRevenue = 0;

    trips.forEach((trip) => {
      if (!trip.completedAt || !trip.revenue) return;
      const dateStr = trip.completedAt.toISOString().split('T')[0]!;
      const amount = Number(trip.revenue);

      revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + amount;
      totalRevenue += amount;
    });

    return { totalRevenue, revenueByDate };
  }

  async getExpensesReport(startDate?: Date, endDate?: Date) {
    const expenses = await prisma.expense.findMany({
      where: {
        incurredAt: {
          gte: startDate || undefined,
          lte: endDate || undefined,
        },
      },
      select: {
        incurredAt: true,
        amount: true,
        category: true,
      },
    });

    const expensesByCategory: Record<string, number> = {};
    let totalExpenses = 0;

    expenses.forEach((expense) => {
      const amount = Number(expense.amount);
      expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + amount;
      totalExpenses += amount;
    });

    return { totalExpenses, expensesByCategory };
  }

  async getFuelReport() {
    const fuelLogs = await prisma.fuelLog.findMany({
      include: {
        vehicle: {
          select: { id: true, nameModel: true, registrationNumber: true },
        },
      },
    });

    const byVehicle: Record<
      string,
      {
        vehicleName: string;
        registration: string;
        totalFuel: number;
        totalCost: number;
        logCount: number;
      }
    > = {};
    let totalFuel = 0;
    let totalCost = 0;

    fuelLogs.forEach((log) => {
      const key = log.vehicle.registrationNumber;
      if (!byVehicle[key]) {
        byVehicle[key] = {
          vehicleName: log.vehicle.nameModel,
          registration: log.vehicle.registrationNumber,
          totalFuel: 0,
          totalCost: 0,
          logCount: 0,
        };
      }
      const fuel = Number(log.fuelQuantity);
      const cost = Number(log.cost);
      byVehicle[key].totalFuel += fuel;
      byVehicle[key].totalCost += cost;
      byVehicle[key].logCount += 1;
      totalFuel += fuel;
      totalCost += cost;
    });

    return {
      totalFuel: Math.round(totalFuel * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      byVehicle: Object.values(byVehicle).map((v) => ({
        ...v,
        totalFuel: Math.round(v.totalFuel * 100) / 100,
        totalCost: Math.round(v.totalCost * 100) / 100,
      })),
    };
  }

  async getTripSummary() {
    const [draft, scheduled, inProgress, completed, cancelled] = await Promise.all([
      prisma.trip.count({ where: { status: 'DRAFT' } }),
      prisma.trip.count({ where: { status: 'SCHEDULED' } }),
      prisma.trip.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.trip.count({ where: { status: 'COMPLETED' } }),
      prisma.trip.count({ where: { status: 'CANCELLED' } }),
    ]);

    const total = draft + scheduled + inProgress + completed + cancelled;

    // Revenue from completed trips
    const revenueResult = await prisma.trip.aggregate({
      where: { status: 'COMPLETED', revenue: { not: null } },
      _sum: { revenue: true, actualDistance: true },
    });

    return {
      total,
      byStatus: [
        { status: 'Draft', count: draft },
        { status: 'Scheduled', count: scheduled },
        { status: 'In Progress', count: inProgress },
        { status: 'Completed', count: completed },
        { status: 'Cancelled', count: cancelled },
      ],
      totalRevenue: Number(revenueResult._sum.revenue || 0),
      totalDistance: Number(revenueResult._sum.actualDistance || 0),
    };
  }

  async getFleetUtilization() {
    const [available, inShop, onTrip, outOfService] = await Promise.all([
      prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { status: 'IN_SHOP' } }),
      prisma.vehicle.count({ where: { status: 'ON_TRIP' } }),
      prisma.vehicle.count({ where: { status: 'OUT_OF_SERVICE' } }),
    ]);

    const total = available + inShop + onTrip + outOfService;

    // Aggregate vehicle costs
    const costResult = await prisma.vehicle.aggregate({
      _sum: { acquisitionCost: true },
    });

    return {
      total,
      byStatus: [
        { status: 'Available', count: available, color: '#22c55e' },
        { status: 'On Trip', count: onTrip, color: '#3b82f6' },
        { status: 'In Shop', count: inShop, color: '#f59e0b' },
        { status: 'Out of Service', count: outOfService, color: '#ef4444' },
      ],
      totalAcquisitionCost: Number(costResult._sum.acquisitionCost || 0),
    };
  }

  async getDriverPerformance() {
    const drivers = await prisma.driver.findMany({
      include: {
        user: { select: { name: true } },
        trips: {
          where: { status: 'COMPLETED' },
          select: { id: true, actualDistance: true, fuelConsumed: true, revenue: true },
        },
        fuelLogs: { select: { fuelQuantity: true, cost: true } },
      },
    });

    return drivers.map((driver) => {
      const completedTrips = driver.trips.length;
      const totalDistance = driver.trips.reduce((sum, t) => sum + Number(t.actualDistance || 0), 0);
      const totalRevenue = driver.trips.reduce((sum, t) => sum + Number(t.revenue || 0), 0);
      const totalFuel = driver.fuelLogs.reduce((sum, f) => sum + Number(f.fuelQuantity), 0);

      return {
        name: driver.user.name,
        safetyScore: Number(driver.safetyScore),
        status: driver.status,
        completedTrips,
        totalDistance: Math.round(totalDistance * 100) / 100,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalFuel: Math.round(totalFuel * 100) / 100,
        efficiency: totalDistance > 0 ? Math.round((totalDistance / totalFuel) * 100) / 100 : 0,
      };
    });
  }

  async getMaintenanceReport() {
    const records = await prisma.maintenanceRecord.findMany({
      include: {
        vehicle: {
          select: { nameModel: true, registrationNumber: true },
        },
      },
    });

    const byVehicle: Record<
      string,
      {
        vehicleName: string;
        registration: string;
        totalCost: number;
        recordCount: number;
        active: number;
        completed: number;
      }
    > = {};
    let totalCost = 0;

    records.forEach((record) => {
      const key = record.vehicle.registrationNumber;
      if (!byVehicle[key]) {
        byVehicle[key] = {
          vehicleName: record.vehicle.nameModel,
          registration: record.vehicle.registrationNumber,
          totalCost: 0,
          recordCount: 0,
          active: 0,
          completed: 0,
        };
      }
      const cost = Number(record.cost);
      byVehicle[key].totalCost += cost;
      byVehicle[key].recordCount += 1;
      if (record.status === 'ACTIVE' || record.status === 'SCHEDULED') {
        byVehicle[key].active += 1;
      } else if (record.status === 'COMPLETED') {
        byVehicle[key].completed += 1;
      }
      totalCost += cost;
    });

    // Status summary
    const [scheduled, active, completed, cancelled] = await Promise.all([
      prisma.maintenanceRecord.count({ where: { status: 'SCHEDULED' } }),
      prisma.maintenanceRecord.count({ where: { status: 'ACTIVE' } }),
      prisma.maintenanceRecord.count({ where: { status: 'COMPLETED' } }),
      prisma.maintenanceRecord.count({ where: { status: 'CANCELLED' } }),
    ]);

    return {
      totalCost: Math.round(totalCost * 100) / 100,
      totalRecords: records.length,
      byStatus: [
        { status: 'Scheduled', count: scheduled },
        { status: 'Active', count: active },
        { status: 'Completed', count: completed },
        { status: 'Cancelled', count: cancelled },
      ],
      byVehicle: Object.values(byVehicle).map((v) => ({
        ...v,
        totalCost: Math.round(v.totalCost * 100) / 100,
      })),
    };
  }
}

export const reportsService = new ReportsService();
