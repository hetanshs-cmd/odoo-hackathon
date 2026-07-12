import { Request, Response } from 'express';
import { reportsService } from './reports.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk } from '../../utils/apiResponse';

export const reportsController = {
  getRevenue: asyncHandler(async (req: Request, res: Response) => {
    const startDate = req.query['startDate']
      ? new Date(req.query['startDate'] as string)
      : undefined;
    const endDate = req.query['endDate'] ? new Date(req.query['endDate'] as string) : undefined;

    const data = await reportsService.getRevenueReport(startDate, endDate);
    sendOk(res, data, 'Revenue report generated successfully');
  }),

  getExpenses: asyncHandler(async (req: Request, res: Response) => {
    const startDate = req.query['startDate']
      ? new Date(req.query['startDate'] as string)
      : undefined;
    const endDate = req.query['endDate'] ? new Date(req.query['endDate'] as string) : undefined;

    const data = await reportsService.getExpensesReport(startDate, endDate);
    sendOk(res, data, 'Expenses report generated successfully');
  }),
};
