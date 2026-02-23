import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Workflow, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Harap isi semua field');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Gagal masuk');
    } else {
      toast.success('Berhasil masuk!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page" style={{ position: 'relative' }}>
      <Link to="/" className="btn btn-ghost" style={{ position: 'absolute', top: 24, left: 16 }}>
        <ArrowLeft size={18} style={{ marginRight: 6 }} /> Kembali
      </Link>
      <div className="auth-container" style={{ marginTop: 24 }}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="navbar-logo"><img src="/logo.png" alt="NodeAI Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} /></div>
            NodeAI
          </Link>
          <h1>Selamat Datang Kembali</h1>
          <p>Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">
                <Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">
                <Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  style={{ width: '100%', paddingRight: 44 }}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: 8 }}
            >
              {loading ? (
                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              ) : (
                <>Masuk <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Belum punya akun?{' '}
          <Link to="/register">Daftar sekarang</Link>
        </div>
      </div>
    </div>
  );
}
