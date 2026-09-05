import { config } from 'dotenv';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Muat .env dari root monorepo (../../..) dan juga dari apps/backend (..)
config({ path: path.resolve(__dirname, '../../../../.env') });
config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Validasi environment variables menggunakan Zod.
 * Jika ada variabel yang kurang, server akan langsung crash dengan pesan jelas.
 */
const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL wajib diisi'),
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET wajib diisi'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3001'),
  GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY wajib diisi'),
  AI_GATEWAY_API_KEY: z.string().optional(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID wajib diisi'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET wajib diisi'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  console.error('Variabel environment tidak valid:', errors);
  // Throw error instead of process.exit() agar serverless function bisa
  // mengembalikan error response daripada crash total
  throw new Error(`Missing env vars: ${Object.keys(errors).join(', ')}`);
}

export const env = parsed.data;
