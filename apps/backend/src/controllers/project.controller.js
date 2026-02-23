import { projectService } from '../services/project.service.js';

/**
 * ProjectController — Menangani request/response HTTP untuk modul proyek.
 */
export class ProjectController {
  /**
   * GET /api/projects — Daftar proyek milik pengguna.
   */
  async getAll(req, res, next) {
    try {
      const data = await projectService.getAllByUser(req.user.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/projects/:projectId — Detail satu proyek.
   */
  async getById(req, res, next) {
    try {
      const project = await projectService.getById(req.user.id, req.params.projectId);

      if (!project) {
        return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
      }

      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/projects — Membuat proyek baru.
   */
  async create(req, res, next) {
    try {
      const project = await projectService.create(req.user.id, req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/projects/:projectId — Memperbarui proyek.
   */
  async update(req, res, next) {
    try {
      const project = await projectService.update(req.user.id, req.params.projectId, req.body);

      if (!project) {
        return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
      }

      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/projects/:projectId — Menghapus proyek.
   */
  async delete(req, res, next) {
    try {
      const project = await projectService.delete(req.user.id, req.params.projectId);

      if (!project) {
        return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
      }

      res.json({ message: 'Proyek berhasil dihapus.', project });
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
