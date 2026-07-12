import { Router } from 'express';
import { aiController } from './ai.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const aiRouter = Router();

aiRouter.use(requireAuth);
aiRouter.use(requireRole(['FleetManager', 'Dispatcher']));

aiRouter.post('/chat', aiController.chat);

export default aiRouter;
