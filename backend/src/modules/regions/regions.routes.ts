import { Router } from 'express';
import { regionsController } from './regions.controller';
// import { requireAuth } from '../../middleware/requireAuth';

const regionsRouter = Router();

// All region endpoints require authentication (removed for now)
// regionsRouter.use(requireAuth);

regionsRouter.get('/', regionsController.getAll);

export default regionsRouter;
