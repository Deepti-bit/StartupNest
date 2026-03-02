import React from 'react';

const StartupSubmissions = () => {
  return (
    <div>
      
      <h1>Startup Submissions for Review</h1>
      
      <button type="button">Logout</button>
      
      <table border="1">
        <thead>
          <tr>
            <th>Startup Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          
          <tr>
            <td>Example Startup</td>
            <td>Fintech</td>
            <td>Pending</td>
            <td><button>Review</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StartupSubmissions;