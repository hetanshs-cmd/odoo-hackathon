import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.use(requireRole(['FleetManager', 'FinancialAnalyst', 'SafetyOfficer', 'Driver', 'Dispatcher']));

// GET /api/dashboard/stats
dashboardRouter.get('/stats', dashboardController.getStats);

export default dashboardRouter;
