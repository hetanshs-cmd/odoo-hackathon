import { maintenanceRepository } from './maintenance.repository';
import { AppError } from '../../utils/AppError';
import {
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
  UpdateMaintenanceStatusDto,
} from './maintenance.validator';
import { MaintenanceStatus } from '@prisma/client';

export class MaintenanceService {
  async getAllRecords(filters?: { status?: MaintenanceStatus; vehicleId?: number }) {
    return maintenanceRepository.findAll(filters);
  }

  async getActiveRecords() {
    return maintenanceRepository.findActive();
  }

  async getRecordById(id: number) {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw new AppError('NOT_FOUND', 404, 'Maintenance record not found');
    }
    return record;
  }

  async createRecord(data: CreateMaintenanceDto) {
    return maintenanceRepository.create(data);
  }

  async updateRecord(id: number, data: UpdateMaintenanceDto) {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw new AppError('NOT_FOUND', 404, 'Maintenance record not found');
    }
    return maintenanceRepository.update(id, data);
  }

  async updateRecordStatus(id: number, data: UpdateMaintenanceStatusDto) {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw new AppError('NOT_FOUND', 404, 'Maintenance record not found');
    }
    return maintenanceRepository.updateStatus(id, data);
  }

  async deleteRecord(id: number) {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw new AppError('NOT_FOUND', 404, 'Maintenance record not found');
    }
    return maintenanceRepository.delete(id);
  }
}

export const maintenanceService = new MaintenanceService();
