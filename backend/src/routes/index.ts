import { Router } from 'express';
import authRoutes from './auth.routes.js';
import processRoutes from './process.routes.js';
import departmentRoutes from './department.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import adminRoutes from './admin.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/processes', processRoutes);
router.use('/', departmentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);

export default router;
