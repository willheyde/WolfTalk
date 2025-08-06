// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <div className="text-center text-gray-600 mt-20">Loading...</div>;
  }

  if (!user) {
    const target = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/Shibboleth.sso/Login?target=${target}`} replace />;
  }

  return children;
}
