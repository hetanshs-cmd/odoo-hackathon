import { PrismaClient, TripStatus, Prisma } from '@prisma/client';
import { CreateTripDto, UpdateTripDto, UpdateTripStatusDto } from './trips.validator';

const prisma = new PrismaClient();

export class TripsRepository {
  async findAll(filters?: {
    status?: TripStatus;
    regionId?: number;
    driverId?: number;
    vehicleId?: number;
  }) {
    return prisma.trip.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.regionId && { regionId: filters.regionId }),
        ...(filters?.driverId && { driverId: filters.driverId }),
        ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
      },
      include: {
        vehicle: { select: { registrationNumber: true, nameModel: true } },
        driver: { select: { user: { select: { name: true } }, licenseNumber: true } },
        region: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return prisma.trip.findMany({
      where: {
        status: TripStatus.IN_PROGRESS,
      },
      include: {
        vehicle: { select: { registrationNumber: true } },
        driver: { select: { user: { select: { name: true } } } },
      },
    });
  }

  async findById(id: number) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: { include: { user: { select: { name: true, email: true } } } },
        region: true,
      },
    });
  }

  async create(data: CreateTripDto, createdByUserId?: number) {
    return prisma.trip.create({
      data: {
        ...data,
        createdBy: createdByUserId,
      },
    });
  }

  async update(id: number, data: UpdateTripDto) {
    return prisma.trip.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: number, data: UpdateTripStatusDto) {
    const updateData: Prisma.TripUpdateInput = { status: data.status };
    if (data.status === TripStatus.IN_PROGRESS) {
      updateData.dispatchedAt = new Date();
    } else if (data.status === TripStatus.COMPLETED) {
      updateData.completedAt = new Date();
      if (data.actualDistance !== undefined) updateData.actualDistance = data.actualDistance;
      if (data.fuelConsumed !== undefined) updateData.fuelConsumed = data.fuelConsumed;
    }

    return prisma.trip.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number) {
    return prisma.trip.update({
      where: { id },
      data: { status: TripStatus.CANCELLED },
    });
  }
}

export const tripsRepository = new TripsRepository();
