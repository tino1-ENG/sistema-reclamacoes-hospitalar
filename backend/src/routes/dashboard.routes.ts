import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/metrics', authenticate, dashboardController.getMetrics);

export default router;
