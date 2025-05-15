import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login page with return path
        const currentPath = window.location.pathname;
        window.location.href = `/admin/login?returnTo=${encodeURIComponent(currentPath)}`;
      } else if (adminOnly && !isAdmin) {
        // Redirect non-admin users to home page
        window.location.href = '/';
      }
    }
  }, [user, loading, isAdmin, adminOnly]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated and proper role
  if (user && (!adminOnly || isAdmin)) {
    return children;
  }

  return null;
};

export default PrivateRoute; 