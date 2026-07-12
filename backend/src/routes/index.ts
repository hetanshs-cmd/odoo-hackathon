import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';
import authRouter from '../modules/auth/auth.routes';
import dashboardRouter from '../modules/dashboard/dashboard.routes';
import vehiclesRouter from '../modules/vehicles/vehicles.routes';
import driversRouter from '../modules/drivers/drivers.routes';
import tripsRouter from '../modules/trips/trips.routes';
import maintenanceRouter from '../modules/maintenance/maintenance.routes';
import fuelLogsRouter from '../modules/fuel-logs/fuelLogs.routes';
import expensesRouter from '../modules/expenses/expenses.routes';
import reportsRouter from '../modules/reports/reports.routes';
import settingsRouter from '../modules/settings/settings.routes';
import regionsRouter from '../modules/regions/regions.routes';

/**
 * apiRouter — single aggregation point for all TransitOps API routes.
 *
 * This router is mounted at `/api` in app.ts.
 * Adding a new module requires exactly TWO changes:
 *   1. Import the module's router here.
 *   2. Add a `apiRouter.use('/module-name', moduleRouter)` line.
 *
 * No other file needs to be modified when introducing a new module.
 */
const apiRouter = Router();

// Health check — public, no auth required
apiRouter.get('/health', healthCheck);

// Feature modules — each module owns its own router and sub-routes
apiRouter.use('/auth', authRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/vehicles', vehiclesRouter);
apiRouter.use('/drivers', driversRouter);
apiRouter.use('/trips', tripsRouter);
apiRouter.use('/maintenance', maintenanceRouter);
apiRouter.use('/fuel-logs', fuelLogsRouter);
apiRouter.use('/expenses', expensesRouter);
apiRouter.use('/reports', reportsRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/regions', regionsRouter);

export default apiRouter;
