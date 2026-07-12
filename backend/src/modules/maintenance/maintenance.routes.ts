import { Router } from 'express';
import { maintenanceController } from './maintenance.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const maintenanceRouter = Router();

maintenanceRouter.use(requireAuth);

// GET /api/maintenance (All authenticated)
maintenanceRouter.get('/', maintenanceController.getAll);

// GET /api/maintenance/active (FM, DR, SO)
maintenanceRouter.get(
  '/active',
  requireRole(['FleetManager', 'Driver', 'SafetyOfficer']),
  maintenanceController.getActive,
);

// GET /api/maintenance/:id (All authenticated)
maintenanceRouter.get('/:id', maintenanceController.getById);

// POST /api/maintenance (FM, SO)
maintenanceRouter.post(
  '/',
  requireRole(['FleetManager', 'SafetyOfficer']),
  maintenanceController.create,
);

// PUT /api/maintenance/:id (FM, SO)
maintenanceRouter.put(
  '/:id',
  requireRole(['FleetManager', 'SafetyOfficer']),
  maintenanceController.update,
);

// PATCH /api/maintenance/:id/status (FM, SO)
maintenanceRouter.patch(
  '/:id/status',
  requireRole(['FleetManager', 'SafetyOfficer']),
  maintenanceController.updateStatus,
);

// DELETE /api/maintenance/:id (FM only)
maintenanceRouter.delete('/:id', requireRole(['FleetManager']), maintenanceController.delete);

export default maintenanceRouter;
