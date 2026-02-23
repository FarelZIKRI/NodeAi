import { Router } from 'express';
import { z } from 'zod';
import { projectController } from '../controllers/project.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

// Semua rute proyek memerlukan autentikasi
router.use(requireAuth);

// Skema validasi
const createProjectSchema = z.object({
  name: z.string().min(1, 'Nama proyek wajib diisi').max(100),
  description: z.string().max(500).optional().default(''),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  nodes_data: z.any().optional(),
  edges_data: z.any().optional(),
});

// Routes
router.get('/', (req, res, next) => projectController.getAll(req, res, next));
router.get('/:projectId', (req, res, next) => projectController.getById(req, res, next));
router.post('/', validate(createProjectSchema), (req, res, next) => projectController.create(req, res, next));
router.put('/:projectId', validate(updateProjectSchema), (req, res, next) => projectController.update(req, res, next));
router.delete('/:projectId', (req, res, next) => projectController.delete(req, res, next));

export default router;
