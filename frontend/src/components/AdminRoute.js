import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/register" replace />;
  }

  // Check user role
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        return children;
      } else {
        // If user is not admin, redirect to dashboard
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      return <Navigate to="/register" replace />;
    }
  }
  
  return <Navigate to="/register" replace />;
};

export default AdminRoute;

