import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Zap, GitBranch, MessageSquare, Expand,
  ArrowRight, ChevronRight, Workflow
} from 'lucide-react';
import HeroFlow from '../components/HeroFlow';

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
      <section className="hero-section" style={{ overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <HeroFlow />
          {/* Overlay to blur and fade the left side behind the text only */}
          <div style={{ 
            position: 'absolute', 
            top: 0, bottom: 0, left: 0, width: '50%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 60%, transparent 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 60%, transparent 100%)',
            maskImage: 'linear-gradient(90deg, black 0%, black 60%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }} />
        </div>
        
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="hero-container" style={{ pointerEvents: 'none' }}>
          <div className="hero-content">
            <h1 className="hero-title" style={{ pointerEvents: 'auto' }}>
              Visualisasikan ide Anda dengan <span className="hero-title-highlight" style={{ color: 'var(--accent-purple)' }}>NodeAI</span>
            </h1>

            <p className="hero-subtitle" style={{ pointerEvents: 'auto' }}>
              Platform interaktif berbasis AI untuk membuat roadmap belajar dan diagram alur
              secara instan. Tidak perlu desain manual — cukup ketik topik.
            </p>

            <div className="hero-actions" style={{ pointerEvents: 'auto' }}>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: '24px' }}>
                <Zap size={18} /> Mulai Sekarang — Gratis
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg" style={{ borderRadius: '24px' }}>
                <Sparkles size={18} /> Masuk ke Akun
              </Link>
            </div>
          </div>
          
          <div className="hero-flow-placeholder">
            {/* Empty grid space */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-label">Kemampuan NodeAI</div>
          <h2 className="section-title">Satu Platform, Semua Diagram</h2>
          <p className="section-subtitle">
            Dari kanvas kosong hingga roadmap terstruktur berkat kecerdasan buatan. 
            Mewujudkan ide kompleks kini semudah mengetik beberapa kata.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon feature-icon-purple">
              <Sparkles size={24} />
            </div>
            <h3>Generasi AI Instan</h3>
            <p>
              Cukup masukan topik dan tingkat kesulitan, AI khusus penataan ruang kami akan menyusun roadmap Node presisi lengkap dengan relasinya secara langsung.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-pink">
              <Expand size={24} />
            </div>
            <h3>Ekspansi Edge Terarah</h3>
            <p>
              Klik sembarang Node dan paksa AI untuk mencabangkan konsep tersebut ke dalam rantai pemahaman yang jauh lebih spesifik dan detail!
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-cyan">
              <MessageSquare size={24} />
            </div>
            <h3>Prompts Kontekstual</h3>
            <p>
              Ubah paragraf, silabus bebas, atau prompt catatan panjang menjadi pohon visual hierarkis otomatis tanpa perlu merancang dari nol. 
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-blue">
              <GitBranch size={24} />
            </div>
            <h3>Kanvas Responsif Tanpa Batas</h3>
            <p>
              Kanvas super halus bergaya Node-Based yang dapat di Zoom, Pan, dan Drag secara bebas seperti menggunakan figma—dirancang untuk kenyamanan 60FPS.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-green">
              <Zap size={24} />
            </div>
            <h3>Sinkronisasi Cloud Aktif</h3>
            <p>
              Setiap pergeseran, modifikasi, dan penambahan node langsung tersimpan dan direplikasi secara otomatis di ruang penyimpanan aman berbasis Cloud.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-amber">
              <Workflow size={24} />
            </div>
            <h3>Manajemen Proyek Terpusat</h3>
            <p>
              Dasbor berfokus produktivitas untuk mengorganisir riwayat puluhan roadmap karir kamu, dan akses satu klik untuk mendistribusikan diagram.
            </p>
          </div>
        </div>
      </section>

      {/* Quickstart / Terminal Section */}
      <section className="terminal-section" style={{ padding: '100px 24px 60px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: 'linear-gradient(180deg, #1b0a21 0%, #150917 100%)',
          borderRadius: '16px',
          padding: '60px 40px',
          width: '100%',
          maxWidth: '1000px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px', color: '#ff0071' }}>
            Getting Started with NodeAI
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '40px', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Make sure you've registered an account. Then you can generate<br />your first roadmap via our AI Prompt:
          </p>
          
          <div style={{
            background: '#050505',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)',
            margin: '0 auto',
            maxWidth: '650px',
            textAlign: 'left',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              padding: '16px 20px',
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <div style={{ padding: '24px 20px 48px', fontFamily: '"JetBrains Mono", monospace', fontSize: '1rem', color: '#ff0071' }}>
              &gt; Generate Roadmap <span style={{ color: '#e5e7eb' }}>"Cara menjadi Frontend Developer 2026"</span>
            </div>
          </div>
          
          <div style={{ marginTop: '50px' }}>
            <Link to="/register" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}>
              See full Quickstart guide <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="footer">
        <p>© 2026 NodeAI — AI-Powered Roadmap & Diagram Builder</p>
      </footer>
    </div>
  );
}
