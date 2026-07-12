import { fuelLogsRepository } from './fuelLogs.repository';
import { AppError } from '../../utils/AppError';
import { CreateFuelLogDto, UpdateFuelLogDto } from './fuelLogs.validator';

export class FuelLogsService {
  async getAllLogs(filters?: { vehicleId?: number; tripId?: number; driverId?: number }) {
    return fuelLogsRepository.findAll(filters);
  }

  async getLogById(id: number) {
    const log = await fuelLogsRepository.findById(id);
    if (!log) {
      throw new AppError('NOT_FOUND', 404, 'Fuel log not found');
    }
    return log;
  }

  async createLog(data: CreateFuelLogDto) {
    // Check if vehicle exists etc. normally done here
    return fuelLogsRepository.create(data);
  }

  async updateLog(id: number, data: UpdateFuelLogDto) {
    const log = await fuelLogsRepository.findById(id);
    if (!log) {
      throw new AppError('NOT_FOUND', 404, 'Fuel log not found');
    }
    return fuelLogsRepository.update(id, data);
  }

  async deleteLog(id: number) {
    const log = await fuelLogsRepository.findById(id);
    if (!log) {
      throw new AppError('NOT_FOUND', 404, 'Fuel log not found');
    }
    // Hard delete for fuel logs is acceptable or we could have an isActive flag
    return fuelLogsRepository.delete(id);
  }
}

export const fuelLogsService = new FuelLogsService();
