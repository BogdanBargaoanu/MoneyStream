import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  return !!localStorage.getItem('user-token');
};

const PrivateRoute = ({ component: Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;