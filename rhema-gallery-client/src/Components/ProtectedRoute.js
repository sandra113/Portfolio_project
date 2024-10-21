// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token'); // Check for the presence of a token

  // If token is not found, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children; 
};

export default ProtectedRoute;
