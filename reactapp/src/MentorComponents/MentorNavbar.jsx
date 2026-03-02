import React from 'react';
import { Link } from 'react-router-dom';

const MentorNavbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <p>Home</p>
        </li>
        <li>
          <p>Startup Profiles</p>
        </li>
        <li>
          
          <button onClick={() => console.log('Logging out...')}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default MentorNavbar;