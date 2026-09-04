import { Router } from 'express';
import projectRoutes from './project.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

// Mount semua rute (auth ditangani langsung di app.js)
router.use('/projects', projectRoutes);
router.use('/ai', aiRoutes);

export default router;
