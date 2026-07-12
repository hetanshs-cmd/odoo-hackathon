import { PrismaClient, MaintenanceStatus, Prisma } from '@prisma/client';
import {
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
  UpdateMaintenanceStatusDto,
} from './maintenance.validator';

const prisma = new PrismaClient();

export class MaintenanceRepository {
  async findAll(filters?: { status?: MaintenanceStatus; vehicleId?: number }) {
    return prisma.maintenanceRecord.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
      },
      include: {
        vehicle: { select: { registrationNumber: true, nameModel: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return prisma.maintenanceRecord.findMany({
      where: {
        status: { in: [MaintenanceStatus.ACTIVE, MaintenanceStatus.SCHEDULED] },
      },
      include: {
        vehicle: { select: { registrationNumber: true, nameModel: true } },
      },
    });
  }

  async findById(id: number) {
    return prisma.maintenanceRecord.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });
  }

  async create(data: CreateMaintenanceDto) {
    return prisma.maintenanceRecord.create({
      data: {
        ...data,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
      },
    });
  }

  async update(id: number, data: UpdateMaintenanceDto) {
    return prisma.maintenanceRecord.update({
      where: { id },
      data: {
        ...data,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
      },
    });
  }

  async updateStatus(id: number, data: UpdateMaintenanceStatusDto) {
    const updateData: Prisma.MaintenanceRecordUpdateInput = { status: data.status };
    if (
      data.status === MaintenanceStatus.COMPLETED ||
      data.status === MaintenanceStatus.CANCELLED
    ) {
      updateData.closedAt = new Date();
    }

    return prisma.maintenanceRecord.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number) {
    return prisma.maintenanceRecord.update({
      where: { id },
      data: { status: MaintenanceStatus.CANCELLED },
    });
  }
}

export const maintenanceRepository = new MaintenanceRepository();
