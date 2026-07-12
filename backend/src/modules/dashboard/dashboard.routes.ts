import { Router } from 'express';
import { dashboardController } from './dashboard.controller';

const dashboardRouter = Router();

// GET /api/dashboard/stats
dashboardRouter.get('/stats', dashboardController.getStats);

export default dashboardRouter;
