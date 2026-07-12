import { PrismaClient } from '@prisma/client';
import { CreateFuelLogDto, UpdateFuelLogDto } from './fuelLogs.validator';

const prisma = new PrismaClient();

export class FuelLogsRepository {
  async findAll(filters?: { vehicleId?: number; tripId?: number; driverId?: number }) {
    return prisma.fuelLog.findMany({
      where: {
        ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
        ...(filters?.tripId && { tripId: filters.tripId }),
        ...(filters?.driverId && { driverId: filters.driverId }),
      },
      include: {
        vehicle: { select: { registrationNumber: true, nameModel: true } },
        driver: { select: { user: { select: { name: true } } } },
        trip: { select: { id: true, source: true, destination: true } },
      },
      orderBy: { loggedAt: 'desc' },
    });
  }

  async findById(id: number) {
    return prisma.fuelLog.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: { include: { user: { select: { name: true } } } },
        trip: true,
      },
    });
  }

  async create(data: CreateFuelLogDto) {
    return prisma.fuelLog.create({
      data: {
        ...data,
        loggedAt: data.loggedAt ? new Date(data.loggedAt) : undefined,
      },
    });
  }

  async update(id: number, data: UpdateFuelLogDto) {
    return prisma.fuelLog.update({
      where: { id },
      data: {
        ...data,
        loggedAt: data.loggedAt ? new Date(data.loggedAt) : undefined,
      },
    });
  }

  async delete(id: number) {
    return prisma.fuelLog.delete({
      where: { id },
    });
  }
}

export const fuelLogsRepository = new FuelLogsRepository();
