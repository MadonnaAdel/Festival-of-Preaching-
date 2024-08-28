import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('tOkeen#1b3Jx&2024');
    const isAuthenticated = !!token;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
