import { db } from '../config/db.js';
import { projects } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

/**
 * ProjectService — Kelas layanan untuk operasi CRUD proyek diagram.
 * Semua metode menerima parameter plain (bukan req/res).
 */
export class ProjectService {
  /**
   * Mendapatkan semua proyek milik seorang pengguna.
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getAllByUser(userId) {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));

    return result;
  }

  /**
   * Mendapatkan satu proyek berdasarkan ID (milik pengguna tertentu).
   * @param {string} userId
   * @param {string} projectId
   * @returns {Promise<object | undefined>}
   */
  async getById(userId, projectId) {
    const result = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1);

    return result[0];
  }

  /**
   * Membuat proyek baru.
   * @param {string} userId
   * @param {{ name: string, description?: string }} data
   * @returns {Promise<object>}
   */
  async create(userId, data) {
    const result = await db
      .insert(projects)
      .values({
        name: data.name,
        description: data.description || '',
        userId,
        nodesData: [],
        edgesData: [],
      })
      .returning();

    return result[0];
  }

  /**
   * Memperbarui proyek yang sudah ada.
   * @param {string} userId
   * @param {string} projectId
   * @param {object} updates - Field yang ingin diperbarui (name, description, nodesData, edgesData).
   * @returns {Promise<object | undefined>}
   */
  async update(userId, projectId, updates) {
    const updateData = { updatedAt: new Date() };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.nodes_data !== undefined) updateData.nodesData = updates.nodes_data;
    if (updates.edges_data !== undefined) updateData.edgesData = updates.edges_data;

    const result = await db
      .update(projects)
      .set(updateData)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning();

    return result[0];
  }

  /**
   * Menghapus proyek.
   * @param {string} userId
   * @param {string} projectId
   * @returns {Promise<object | undefined>}
   */
  async delete(userId, projectId) {
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning();

    return result[0];
  }
}

export const projectService = new ProjectService();
