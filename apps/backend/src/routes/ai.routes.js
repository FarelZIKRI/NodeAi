import { Router } from 'express';
import { z } from 'zod';
import { aiController } from '../controllers/ai.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

// Semua rute AI memerlukan autentikasi
router.use(requireAuth);

// Skema validasi
const generateRoadmapSchema = z.object({
  topic: z.string().min(1, 'Topik wajib diisi'),
  level: z.string().min(1, 'Level wajib diisi'),
  goal: z.string().min(1, 'Tujuan wajib diisi'),
});

const expandNodeSchema = z.object({
  nodeLabel: z.string().min(1),
  nodeDescription: z.string().optional().default(''),
  existingNodes: z.array(z.any()).optional().default([]),
});

const convertTextSchema = z.object({
  text: z.string().min(1, 'Teks wajib diisi'),
});

const chatSchema = z.object({
  message: z.string().min(1, 'Pesan wajib diisi'),
  chatHistory: z.array(z.any()).optional().default([]),
  existingNodes: z.array(z.any()).optional().default([]),
});

// Routes
router.post('/generate-roadmap', validate(generateRoadmapSchema), (req, res, next) => aiController.generateRoadmap(req, res, next));
router.post('/expand-node', validate(expandNodeSchema), (req, res, next) => aiController.expandNode(req, res, next));
router.post('/convert-text', validate(convertTextSchema), (req, res, next) => aiController.convertText(req, res, next));
router.post('/chat', validate(chatSchema), (req, res, next) => aiController.chat(req, res, next));

export default router;
