import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db.js';
import { env } from './env.js';

/**
 * Inisialisasi Better Auth dengan Drizzle adapter.
 * Menggunakan email + password sebagai metode autentikasi utama.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,   // 7 hari
    updateAge: 60 * 60 * 24,        // Refresh setiap 1 hari
  },
  trustedOrigins: [env.FRONTEND_URL],
});
