// PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../Services/api'; 
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ allowedRoles }) => {
    const token = getAccessToken(); 
    const { user } = useAuth();

    // 1. If no token, go to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. If we have a token but App.js is still fetching user data, wait
    if (!user) {
        return null; // Or a spinner
    }

    // 3. Case-Insensitive Role Check
    const hasAccess = allowedRoles.some(
        (role) => role.toLowerCase() === user.role?.toLowerCase()
    );

    if (allowedRoles && !hasAccess) {
        console.warn(`Access Denied. User role: ${user.role}, Allowed: ${allowedRoles}`);
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;