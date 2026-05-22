import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ requiredPermission }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect blocked admins to dashboard
  if (user.role !== 'superadmin' && user.status !== 'active' && window.location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
