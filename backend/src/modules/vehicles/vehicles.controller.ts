import { Request, Response } from 'express';
import { vehiclesService } from './vehicles.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk, sendCreated } from '../../utils/apiResponse';
import {
  createVehicleSchema,
  updateVehicleSchema,
  updateVehicleStatusSchema,
} from './vehicles.validator';
import { VehicleStatus } from '@prisma/client';

export const vehiclesController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { status, region_id, type } = req.query;

    const filters = {
      ...(status && { status: status as VehicleStatus }),
      ...(region_id && { regionId: parseInt(region_id as string, 10) }),
      ...(type && { type: type as string }),
    };

    const vehicles = await vehiclesService.getAllVehicles(filters);
    sendOk(res, vehicles, 'Vehicles retrieved successfully');
  }),

  getAvailable: asyncHandler(async (req: Request, res: Response) => {
    const vehicles = await vehiclesService.getAvailableVehicles();
    sendOk(res, vehicles, 'Available vehicles retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const vehicle = await vehiclesService.getVehicleById(id);
    sendOk(res, vehicle, 'Vehicle retrieved successfully');
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createVehicleSchema.parse(req.body);
    const vehicle = await vehiclesService.createVehicle(validatedData);
    sendCreated(res, vehicle, 'Vehicle created successfully');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const validatedData = updateVehicleSchema.parse(req.body);
    const vehicle = await vehiclesService.updateVehicle(id, validatedData);
    sendOk(res, vehicle, 'Vehicle updated successfully');
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const validatedData = updateVehicleStatusSchema.parse(req.body);
    const vehicle = await vehiclesService.updateVehicleStatus(id, validatedData);
    sendOk(res, vehicle, 'Vehicle status updated successfully');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    await vehiclesService.deleteVehicle(id);
    sendOk(res, null, 'Vehicle deleted (marked out of service) successfully');
  }),
};
