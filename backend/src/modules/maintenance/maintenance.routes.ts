import { Router } from 'express';
import { maintenanceController } from './maintenance.controller';

const maintenanceRouter = Router();

// Maintenance endpoints — authentication is omitted per user request

// GET /api/maintenance (All authenticated)
maintenanceRouter.get('/', maintenanceController.getAll);

// GET /api/maintenance/active (FM, DR)
maintenanceRouter.get('/active', maintenanceController.getActive);

// GET /api/maintenance/:id (All authenticated)
maintenanceRouter.get('/:id', maintenanceController.getById);

// POST /api/maintenance (FM only)
maintenanceRouter.post('/', maintenanceController.create);

// PUT /api/maintenance/:id (FM only)
maintenanceRouter.put('/:id', maintenanceController.update);

// PATCH /api/maintenance/:id/status (FM only)
maintenanceRouter.patch('/:id/status', maintenanceController.updateStatus);

// DELETE /api/maintenance/:id (FM only)
maintenanceRouter.delete('/:id', maintenanceController.delete);

export default maintenanceRouter;
