import { z } from 'zod';

export const createExpenseSchema = z.object({
  vehicleId: z.number().int().positive('Vehicle ID is required'),
  driverId: z.number().int().positive().optional(),
  category: z.string().min(1, 'Category is required').max(50),
  amount: z.number().nonnegative('Amount must be non-negative'),
  description: z.string().max(255).optional(),
  incurredAt: z.string().datetime().or(z.date()).optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
