import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './style.css';

const Overview: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="overview-container">
      <header className="dashboard-header">
        <h1>Welcome back, {user?.firstName}!</h1>
        <p>Your account overview and details.</p>
      </header>

      <div className="user-info-grid">
        <div className="info-card">
          <span className="info-label">Current Role</span>
          <span className="info-value">{user?.role}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Email Address</span>
          <span className="info-value">{user?.email}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Phone Number</span>
          <span className="info-value">{user?.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default Overview;

