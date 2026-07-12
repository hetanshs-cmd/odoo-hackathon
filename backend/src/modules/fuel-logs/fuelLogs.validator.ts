import { z } from 'zod';

export const createFuelLogSchema = z.object({
  vehicleId: z.number().int().positive('Vehicle ID is required'),
  tripId: z.number().int().positive().optional(),
  driverId: z.number().int().positive().optional(),
  fuelQuantity: z.number().positive('Fuel quantity must be positive'),
  cost: z.number().nonnegative('Cost must be non-negative'),
  odometer: z.number().nonnegative('Odometer must be non-negative').optional(),
  loggedAt: z.string().datetime().or(z.date()).optional(),
});

export const updateFuelLogSchema = createFuelLogSchema.partial();

export type CreateFuelLogDto = z.infer<typeof createFuelLogSchema>;
export type UpdateFuelLogDto = z.infer<typeof updateFuelLogSchema>;
