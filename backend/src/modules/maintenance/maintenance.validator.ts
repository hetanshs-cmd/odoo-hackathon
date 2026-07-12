import { z } from 'zod';
import { MaintenanceStatus } from '@prisma/client';

export const createMaintenanceSchema = z.object({
  vehicleId: z.number().int().positive('Vehicle ID is required'),
  description: z.string().min(1, 'Description is required').max(255),
  cost: z.number().nonnegative('Cost must be non-negative'),
  startedAt: z.string().datetime().or(z.date()).optional(),
});

export const updateMaintenanceSchema = createMaintenanceSchema.partial().omit({ vehicleId: true });

export const updateMaintenanceStatusSchema = z.object({
  status: z.nativeEnum(MaintenanceStatus),
});

export type CreateMaintenanceDto = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceDto = z.infer<typeof updateMaintenanceSchema>;
export type UpdateMaintenanceStatusDto = z.infer<typeof updateMaintenanceStatusSchema>;
