import React from 'react';
import type { School } from '../../../store/slices/schoolSlice';

interface SchoolDetailsCardProps {
  school: School | null;
}

const SchoolDetailsCard: React.FC<SchoolDetailsCardProps> = ({ school }) => {
  return (
    <div className="school-info-card">
      <h3>School Details</h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Email</span>
          <span className="info-value">{school?.email}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Phone</span>
          <span className="info-value">{school?.phone}</span>
        </div>
        <div className="info-item">
          <span className="info-label">State</span>
          <span className="info-value">{school?.state}</span>
        </div>
        <div className="info-item">
          <span className="info-label">LGA</span>
          <span className="info-value">{school?.lga || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetailsCard;
