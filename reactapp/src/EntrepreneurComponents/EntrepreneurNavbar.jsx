import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EntrepreneurNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    navigate('/login');
  };

  return (
    <nav className="entrepreneur-navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">AppLogo</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/mentor-opportunities">Mentor Opportunities</Link>
        </li>
        <li>
          <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default EntrepreneurNavbar;