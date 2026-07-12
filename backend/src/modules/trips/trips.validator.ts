import { z } from 'zod';
import { TripStatus } from '@prisma/client';

export const createTripSchema = z.object({
  source: z.string().min(1, 'Source is required').max(150),
  destination: z.string().min(1, 'Destination is required').max(150),
  sourceLat: z.number().optional(),
  sourceLng: z.number().optional(),
  destLat: z.number().optional(),
  destLng: z.number().optional(),
  regionId: z.number().int().positive('Invalid region ID').optional(),
  vehicleId: z.number().int().positive('Vehicle ID is required'),
  driverId: z.number().int().positive('Driver ID is required'),
  cargoWeight: z.number().nonnegative('Cargo weight must be non-negative'),
  plannedDistance: z.number().nonnegative('Planned distance must be non-negative'),
  revenue: z.number().nonnegative('Revenue must be non-negative').optional(),
});

export const updateTripSchema = createTripSchema.partial();

export const updateTripStatusSchema = z.object({
  status: z.nativeEnum(TripStatus),
  actualDistance: z.number().nonnegative().optional(),
  fuelConsumed: z.number().nonnegative().optional(),
});

export type CreateTripDto = z.infer<typeof createTripSchema>;
export type UpdateTripDto = z.infer<typeof updateTripSchema>;
export type UpdateTripStatusDto = z.infer<typeof updateTripStatusSchema>;
