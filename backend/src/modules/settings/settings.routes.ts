import { Router } from 'express';
import { settingsController } from './settings.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const settingsRouter = Router();

settingsRouter.use(requireAuth);
settingsRouter.use(requireRole(['FleetManager']));

// GET /api/settings
settingsRouter.get('/', settingsController.getSettings);

// PUT /api/settings
settingsRouter.put('/', settingsController.updateSettings);

export default settingsRouter;
