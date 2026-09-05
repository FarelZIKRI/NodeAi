import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = '/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek session saat pertama kali load
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch(`${API_BASE}/get-session`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data?.user ?? null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Gagal cek sesi:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

const getErrorMessage = (data) => {
  if (!data) return 'Terjadi kesalahan pada server';
  if (data.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
    return 'Email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk.';
  }
  if (data.code === 'INVALID_EMAIL_OR_PASSWORD' || data.code === 'INVALID_EMAIL' || data.code === 'INVALID_PASSWORD') {
    return 'Email atau password salah';
  }
  if (data.code === 'PASSWORD_TOO_SHORT') {
    return 'Password terlalu pendek (minimal 8 karakter)';
  }
  return data.message || 'Gagal memproses permintaan';
};

  const signUp = async (email, password, name) => {
    try {
      const res = await fetch(`${API_BASE}/sign-up/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: getErrorMessage(data) } };
      }

      setUser(data.user);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/sign-in/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: getErrorMessage(data) } };
      }

      setUser(data.user);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signOut = async () => {
    try {
      const res = await fetch(`${API_BASE}/sign-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({}),
      });
      
      if (!res.ok) {
        console.error('Gagal sign-out:', await res.text());
      }
      
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error: { message: error.message } };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const callbackURL = `${window.location.origin}/dashboard`;

      // Better Auth v1.7+ menggunakan query params untuk social sign-in
      const url = new URL(`${backendUrl}/api/auth/sign-in/social`);
      url.searchParams.set('provider', 'google');
      url.searchParams.set('callbackURL', callbackURL);

      // Coba POST dengan query params dulu
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ provider: 'google', callbackURL }),
      });

      // Kalau response adalah redirect langsung (3xx), ikuti redirect
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else if (res.ok || data?.redirect) {
        window.location.href = callbackURL;
      } else {
        console.error('Tidak ada URL redirect dari server:', data);
      }
    } catch (err) {
      console.error('Gagal login dengan Google:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return context;
}
