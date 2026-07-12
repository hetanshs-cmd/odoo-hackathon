import { z } from 'zod';

export const updateSettingsSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required').max(100).optional(),
  timezone: z.string().max(50).optional(),
  currency: z.string().max(10).optional(),
});

export type UpdateSettingsDto = z.infer<typeof updateSettingsSchema>;
