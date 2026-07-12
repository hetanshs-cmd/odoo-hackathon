import { PrismaClient, DriverStatus } from '@prisma/client';
import { CreateDriverDto, UpdateDriverDto, UpdateDriverStatusDto } from './drivers.validator';

const prisma = new PrismaClient();

export class DriversRepository {
  async findAll(filters?: { status?: DriverStatus; regionId?: number }) {
    return prisma.driver.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.regionId && { regionId: filters.regionId }),
      },
      include: { user: { select: { name: true, email: true } }, region: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAvailable() {
    return prisma.driver.findMany({
      where: {
        status: DriverStatus.AVAILABLE,
        // Exclude suspended / expired license if that was tracked via status, but we use AVAILABLE.
        // Actually, checking licenseExpiryDate > today would be good.
        licenseExpiryDate: {
          gt: new Date(),
        },
      },
      include: { user: { select: { name: true } }, region: true },
    });
  }

  async findExpiringLicenses(days: number) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    return prisma.driver.findMany({
      where: {
        licenseExpiryDate: {
          lte: targetDate,
          gt: new Date(),
        },
      },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  async findById(id: number) {
    return prisma.driver.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } }, region: true },
    });
  }

  async findByLicenseNumber(licenseNumber: string) {
    return prisma.driver.findUnique({
      where: { licenseNumber },
    });
  }

  async create(data: CreateDriverDto) {
    return prisma.driver.create({
      data: {
        ...data,
        licenseExpiryDate: data.licenseExpiryDate ? new Date(data.licenseExpiryDate) : null,
      },
    });
  }

  async update(id: number, data: UpdateDriverDto) {
    return prisma.driver.update({
      where: { id },
      data: {
        ...data,
        licenseExpiryDate: data.licenseExpiryDate ? new Date(data.licenseExpiryDate) : undefined,
      },
    });
  }

  async updateStatus(id: number, data: UpdateDriverStatusDto) {
    return prisma.driver.update({
      where: { id },
      data: { status: data.status },
    });
  }

  async delete(id: number) {
    // Soft delete: usually we have a status, but DriverStatus doesn't have RETIRED.
    // For now we just use OFF_DUTY or hard delete. I'll soft-delete by setting status OFF_DUTY.
    return prisma.driver.update({
      where: { id },
      data: { status: DriverStatus.OFF_DUTY },
    });
  }
}

export const driversRepository = new DriversRepository();
