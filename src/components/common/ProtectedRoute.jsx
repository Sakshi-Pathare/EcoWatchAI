import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSkeleton } from './LoadingSkeleton';

export function ProtectedRoute({ roles, children }) {
  const { user, loading, loadError } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSkeleton count={3} height="h-20" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div role="alert" className="max-w-xl mx-auto px-4 py-16 text-center card-paper p-8 rounded-2xl m-4">
        <h1 className="text-xl font-bold text-rose-900">Session Verification Error</h1>
        <p className="mt-2 text-sm text-[#556E55]">{loadError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-[#092421] px-5 py-2.5 text-xs font-black text-[#74D7CB] hover:bg-[#123632]"
        >
          Retry Session
        </button>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // If not authorized for this specific role, navigate to their own dashboard
    const destination = user.role === 'citizen' ? '/dashboard' : '/admin';
    return <Navigate to={destination} replace />;
  }

  return children;
}
