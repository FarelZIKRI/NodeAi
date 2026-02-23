import { pgTable, text, timestamp, boolean, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ===========================
// Tabel-tabel Better Auth
// ===========================

/**
 * Tabel `user` — dikelola oleh Better Auth.
 * Jangan ubah nama kolom kecuali Anda menyesuaikan mapping di Better Auth.
 */
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Tabel `session` — dikelola oleh Better Auth.
 */
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

/**
 * Tabel `account` — dikelola oleh Better Auth.
 */
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Tabel `verification` — dikelola oleh Better Auth.
 */
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// ===========================
// Tabel Aplikasi (Projects)
// ===========================

/**
 * Tabel `projects` — menyimpan data proyek diagram/roadmap.
 * `nodes_data` dan `edges_data` disimpan sebagai JSONB.
 */
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(''),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  nodesData: jsonb('nodes_data').default([]),
  edgesData: jsonb('edges_data').default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ===========================
// Relations
// ===========================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  projects: many(projects),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const projectRelations = relations(projects, ({ one }) => ({
  user: one(user, { fields: [projects.userId], references: [user.id] }),
}));
