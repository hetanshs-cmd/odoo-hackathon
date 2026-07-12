import { Request, Response } from 'express';
import { settingsService } from './settings.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk } from '../../utils/apiResponse';
import { updateSettingsSchema } from './settings.validator';

export const settingsController = {
  getSettings: asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.getSettings();
    sendOk(res, settings, 'Settings retrieved successfully');
  }),

  updateSettings: asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateSettingsSchema.parse(req.body);
    const settings = await settingsService.updateSettings(validatedData);
    sendOk(res, settings, 'Settings updated successfully');
  }),
};
