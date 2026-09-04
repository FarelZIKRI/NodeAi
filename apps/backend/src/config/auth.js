import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db.js';
import { env } from './env.js';

/**
 * Inisialisasi Better Auth dengan Drizzle adapter.
 * Menggunakan email + password dan Google OAuth sebagai metode autentikasi.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,   // 7 hari
    updateAge: 60 * 60 * 24,        // Refresh setiap 1 hari
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,               // cache 5 menit
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: false,                // false untuk localhost (http)
      httpOnly: true,
    },
  },
  trustedOrigins: [env.FRONTEND_URL],
});
