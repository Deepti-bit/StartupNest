import React from 'react';

const ViewStartupOpportunities = () => {
  // Mock data for the table
  const opportunities = [
    { id: 1, name: 'Tech Bloom', sector: 'AI', amount: '$50k' },
    { id: 2, name: 'Green Earth', sector: 'Sustainability', amount: '$100k' },
  ];

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="view-opportunities-container">
      <nav>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h2>Available Startup Opportunities</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Startup Name</th>
            <th>Sector</th>
            <th>Funding Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => (
            <tr key={opp.id}>
              <td>{opp.name}</td>
              <td>{opp.sector}</td>
              <td>{opp.amount}</td>
              <td><button>View Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewStartupOpportunities;