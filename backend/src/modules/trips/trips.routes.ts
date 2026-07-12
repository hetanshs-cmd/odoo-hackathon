import { Router } from 'express';
import { tripsController } from './trips.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const tripsRouter = Router();

tripsRouter.use(requireAuth);

// GET /api/trips (All authenticated)
tripsRouter.get('/', tripsController.getAll);

// GET /api/trips/active (All authenticated)
tripsRouter.get('/active', tripsController.getActive);

// GET /api/trips/:id (All authenticated)
tripsRouter.get('/:id', tripsController.getById);

// POST /api/trips (FM, DR)
tripsRouter.post('/', requireRole(['FleetManager', 'Driver']), tripsController.create);

// PUT /api/trips/:id (FM, DR)
tripsRouter.put('/:id', requireRole(['FleetManager', 'Driver']), tripsController.update);

// PATCH /api/trips/:id/status (FM, DR)
tripsRouter.patch(
  '/:id/status',
  requireRole(['FleetManager', 'Driver']),
  tripsController.updateStatus,
);

// DELETE /api/trips/:id (FM only)
tripsRouter.delete('/:id', requireRole(['FleetManager']), tripsController.delete);

export default tripsRouter;
