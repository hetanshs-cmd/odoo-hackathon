import { Router } from 'express';
import { tripsController } from './trips.controller';

const tripsRouter = Router();

// Trips endpoints — authentication is omitted per user request

// GET /api/trips (All authenticated)
tripsRouter.get('/', tripsController.getAll);

// GET /api/trips/active (All authenticated)
tripsRouter.get('/active', tripsController.getActive);

// GET /api/trips/:id (All authenticated)
tripsRouter.get('/:id', tripsController.getById);

// POST /api/trips (FM, DR)
tripsRouter.post('/', tripsController.create);

// PUT /api/trips/:id (FM, DR)
tripsRouter.put('/:id', tripsController.update);

// PATCH /api/trips/:id/status (FM, DR)
tripsRouter.patch('/:id/status', tripsController.updateStatus);

// DELETE /api/trips/:id (FM only)
tripsRouter.delete('/:id', tripsController.delete);

export default tripsRouter;
