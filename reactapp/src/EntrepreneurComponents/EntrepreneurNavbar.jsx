import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EntrepreneurNavbar.css';

const EntrepreneurNavbar = () => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Assuming user details are stored in localStorage after login (Page 15)
    const username = localStorage.getItem('userName') || 'Entrepreneur';
    const role = localStorage.getItem('role') || 'Entrepreneur';

    const handleLogout = () => {
        // Clear session data
        localStorage.clear();
        // Close modal and redirect to login page (Page 43)
        setShowLogoutModal(false);
        navigate('/user/login');
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    <Link to="/home">STARTUPNEST</Link>
                </div>

                <div className="user-profile-info">
                    <span>{username} / {role}</span>
                </div>

                <div className="nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/mentor-opportunities">Mentor Opportunities</Link>
                    <Link to="/my-submissions">My Submissions</Link>
                    <button 
                        className="logout-btn" 
                        onClick={() => setShowLogoutModal(true)}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Logout Confirmation Modal (Page 43) */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Are you sure you want to logout?</h3>
                        <div className="modal-buttons">
                            <button className="confirm-btn" onClick={handleLogout}>Yes, Logout</button>
                            <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EntrepreneurNavbar;