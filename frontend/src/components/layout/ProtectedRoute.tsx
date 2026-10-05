import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '../../features/auth/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

/**
 * Renders children only when:
 *   1. The user is authenticated.
 *   2. The user's role matches `requiredRole`.
 *
 * Otherwise redirects:
 *   - Unauthenticated → /login (preserves attempted URL)
 *   - Wrong role      → their own portal root
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Avoid flicker — render nothing until session is resolved
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== requiredRole) {
    // Redirect to user's own portal
    const home: Record<UserRole, string> = {
      STUDENT: '/student/dashboard',
      TEACHER: '/teacher/dashboard',
      ADMIN: '/admin/dashboard',
    };
    return <Navigate to={home[user.role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
