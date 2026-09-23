import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect ke dashboard sesuai role
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'guru') return <Navigate to="/guru/dashboard" replace />;
  }

  return children;
}
