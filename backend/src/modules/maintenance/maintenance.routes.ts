import { Router } from 'express';
import { maintenanceController } from './maintenance.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const maintenanceRouter = Router();

maintenanceRouter.use(requireAuth);

// GET /api/maintenance (All Roles)
maintenanceRouter.get(
  '/',
  requireRole(['FleetManager', 'SafetyOfficer', 'FinancialAnalyst', 'Dispatcher', 'Driver']),
  maintenanceController.getAll,
);

// GET /api/maintenance/active (All Roles)
maintenanceRouter.get(
  '/active',
  requireRole(['FleetManager', 'SafetyOfficer', 'FinancialAnalyst', 'Dispatcher', 'Driver']),
  maintenanceController.getActive,
);

// GET /api/maintenance/:id (All Roles)
maintenanceRouter.get(
  '/:id',
  requireRole(['FleetManager', 'SafetyOfficer', 'FinancialAnalyst', 'Dispatcher', 'Driver']),
  maintenanceController.getById,
);

// POST /api/maintenance (FM only)
maintenanceRouter.post(
  '/',
  requireRole(['FleetManager', 'SafetyOfficer']),
  maintenanceController.create,
);

// PUT /api/maintenance/:id (FM only)
maintenanceRouter.put(
  '/:id',
  requireRole(['FleetManager', 'SafetyOfficer']),
  maintenanceController.update,
);

// PATCH /api/maintenance/:id/status (FM only)
maintenanceRouter.patch(
  '/:id/status',
  requireRole(['FleetManager', 'SafetyOfficer']),
  maintenanceController.updateStatus,
);

// PATCH /api/maintenance/:id/close (FM only)
maintenanceRouter.patch(
  '/:id/close',
  requireRole(['FleetManager', 'SafetyOfficer']),
  maintenanceController.close,
);

// DELETE /api/maintenance/:id (FM only)
maintenanceRouter.delete(
  '/:id',
  requireRole(['FleetManager', 'SafetyOfficer']),
  maintenanceController.delete,
);

export default maintenanceRouter;
