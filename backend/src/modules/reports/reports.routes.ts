import { Router } from 'express';
import { reportsController } from './reports.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const reportsRouter = Router();

reportsRouter.use(requireAuth);
reportsRouter.use(requireRole(['FleetManager', 'FinancialAnalyst']));

// GET /api/reports/revenue
reportsRouter.get('/revenue', reportsController.getRevenue);

// GET /api/reports/expenses
reportsRouter.get('/expenses', reportsController.getExpenses);

export default reportsRouter;
