import { PrismaClient, VehicleStatus } from '@prisma/client';
import { CreateVehicleDto, UpdateVehicleDto, UpdateVehicleStatusDto } from './vehicles.validator';

const prisma = new PrismaClient();

export class VehiclesRepository {
  async findAll(filters?: { status?: VehicleStatus; regionId?: number; type?: string }) {
    return prisma.vehicle.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.regionId && { regionId: filters.regionId }),
        ...(filters?.type && { type: filters.type }),
      },
      include: { region: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAvailable() {
    return prisma.vehicle.findMany({
      where: {
        status: VehicleStatus.AVAILABLE,
      },
      include: { region: true },
    });
  }

  async findById(id: number) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: { region: true },
    });
  }

  async findByRegistrationNumber(registrationNumber: string) {
    return prisma.vehicle.findUnique({
      where: { registrationNumber },
    });
  }

  async create(data: CreateVehicleDto) {
    return prisma.vehicle.create({
      data,
    });
  }

  async update(id: number, data: UpdateVehicleDto) {
    return prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: number, data: UpdateVehicleStatusDto) {
    return prisma.vehicle.update({
      where: { id },
      data: { status: data.status },
    });
  }

  async delete(id: number) {
    // Soft delete per PDF logic: "set status to RETIRED"
    // Wait, prisma enum doesn't have RETIRED. Let's use OUT_OF_SERVICE.
    return prisma.vehicle.update({
      where: { id },
      data: { status: VehicleStatus.OUT_OF_SERVICE },
    });
  }
}

export const vehiclesRepository = new VehiclesRepository();
