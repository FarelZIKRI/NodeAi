import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CanvasPage from './pages/CanvasPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#7c3aed',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/canvas/:projectId" element={<ProtectedRoute><CanvasPage /></ProtectedRoute>} />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
