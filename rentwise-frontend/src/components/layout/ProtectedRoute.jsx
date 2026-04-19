import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('rentwise_token');
  const role = localStorage.getItem('rentwise_role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect to correct dashboard based on actual role
    if (role === 'Landlord') return <Navigate to="/landlord/dashboard" replace />;
    if (role === 'Tenant') return <Navigate to="/tenant/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
