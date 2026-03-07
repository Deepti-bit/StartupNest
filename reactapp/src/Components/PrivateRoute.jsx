import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../Services/api'; 

const PrivateRoute = ({ allowedRoles }) => {
    const token = getAccessToken(); 
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;