import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../config/auth.js';

const router = Router();

/**
 * Better Auth menyediakan catch-all handler untuk semua rute auth.
 * Semua request ke /api/auth/* akan ditangani oleh Better Auth secara otomatis.
 *
 * Endpoint yang disediakan oleh Better Auth (contoh):
 * - POST /api/auth/sign-up/email
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-out
 * - GET  /api/auth/session
 */
router.all('/*', toNodeHandler(auth));

export default router;
