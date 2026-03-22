import React from 'react';
import type { School } from '../../../store/slices/schoolSlice';

interface SchoolDetailsCardProps {
  school: School | null;
}

const SchoolDetailsCard: React.FC<SchoolDetailsCardProps> = ({ school }) => {
  const formatValue = (val: string | null | undefined) => {
    if (!val) return 'N/A';
    return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="school-details-wrapper">
      <div className="school-info-card">
        <h3>Academic Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">School Type</span>
            <span className="info-value">{formatValue(school?.type)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Curriculum</span>
            <span className="info-value">{formatValue(school?.curriculum)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Grading System</span>
            <span className="info-value">{formatValue(school?.grading_system)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Current Term</span>
            <span className="info-value">{formatValue(school?.current_term)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Current Session</span>
            <span className="info-value">{school?.current_session || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="school-info-card">
        <h3>Institutional Profile</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Ownership</span>
            <span className="info-value">{formatValue(school?.ownership_type)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Proprietor / Owner</span>
            <span className="info-value">{school?.proprietor || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date of Inception</span>
            <span className="info-value">{formatDate(school?.date_of_inception)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Motto</span>
            <span className="info-value italic-motto">{school?.motto ? `"${school.motto}"` : 'N/A'}</span>
          </div>
          {school?.website && (
            <div className="info-item">
              <span className="info-label">Website</span>
              <span className="info-value">
                <a href={school.website} target="_blank" rel="noopener noreferrer" className="school-web-link">
                  {school.website.replace(/^https?:\/\//, '')}
                </a>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolDetailsCard;
