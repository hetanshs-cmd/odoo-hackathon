import { Router } from 'express';
import { driversController } from './drivers.controller';

const driversRouter = Router();

// Drivers endpoints — authentication is omitted per user request

// GET /api/drivers (All authenticated)
driversRouter.get('/', driversController.getAll);

// GET /api/drivers/available (FM, DR)
driversRouter.get('/available', driversController.getAvailable);

// GET /api/drivers/expiring-licenses (FM)
driversRouter.get('/expiring-licenses', driversController.getExpiringLicenses);

// GET /api/drivers/:id (All authenticated)
driversRouter.get('/:id', driversController.getById);

// POST /api/drivers (FM only)
driversRouter.post('/', driversController.create);

// PUT /api/drivers/:id (FM only)
driversRouter.put('/:id', driversController.update);

// PATCH /api/drivers/:id/status (FM only)
driversRouter.patch('/:id/status', driversController.updateStatus);

// DELETE /api/drivers/:id (FM only)
driversRouter.delete('/:id', driversController.delete);

export default driversRouter;
