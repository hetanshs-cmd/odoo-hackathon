import { driversRepository } from './drivers.repository';
import { AppError } from '../../utils/AppError';
import { CreateDriverDto, UpdateDriverDto, UpdateDriverStatusDto } from './drivers.validator';
import { DriverStatus } from '@prisma/client';

export class DriversService {
  async getAllDrivers(filters?: { status?: DriverStatus; regionId?: number }) {
    return driversRepository.findAll(filters);
  }

  async getAvailableDrivers() {
    return driversRepository.findAvailable();
  }

  async getExpiringLicenses(days: number) {
    return driversRepository.findExpiringLicenses(days);
  }

  async getDriverById(id: number) {
    const driver = await driversRepository.findById(id);
    if (!driver) {
      throw new AppError('NOT_FOUND', 404, 'Driver not found');
    }
    return driver;
  }

  async createDriver(data: CreateDriverDto) {
    const existing = await driversRepository.findByLicenseNumber(data.licenseNumber);
    if (existing) {
      throw new AppError('CONFLICT', 409, 'Driver with this license number already exists');
    }
    // Also might want to check if data.userId already has a driver profile
    // Assuming driver model userId is @unique in Prisma:
    // This will throw a Prisma error if violated, but ideally we'd check first.
    return driversRepository.create(data);
  }

  async updateDriver(id: number, data: UpdateDriverDto) {
    const driver = await driversRepository.findById(id);
    if (!driver) {
      throw new AppError('NOT_FOUND', 404, 'Driver not found');
    }

    if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
      const existing = await driversRepository.findByLicenseNumber(data.licenseNumber);
      if (existing) {
        throw new AppError('CONFLICT', 409, 'Driver with this license number already exists');
      }
    }

    return driversRepository.update(id, data);
  }

  async updateDriverStatus(id: number, data: UpdateDriverStatusDto) {
    const driver = await driversRepository.findById(id);
    if (!driver) {
      throw new AppError('NOT_FOUND', 404, 'Driver not found');
    }
    return driversRepository.updateStatus(id, data);
  }

  async deleteDriver(id: number) {
    const driver = await driversRepository.findById(id);
    if (!driver) {
      throw new AppError('NOT_FOUND', 404, 'Driver not found');
    }
    return driversRepository.delete(id);
  }
}

export const driversService = new DriversService();
