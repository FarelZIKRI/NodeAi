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
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variabel environment tidak valid:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
