import { PrismaClient } from '@prisma/client';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.validator';

const prisma = new PrismaClient();

export class ExpensesRepository {
  async findAll(filters?: { vehicleId?: number; driverId?: number; category?: string }) {
    return prisma.expense.findMany({
      where: {
        ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
        ...(filters?.driverId && { driverId: filters.driverId }),
        ...(filters?.category && { category: filters.category }),
      },
      include: {
        vehicle: { select: { registrationNumber: true, nameModel: true } },
        driver: { select: { user: { select: { name: true } } } },
      },
      orderBy: { incurredAt: 'desc' },
    });
  }

  async findById(id: number) {
    return prisma.expense.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: { include: { user: { select: { name: true } } } },
      },
    });
  }

  async create(data: CreateExpenseDto) {
    return prisma.expense.create({
      data: {
        ...data,
        incurredAt: data.incurredAt ? new Date(data.incurredAt) : undefined,
      },
    });
  }

  async update(id: number, data: UpdateExpenseDto) {
    return prisma.expense.update({
      where: { id },
      data: {
        ...data,
        incurredAt: data.incurredAt ? new Date(data.incurredAt) : undefined,
      },
    });
  }

  async delete(id: number) {
    return prisma.expense.delete({
      where: { id },
    });
  }

  async getSummary() {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        fuelLogs: { select: { cost: true } },
        maintenanceRecords: { select: { cost: true } },
      },
    });

    return vehicles.map((v) => {
      const totalFuelCost = v.fuelLogs.reduce((sum, log) => sum + Number(log.cost), 0);
      const totalMaintenanceCost = v.maintenanceRecords.reduce(
        (sum, record) => sum + Number(record.cost),
        0,
      );
      return {
        vehicleId: v.id,
        registrationNumber: v.registrationNumber,
        nameModel: v.nameModel,
        totalFuelCost,
        totalMaintenanceCost,
        totalOperationalCost: totalFuelCost + totalMaintenanceCost,
      };
    });
  }
}

export const expensesRepository = new ExpensesRepository();
