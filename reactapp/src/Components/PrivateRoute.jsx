import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../Services/api'; 
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ allowedRoles }) => {
    const token = getAccessToken(); 
    const { user } = useAuth();

    // 1. If there is no token at all, send to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. IMPORTANT: If token exists but user data hasn't arrived in Context yet,
    // show nothing (or a small spinner) instead of redirecting to /home.
    if (!user) {
        return null; 
    }

    // 3. DEBUGGING: Uncomment the line below to see exactly what is failing
    // console.log("Current User Role:", user.role, "Allowed:", allowedRoles);

    // 4. THE ROLE CHECK (Case-Insensitive Fix)
    // We convert everything to lowercase to prevent "Entrepreneur" vs "entrepreneur" bugs
    const hasAccess = allowedRoles.some(role => 
        role.toLowerCase() === user.role?.toLowerCase()
    );

    if (allowedRoles && !hasAccess) {
        return <Navigate to="/home" replace />;
    }

    // 5. Everything is valid, show the page
    return <Outlet />;
};

export default PrivateRoute;