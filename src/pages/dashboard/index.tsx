import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="page dashboard">
      <h1>Your Dashboard</h1>
      <p>Welcome back! Here's an overview of your progress.</p>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">12</span>
          <span className="stat-label">Courses Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">85%</span>
          <span className="stat-label">Average Score</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">4</span>
          <span className="stat-label">Active Enrollments</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
