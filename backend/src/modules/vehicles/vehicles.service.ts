import { vehiclesRepository } from './vehicles.repository';
import { AppError } from '../../utils/AppError';
import { CreateVehicleDto, UpdateVehicleDto, UpdateVehicleStatusDto } from './vehicles.validator';
import { VehicleStatus } from '@prisma/client';

export class VehiclesService {
  async getAllVehicles(filters?: { status?: VehicleStatus; regionId?: number; type?: string }) {
    return vehiclesRepository.findAll(filters);
  }

  async getAvailableVehicles() {
    return vehiclesRepository.findAvailable();
  }

  async getVehicleById(id: number) {
    const vehicle = await vehiclesRepository.findById(id);
    if (!vehicle) {
      throw new AppError('NOT_FOUND', 404, 'Vehicle not found');
    }
    return vehicle;
  }

  async createVehicle(data: CreateVehicleDto) {
    const existing = await vehiclesRepository.findByRegistrationNumber(data.registrationNumber);
    if (existing) {
      throw new AppError('CONFLICT', 409, 'Vehicle with this registration number already exists');
    }
    return vehiclesRepository.create(data);
  }

  async updateVehicle(id: number, data: UpdateVehicleDto) {
    const vehicle = await vehiclesRepository.findById(id);
    if (!vehicle) {
      throw new AppError('NOT_FOUND', 404, 'Vehicle not found');
    }

    if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
      const existing = await vehiclesRepository.findByRegistrationNumber(data.registrationNumber);
      if (existing) {
        throw new AppError('CONFLICT', 409, 'Vehicle with this registration number already exists');
      }
    }

    return vehiclesRepository.update(id, data);
  }

  async updateVehicleStatus(id: number, data: UpdateVehicleStatusDto) {
    const vehicle = await vehiclesRepository.findById(id);
    if (!vehicle) {
      throw new AppError('NOT_FOUND', 404, 'Vehicle not found');
    }
    return vehiclesRepository.updateStatus(id, data);
  }

  async deleteVehicle(id: number) {
    const vehicle = await vehiclesRepository.findById(id);
    if (!vehicle) {
      throw new AppError('NOT_FOUND', 404, 'Vehicle not found');
    }
    return vehiclesRepository.delete(id);
  }
}

export const vehiclesService = new VehiclesService();
