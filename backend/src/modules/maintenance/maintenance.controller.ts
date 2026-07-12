import { Request, Response } from 'express';
import { maintenanceService } from './maintenance.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk, sendCreated } from '../../utils/apiResponse';
import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
  updateMaintenanceStatusSchema,
} from './maintenance.validator';
import { MaintenanceStatus } from '@prisma/client';

export const maintenanceController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { status, vehicle_id } = req.query;

    const filters = {
      ...(status && { status: status as MaintenanceStatus }),
      ...(vehicle_id && { vehicleId: parseInt(vehicle_id as string, 10) }),
    };

    const records = await maintenanceService.getAllRecords(filters);
    sendOk(res, records, 'Maintenance records retrieved successfully');
  }),

  getActive: asyncHandler(async (req: Request, res: Response) => {
    const records = await maintenanceService.getActiveRecords();
    sendOk(res, records, 'Active maintenance records retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const record = await maintenanceService.getRecordById(id);
    sendOk(res, record, 'Maintenance record retrieved successfully');
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createMaintenanceSchema.parse(req.body);
    const record = await maintenanceService.createRecord(validatedData);
    sendCreated(res, record, 'Maintenance record created successfully');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const validatedData = updateMaintenanceSchema.parse(req.body);
    const record = await maintenanceService.updateRecord(id, validatedData);
    sendOk(res, record, 'Maintenance record updated successfully');
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const validatedData = updateMaintenanceStatusSchema.parse(req.body);
    const record = await maintenanceService.updateRecordStatus(id, validatedData);
    sendOk(res, record, 'Maintenance record status updated successfully');
  }),

  close: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const record = await maintenanceService.closeRecord(id);
    sendOk(res, record, 'Maintenance record closed successfully');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    await maintenanceService.deleteRecord(id);
    sendOk(res, null, 'Maintenance record cancelled successfully');
  }),
};
