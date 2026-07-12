import { z } from 'zod';
import { VehicleStatus } from '@prisma/client';

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required').max(50),
  nameModel: z.string().min(1, 'Model name is required').max(100),
  type: z.string().max(50).optional(),
  maxLoadCapacity: z.number().positive('Load capacity must be positive'),
  acquisitionCost: z.number().nonnegative('Acquisition cost cannot be negative'),
  regionId: z.number().int().positive('Invalid region ID').optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const updateVehicleStatusSchema = z.object({
  status: z.nativeEnum(VehicleStatus),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
export type UpdateVehicleStatusDto = z.infer<typeof updateVehicleStatusSchema>;
