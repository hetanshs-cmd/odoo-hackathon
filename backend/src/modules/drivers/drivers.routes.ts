import { Router } from 'express';
import { driversController } from './drivers.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const driversRouter = Router();

driversRouter.use(requireAuth);

// GET /api/drivers (All authenticated)
driversRouter.get('/', driversController.getAll);

// GET /api/drivers/available (FM, DR, SO)
driversRouter.get(
  '/available',
  requireRole(['FleetManager', 'Driver', 'SafetyOfficer']),
  driversController.getAvailable,
);

// GET /api/drivers/expiring-licenses (FM, SO)
driversRouter.get(
  '/expiring-licenses',
  requireRole(['FleetManager', 'SafetyOfficer']),
  driversController.getExpiringLicenses,
);

// GET /api/drivers/:id (All authenticated)
driversRouter.get('/:id', driversController.getById);

// POST /api/drivers (FM only)
driversRouter.post('/', requireRole(['FleetManager']), driversController.create);

// PUT /api/drivers/:id (FM only)
driversRouter.put('/:id', requireRole(['FleetManager']), driversController.update);

// PATCH /api/drivers/:id/status (FM only)
driversRouter.patch('/:id/status', requireRole(['FleetManager']), driversController.updateStatus);

// DELETE /api/drivers/:id (FM only)
driversRouter.delete('/:id', requireRole(['FleetManager']), driversController.delete);

export default driversRouter;
