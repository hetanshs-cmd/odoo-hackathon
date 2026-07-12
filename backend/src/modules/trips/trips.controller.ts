import { Request, Response } from 'express';
import { tripsService } from './trips.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk, sendCreated } from '../../utils/apiResponse';
import { createTripSchema, updateTripSchema, updateTripStatusSchema } from './trips.validator';
import { TripStatus } from '@prisma/client';

export const tripsController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { status, region_id, driver_id, vehicle_id } = req.query;

    const filters = {
      ...(status && { status: status as TripStatus }),
      ...(region_id && { regionId: parseInt(region_id as string, 10) }),
      ...(driver_id && { driverId: parseInt(driver_id as string, 10) }),
      ...(vehicle_id && { vehicleId: parseInt(vehicle_id as string, 10) }),
    };

    const trips = await tripsService.getAllTrips(filters);
    sendOk(res, trips, 'Trips retrieved successfully');
  }),

  getActive: asyncHandler(async (req: Request, res: Response) => {
    const trips = await tripsService.getActiveTrips();
    sendOk(res, trips, 'Active trips retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const trip = await tripsService.getTripById(id);
    sendOk(res, trip, 'Trip retrieved successfully');
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createTripSchema.parse(req.body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const userId = (req as any).user?.id as number | undefined;
    const trip = await tripsService.createTrip(validatedData, userId);
    sendCreated(res, trip, 'Trip created successfully');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const validatedData = updateTripSchema.parse(req.body);
    const trip = await tripsService.updateTrip(id, validatedData);
    sendOk(res, trip, 'Trip updated successfully');
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const validatedData = updateTripStatusSchema.parse(req.body);
    const trip = await tripsService.updateTripStatus(id, validatedData);
    sendOk(res, trip, 'Trip status updated successfully');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    await tripsService.deleteTrip(id);
    sendOk(res, null, 'Trip cancelled successfully');
  }),
};
