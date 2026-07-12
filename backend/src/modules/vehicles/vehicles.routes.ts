import { Router } from 'express';
import { vehiclesController } from './vehicles.controller';

const vehiclesRouter = Router();

// Vehicles endpoints — authentication is required for all
// We commented out requireAuth since user requested to NOT do auth right now,
// but actually we can just leave the middleware there if we want, or mock it.
// Wait, user said "donot do auth right now just make API's".
// I will not use the requireRole middleware for now to ensure APIs can be tested easily.
// I will just map the routes directly to controllers.

// GET /api/vehicles (All authenticated)
vehiclesRouter.get('/', vehiclesController.getAll);

// GET /api/vehicles/available (FM, DR)
vehiclesRouter.get('/available', vehiclesController.getAvailable);

// GET /api/vehicles/:id (All authenticated)
vehiclesRouter.get('/:id', vehiclesController.getById);

// POST /api/vehicles (FM only)
vehiclesRouter.post('/', vehiclesController.create);

// PUT /api/vehicles/:id (FM only)
vehiclesRouter.put('/:id', vehiclesController.update);

// PATCH /api/vehicles/:id/status (FM only)
vehiclesRouter.patch('/:id/status', vehiclesController.updateStatus);

// DELETE /api/vehicles/:id (FM only)
vehiclesRouter.delete('/:id', vehiclesController.delete);

export default vehiclesRouter;
