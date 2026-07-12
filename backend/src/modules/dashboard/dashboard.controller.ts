import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk } from '../../utils/apiResponse';

export const dashboardController = {
  getStats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await dashboardService.getStats();
    sendOk(res, stats, 'Dashboard stats retrieved successfully');
  }),
};
