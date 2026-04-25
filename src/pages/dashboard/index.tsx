import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './style.css';

const Overview: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="overview-container">
      <header className="dashboard-header">
        <h1>Welcome back, {user?.firstName}!</h1>
      </header>
    </div>
  );
};

export default Overview;

