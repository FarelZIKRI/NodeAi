import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ProjectContext = createContext(null);

const API_BASE = '/api/projects';

/**
 * Helper fetch yang otomatis menyertakan credentials dan Content-Type.
 */
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request gagal (${res.status})`);
  }

  return data;
}

export function ProjectProvider({ children }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiFetch(API_BASE);
      setProjects(data || []);
    } catch (err) {
      console.error('Gagal memuat proyek:', err);
      toast.error('Gagal memuat proyek');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createProject = async (name, description = '') => {
    if (!user) return null;
    try {
      const data = await apiFetch(API_BASE, {
        method: 'POST',
        body: JSON.stringify({ name, description }),
      });

      setProjects(prev => [data, ...prev]);
      toast.success('Proyek berhasil dibuat!');
      return data;
    } catch (err) {
      console.error('Gagal membuat proyek:', err);
      toast.error('Gagal membuat proyek');
      return null;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await apiFetch(`${API_BASE}/${projectId}`, {
        method: 'DELETE',
      });

      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Proyek berhasil dihapus');
    } catch (err) {
      console.error('Gagal menghapus proyek:', err);
      toast.error('Gagal menghapus proyek');
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      const data = await apiFetch(`${API_BASE}/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      setProjects(prev => prev.map(p => p.id === projectId ? data : p));
      return data;
    } catch (err) {
      console.error('Gagal memperbarui proyek:', err);
      toast.error('Gagal memperbarui proyek');
      return null;
    }
  };

  const getProject = async (projectId) => {
    try {
      const data = await apiFetch(`${API_BASE}/${projectId}`);
      return data;
    } catch (err) {
      console.error('Gagal memuat proyek:', err);
      return null;
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      fetchProjects,
      createProject,
      deleteProject,
      updateProject,
      getProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects harus digunakan di dalam ProjectProvider');
  return context;
}
