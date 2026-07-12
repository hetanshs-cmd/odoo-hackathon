import { z } from 'zod';
import { DriverStatus } from '@prisma/client';

export const createDriverSchema = z.object({
  userId: z.number().int().positive('User ID is required'),
  licenseNumber: z.string().min(1, 'License number is required').max(50),
  licenseCategory: z.string().max(20).optional(),
  licenseExpiryDate: z.string().datetime().or(z.date()).optional(),
  contactNumber: z.string().max(20).optional(),
  regionId: z.number().int().positive('Invalid region ID').optional(),
});

export const updateDriverSchema = createDriverSchema.partial().omit({ userId: true });

export const updateDriverStatusSchema = z.object({
  status: z.nativeEnum(DriverStatus),
});

export type CreateDriverDto = z.infer<typeof createDriverSchema>;
export type UpdateDriverDto = z.infer<typeof updateDriverSchema>;
export type UpdateDriverStatusDto = z.infer<typeof updateDriverStatusSchema>;
