import { Router } from 'express';
import { reportsController } from './reports.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const reportsRouter = Router();

reportsRouter.use(requireAuth);
reportsRouter.use(requireRole(['FleetManager', 'FinancialAnalyst', 'SafetyOfficer']));

// GET /api/reports/revenue
reportsRouter.get('/revenue', reportsController.getRevenue);

// GET /api/reports/expenses
reportsRouter.get('/expenses', reportsController.getExpenses);

// GET /api/reports/fuel
reportsRouter.get('/fuel', reportsController.getFuel);

// GET /api/reports/trips
reportsRouter.get('/trips', reportsController.getTrips);

// GET /api/reports/fleet
reportsRouter.get('/fleet', reportsController.getFleet);

// GET /api/reports/drivers
reportsRouter.get('/drivers', reportsController.getDrivers);

// GET /api/reports/maintenance
reportsRouter.get('/maintenance', reportsController.getMaintenance);

export default reportsRouter;
