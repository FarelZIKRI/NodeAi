import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './env.js';
import * as schema from '../db/schema.js';

/**
 * Koneksi ke PostgreSQL menggunakan driver postgres.js dan Drizzle ORM.
 * SSL diaktifkan otomatis jika menggunakan Neon (atau DATABASE_URL mengandung sslmode=require).
 */
const requireSsl =
  env.DATABASE_URL.includes('neon.tech') ||
  env.DATABASE_URL.includes('sslmode=require') ||
  process.env.NODE_ENV === 'production';

const client = postgres(env.DATABASE_URL, {
  ssl: requireSsl ? 'require' : false,
  max: 10,
});

export const db = drizzle(client, { schema });
