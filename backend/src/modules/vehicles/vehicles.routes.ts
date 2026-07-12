import { Router } from 'express';
import { vehiclesController } from './vehicles.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const vehiclesRouter = Router();

vehiclesRouter.use(requireAuth);

// GET /api/vehicles (All authenticated)
vehiclesRouter.get('/', vehiclesController.getAll);

// GET /api/vehicles/available (FM, DR)
vehiclesRouter.get(
  '/available',
  requireRole(['FleetManager', 'Driver']),
  vehiclesController.getAvailable,
);

// GET /api/vehicles/:id (All authenticated)
vehiclesRouter.get('/:id', vehiclesController.getById);

// POST /api/vehicles (FM only)
vehiclesRouter.post('/', requireRole(['FleetManager']), vehiclesController.create);

// PUT /api/vehicles/:id (FM only)
vehiclesRouter.put('/:id', requireRole(['FleetManager']), vehiclesController.update);

// PATCH /api/vehicles/:id/status (FM only)
vehiclesRouter.patch('/:id/status', requireRole(['FleetManager']), vehiclesController.updateStatus);

// DELETE /api/vehicles/:id (FM only)
vehiclesRouter.delete('/:id', requireRole(['FleetManager']), vehiclesController.delete);

export default vehiclesRouter;
