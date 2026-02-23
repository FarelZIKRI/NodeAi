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
        return { data: null, error: { message: data.message || 'Gagal mendaftar' } };
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
        return { data: null, error: { message: data.message || 'Email atau password salah' } };
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

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return context;
}
