import { z } from 'zod';

export const vehicleStatusSchema = z.enum([
  'AVAILABLE',
  'IN_SHOP',
  'ON_TRIP',
  'OUT_OF_SERVICE',
]);

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required').max(50),
  nameModel: z.string().min(1, 'Model name is required').max(100),
  type: z.string().max(50).optional(),
  maxLoadCapacity: z.coerce.number().positive('Load capacity must be positive'),
  acquisitionCost: z.coerce.number().nonnegative('Acquisition cost cannot be negative'),
  regionId: z.coerce.number().int().positive('Invalid region ID').optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const updateVehicleStatusSchema = z.object({
  status: vehicleStatusSchema,
});

export type CreateVehiclePayload = z.infer<typeof createVehicleSchema>;
export type UpdateVehiclePayload = z.infer<typeof updateVehicleSchema>;
export type UpdateVehicleStatusPayload = z.infer<typeof updateVehicleStatusSchema>;
