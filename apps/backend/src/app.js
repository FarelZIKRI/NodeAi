import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// ===========================
// Middleware Global
// ===========================

// CORS — izinkan request dari frontend
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// Parse JSON body
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded body  
app.use(express.urlencoded({ extended: true }));

// ===========================
// Routes
// ===========================

// Health check dan root
app.get('/', (_req, res) => {
  res.json({ message: 'Selamat datang di Backend API NodeAI', version: '1.0.0' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Semua API route
app.use('/api', routes);

// ===========================
// Error Handler (harus terakhir)
// ===========================
app.use(errorHandler);

export default app;
