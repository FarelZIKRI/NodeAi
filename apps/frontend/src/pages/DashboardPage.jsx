import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import {
  Plus, LogOut, Workflow, Trash2, Calendar, GitBranch,
  FolderOpen, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { projects, loading, fetchProjects, createProject, deleteProject } = useProjects();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const project = await createProject(newName.trim(), newDesc.trim());
    setCreating(false);
    if (project) {
      setShowModal(false);
      setNewName('');
      setNewDesc('');
      navigate(`/canvas/${project.id}`);
    }
  };

  const handleDelete = async (projectId) => {
    await deleteProject(projectId);
    setDeleteId(null);
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-left">
          <div className="navbar-logo"><img src="/logo.png" alt="NodeAI Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} /></div>
          <span className="navbar-title">NodeAI</span>
        </div>
        <div className="dashboard-nav-right">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Halo, {userName}
          </span>
          <div className="user-avatar">{userInitial}</div>
          <button
            className="btn btn-ghost btn-icon"
            onClick={async () => {
              await signOut();
              toast.success('Berhasil keluar akun', { icon: '👋' });
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
            }}
            title="Keluar"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Proyek Saya</h1>
            <p>Kelola semua roadmap dan diagram Anda</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Cari proyek..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36, width: 220 }}
              />
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Proyek Baru
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: 300 }}>
            <div className="spinner" />
          </div>
        ) : filteredProjects.length === 0 && !search ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FolderOpen size={64} strokeWidth={1} />
            </div>
            <h3>Belum Ada Proyek</h3>
            <p>Buat proyek pertama Anda dan mulai memvisualisasikan ide!</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Buat Proyek Pertama
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            <div className="new-project-card" onClick={() => setShowModal(true)}>
              <div className="new-project-icon">
                <Plus size={24} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Proyek Baru</span>
            </div>

            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => navigate(`/canvas/${project.id}`)}
              >
                <div className="project-card-header">
                  <div
                    className="project-card-icon"
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      color: 'var(--accent-purple-light)',
                    }}
                  >
                    <GitBranch size={20} />
                  </div>
                  <div className="project-card-actions">
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(project.id);
                      }}
                      title="Hapus proyek"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3>{project.name}</h3>
                <p className="project-card-desc">
                  {project.description || 'Tidak ada deskripsi'}
                </p>
                <div className="project-card-meta">
                  <span>
                    <Calendar size={12} />
                    {formatDate(project.updated_at || project.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Buat Proyek Baru</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="input-group">
                  <label htmlFor="projectName">Nama Proyek</label>
                  <input
                    id="projectName"
                    type="text"
                    className="input-field"
                    placeholder="contoh: Roadmap Belajar React"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="projectDesc">Deskripsi (opsional)</label>
                  <textarea
                    id="projectDesc"
                    className="input-field textarea-field"
                    placeholder="Deskripsi singkat proyek..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating || !newName.trim()}>
                  {creating ? 'Membuat...' : 'Buat Proyek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Hapus Proyek?</h2>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)' }}>
                Apakah Anda yakin ingin menghapus proyek ini?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Batal</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
