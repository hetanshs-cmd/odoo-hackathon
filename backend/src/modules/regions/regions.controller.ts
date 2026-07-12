import { Request, Response } from 'express';
import { regionsService } from './regions.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk } from '../../utils/apiResponse';

export const regionsController = {
  /**
   * GET /api/regions
   * List all regions for dropdowns and filters.
   */
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const regions = await regionsService.getAllRegions();
    sendOk(res, regions, 'Regions retrieved successfully');
  }),
};
