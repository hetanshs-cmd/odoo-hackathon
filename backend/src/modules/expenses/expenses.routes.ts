import { Router } from 'express';
import { expensesController } from './expenses.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const expensesRouter = Router();

expensesRouter.use(requireAuth);

// GET /api/expenses
expensesRouter.get(
  '/',
  requireRole(['FleetManager', 'SafetyOfficer', 'FinancialAnalyst', 'Dispatcher', 'Driver']),
  expensesController.getAll,
);

// GET /api/expenses/summary
expensesRouter.get(
  '/summary',
  requireRole(['FleetManager', 'SafetyOfficer', 'FinancialAnalyst', 'Dispatcher', 'Driver']),
  expensesController.getSummary,
);

// GET /api/expenses/:id
expensesRouter.get(
  '/:id',
  requireRole(['FleetManager', 'SafetyOfficer', 'FinancialAnalyst', 'Dispatcher', 'Driver']),
  expensesController.getById,
);

// POST /api/expenses
expensesRouter.post(
  '/',
  requireRole(['FleetManager', 'FinancialAnalyst']),
  expensesController.create,
);

// PUT /api/expenses/:id
expensesRouter.put(
  '/:id',
  requireRole(['FleetManager', 'FinancialAnalyst']),
  expensesController.update,
);

// DELETE /api/expenses/:id
expensesRouter.delete(
  '/:id',
  requireRole(['FleetManager', 'FinancialAnalyst']),
  expensesController.delete,
);

export default expensesRouter;
