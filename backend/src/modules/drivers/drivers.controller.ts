import { Request, Response } from 'express';
import { driversService } from './drivers.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk, sendCreated } from '../../utils/apiResponse';
import {
  createDriverSchema,
  updateDriverSchema,
  updateDriverStatusSchema,
} from './drivers.validator';
import { DriverStatus } from '@prisma/client';

export const driversController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { status, region_id } = req.query;

    const filters = {
      ...(status && { status: status as DriverStatus }),
      ...(region_id && { regionId: parseInt(region_id as string, 10) }),
    };

    const drivers = await driversService.getAllDrivers(filters);
    sendOk(res, drivers, 'Drivers retrieved successfully');
  }),

  getAvailable: asyncHandler(async (req: Request, res: Response) => {
    const drivers = await driversService.getAvailableDrivers();
    sendOk(res, drivers, 'Available drivers retrieved successfully');
  }),

  getExpiringLicenses: asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt((req.query['days'] as string) || '7', 10);
    const drivers = await driversService.getExpiringLicenses(days);
    sendOk(res, drivers, 'Expiring licenses retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const driver = await driversService.getDriverById(id);
    sendOk(res, driver, 'Driver retrieved successfully');
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createDriverSchema.parse(req.body);
    const driver = await driversService.createDriver(validatedData);
    sendCreated(res, driver, 'Driver created successfully');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const validatedData = updateDriverSchema.parse(req.body);
    const driver = await driversService.updateDriver(id, validatedData);
    sendOk(res, driver, 'Driver updated successfully');
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const validatedData = updateDriverStatusSchema.parse(req.body);
    const driver = await driversService.updateDriverStatus(id, validatedData);
    sendOk(res, driver, 'Driver status updated successfully');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    await driversService.deleteDriver(id);
    sendOk(res, null, 'Driver deleted (marked off duty) successfully');
  }),
};
