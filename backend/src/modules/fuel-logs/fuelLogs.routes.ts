import { Router } from 'express';
import { fuelLogsController } from './fuelLogs.controller';

const fuelLogsRouter = Router();

// Fuel Logs endpoints — authentication is omitted per user request

// GET /api/fuel-logs
fuelLogsRouter.get('/', fuelLogsController.getAll);

// GET /api/fuel-logs/:id
fuelLogsRouter.get('/:id', fuelLogsController.getById);

// POST /api/fuel-logs
fuelLogsRouter.post('/', fuelLogsController.create);

// PUT /api/fuel-logs/:id
fuelLogsRouter.put('/:id', fuelLogsController.update);

// DELETE /api/fuel-logs/:id
fuelLogsRouter.delete('/:id', fuelLogsController.delete);

export default fuelLogsRouter;
