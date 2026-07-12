import { Router } from 'express';
import { fuelLogsController } from './fuelLogs.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const fuelLogsRouter = Router();

fuelLogsRouter.use(requireAuth);

// GET /api/fuel-logs
fuelLogsRouter.get('/', fuelLogsController.getAll);

// GET /api/fuel-logs/:id
fuelLogsRouter.get('/:id', fuelLogsController.getById);

// POST /api/fuel-logs
fuelLogsRouter.post('/', requireRole(['FleetManager', 'Driver']), fuelLogsController.create);

// PUT /api/fuel-logs/:id
fuelLogsRouter.put('/:id', requireRole(['FleetManager', 'Driver']), fuelLogsController.update);

// DELETE /api/fuel-logs/:id
fuelLogsRouter.delete('/:id', requireRole(['FleetManager']), fuelLogsController.delete);

export default fuelLogsRouter;
