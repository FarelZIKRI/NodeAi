import { Router } from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

// Mount semua rute
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/ai', aiRoutes);

export default router;
