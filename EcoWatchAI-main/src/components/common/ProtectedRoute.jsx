import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { LoadingSkeleton } from './LoadingSkeleton.jsx';

export function ProtectedRoute({ roles, children }) {
  const { user, loading, loadError } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-10"><LoadingSkeleton count={2} height="h-20" /></div>;
  }
  if (loadError) {
    return (
      <div role="alert" className="max-w-xl mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-bold text-rose-900">Unable to verify your session</h1>
        <p className="mt-2 text-sm text-charcoal-700">{loadError}</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-forest-800 px-4 py-2 text-sm font-bold text-white">Retry</button>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!roles.includes(user.role)) {
    const destination = user.role === 'citizen'
      ? '/dashboard'
      : user.role === 'super_admin'
        ? '/superadmin'
        : '/admin';
    return <Navigate to={destination} replace />;
  }
  return children;
}
