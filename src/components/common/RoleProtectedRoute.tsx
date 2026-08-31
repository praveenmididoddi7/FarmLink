import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: (UserRole | string)[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass p-8 rounded-3xl border border-white/80 shadow-md text-center space-y-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-emerald-950">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize transport role check
  const isAuthorized = allowedRoles.some(r => {
    if (r === 'transport' || r === 'transporter') {
      return user.role === 'transport' || (user.role as any) === 'transporter';
    }
    return user.role === r;
  });

  if (!isAuthorized) {
    // Redirect to user's authorized home screen
    if (user.role === 'farmer') {
      return <Navigate to="/farmer/dashboard" replace />;
    } else if (user.role === 'buyer') {
      return <Navigate to="/marketplace" replace />;
    } else if (user.role === 'transport' || (user.role as any) === 'transporter') {
      return <Navigate to="/transporter/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
