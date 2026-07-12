import { Request, Response } from 'express';
import { fuelLogsService } from './fuelLogs.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk, sendCreated } from '../../utils/apiResponse';
import { createFuelLogSchema, updateFuelLogSchema } from './fuelLogs.validator';

export const fuelLogsController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { vehicle_id, trip_id, driver_id } = req.query;

    const filters = {
      ...(vehicle_id && { vehicleId: parseInt(vehicle_id as string, 10) }),
      ...(trip_id && { tripId: parseInt(trip_id as string, 10) }),
      ...(driver_id && { driverId: parseInt(driver_id as string, 10) }),
    };

    const logs = await fuelLogsService.getAllLogs(filters);
    sendOk(res, logs, 'Fuel logs retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const log = await fuelLogsService.getLogById(id);
    sendOk(res, log, 'Fuel log retrieved successfully');
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createFuelLogSchema.parse(req.body);
    const log = await fuelLogsService.createLog(validatedData);
    sendCreated(res, log, 'Fuel log created successfully');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const validatedData = updateFuelLogSchema.parse(req.body);
    const log = await fuelLogsService.updateLog(id, validatedData);
    sendOk(res, log, 'Fuel log updated successfully');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    await fuelLogsService.deleteLog(id);
    sendOk(res, null, 'Fuel log deleted successfully');
  }),
};
