import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Zap, GitBranch, MessageSquare, Expand,
  ArrowRight, ChevronRight, Workflow
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-brand">
          <div className="navbar-logo">
            <img src="/logo.png" alt="NodeAI Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          </div>
          <span className="navbar-title">NodeAI</span>
        </div>
        <div className="navbar-links">
          <Link to="/login" className="btn btn-ghost btn-sm">Masuk</Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Mulai Gratis <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="hero-badge">
          <span className="hero-badge-dot" />
          AI-Powered Diagram Builder
        </div>

        <h1 className="hero-title">
          Buat <span className="hero-title-gradient">Roadmap & Diagram</span> dalam Hitungan Detik
        </h1>

        <p className="hero-subtitle">
          Visualisasikan ide dan rencana belajar Anda secara otomatis dengan kekuatan AI.
          Tidak perlu desain manual — cukup ketik topik, dan NodeAI yang mengerjakannya.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            <Sparkles size={18} />
            Coba Sekarang — Gratis
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Masuk ke Akun
          </Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">∞</div>
            <div className="hero-stat-label">Diagram Gratis</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">AI</div>
            <div className="hero-stat-label">Powered</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">&lt;10s</div>
            <div className="hero-stat-label">Generate Time</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-label">Fitur Utama</div>
          <h2 className="section-title">Semua yang Kamu Butuhkan</h2>
          <p className="section-subtitle">
            Dari pembuatan manual hingga AI otomatis, NodeAI punya semuanya
            untuk memvisualisasikan ide-idemu.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon feature-icon-purple">
              <Sparkles size={24} />
            </div>
            <h3>AI Roadmap Generator</h3>
            <p>
              Ketik topik & level, lalu AI akan membuat roadmap lengkap
              dengan nodes dan connections yang langsung siap ditampilkan.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-pink">
              <Expand size={24} />
            </div>
            <h3>AI Node Expansion</h3>
            <p>
              Klik satu node, pilih "Expand with AI", dan AI akan
              menambahkan detail sub-langkah secara otomatis. Killer feature!
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-cyan">
              <MessageSquare size={24} />
            </div>
            <h3>Text → Diagram</h3>
            <p>
              Paste teks alur kerja biasa, dan AI akan mengubahnya
              menjadi diagram visual yang indah secara instan.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-blue">
              <GitBranch size={24} />
            </div>
            <h3>Drag & Drop Canvas</h3>
            <p>
              Canvas interaktif berbasis React Flow. Buat, hubungkan,
              dan atur node dengan mudah menggunakan drag & drop.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-green">
              <Zap size={24} />
            </div>
            <h3>Real-time Save</h3>
            <p>
              Semua perubahan tersimpan otomatis. Kembali kapan saja
              dan lanjutkan pekerjaan dari terakhir kali.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-amber">
              <Workflow size={24} />
            </div>
            <h3>Project Management</h3>
            <p>
              Kelola semua proyek diagram di satu tempat. Buat, edit,
              dan organisasi diagram dengan mudah.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>
            Siap Memvisualisasikan Ide-idemu?
          </h2>
          <p>
            Bergabung sekarang dan mulai buat roadmap & diagram pertamamu
            dengan kekuatan AI.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ position: 'relative' }}>
            <Sparkles size={18} />
            Mulai Sekarang
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 NodeAI — AI-Powered Roadmap & Diagram Builder</p>
      </footer>
    </div>
  );
}
