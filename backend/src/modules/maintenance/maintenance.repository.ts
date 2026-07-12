import { PrismaClient, MaintenanceStatus, VehicleStatus, Prisma } from '@prisma/client';
import {
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
  UpdateMaintenanceStatusDto,
} from './maintenance.validator';
import { AppError } from '../../utils/AppError';

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
    return prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: data.vehicleId } });
      if (!vehicle) {
        throw new AppError('NOT_FOUND', 404, 'Vehicle not found');
      }
      if (vehicle.status === VehicleStatus.OUT_OF_SERVICE) {
        throw new AppError(
          'VALIDATION_ERROR',
          400,
          'Cannot perform maintenance on OUT_OF_SERVICE vehicles',
        );
      }

      const record = await tx.maintenanceRecord.create({
        data: {
          ...data,
          status: MaintenanceStatus.ACTIVE,
          startedAt: data.startedAt ? new Date(data.startedAt) : new Date(),
        },
      });

      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: VehicleStatus.IN_SHOP },
      });

      return record;
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

  async closeRecord(id: number) {
    return prisma.$transaction(async (tx) => {
      const record = await tx.maintenanceRecord.findUnique({
        where: { id },
        include: { vehicle: true },
      });

      if (!record) {
        throw new AppError('NOT_FOUND', 404, 'Maintenance record not found');
      }

      if (record.status === MaintenanceStatus.COMPLETED) {
        throw new AppError('VALIDATION_ERROR', 400, 'Record is already closed');
      }

      const updatedRecord = await tx.maintenanceRecord.update({
        where: { id },
        data: {
          status: MaintenanceStatus.COMPLETED,
          closedAt: new Date(),
        },
      });

      if (record.vehicle.status !== VehicleStatus.OUT_OF_SERVICE) {
        await tx.vehicle.update({
          where: { id: record.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        });
      }

      return updatedRecord;
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
