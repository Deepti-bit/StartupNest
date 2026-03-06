import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// IMPORT the getter from your api service
import { getAccessToken } from '../Services/api'; 

const PrivateRoute = ({ allowedRoles }) => {
    // Check the MEMORY variable, not localStorage
    const token = getAccessToken(); 
    const role = localStorage.getItem('role');

    // If no token in memory, send to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Check if the user's role is allowed for this route
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;