import { Router } from 'express';
import { reportsController } from './reports.controller';

const reportsRouter = Router();

// Reports endpoints

// GET /api/reports/revenue
reportsRouter.get('/revenue', reportsController.getRevenue);

// GET /api/reports/expenses
reportsRouter.get('/expenses', reportsController.getExpenses);

export default reportsRouter;
