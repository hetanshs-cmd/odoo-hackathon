import { Router } from 'express';
import { fuelLogsController } from './fuelLogs.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const fuelLogsRouter = Router();

fuelLogsRouter.use(requireAuth);

// GET /api/fuel-logs
fuelLogsRouter.get(
  '/',
  requireRole(['FleetManager', 'SafetyOfficer', 'FinancialAnalyst', 'Driver']),
  fuelLogsController.getAll,
);

// GET /api/fuel-logs/:id
fuelLogsRouter.get(
  '/:id',
  requireRole(['FleetManager', 'SafetyOfficer', 'FinancialAnalyst', 'Driver']),
  fuelLogsController.getById,
);

// POST /api/fuel-logs
fuelLogsRouter.post(
  '/',
  requireRole(['FleetManager', 'FinancialAnalyst']),
  fuelLogsController.create,
);

// PUT /api/fuel-logs/:id
fuelLogsRouter.put(
  '/:id',
  requireRole(['FleetManager', 'FinancialAnalyst']),
  fuelLogsController.update,
);

// DELETE /api/fuel-logs/:id
fuelLogsRouter.delete(
  '/:id',
  requireRole(['FleetManager', 'FinancialAnalyst']),
  fuelLogsController.delete,
);

export default fuelLogsRouter;
