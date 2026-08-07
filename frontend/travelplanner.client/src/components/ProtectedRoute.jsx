import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Stiti rute koje zahtevaju prijavu. Ako je zadata prop adminOnly,
// dodatno trazi Admin ulogu.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="page-center">Učitavanje...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}