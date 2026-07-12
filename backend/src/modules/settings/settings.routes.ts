import { Router } from 'express';
import { settingsController } from './settings.controller';

const settingsRouter = Router();

// Settings endpoints

// GET /api/settings
settingsRouter.get('/', settingsController.getSettings);

// PUT /api/settings
settingsRouter.put('/', settingsController.updateSettings);

export default settingsRouter;
