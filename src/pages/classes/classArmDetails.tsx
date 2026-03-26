import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import './Classes.css';

const ClassArmDetails = () => {
  const { classId, armId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Use state data passed from previous page
  const state = location.state as { className?: string; armName?: string; capacity?: number };

  const currentClass = { name: state?.className || 'Class' };
  const currentArm = { name: state?.armName || '', capacity: state?.capacity };

  const handleBack = () => {
    navigate(`/classes/${classId}`);
  };

  return (
    <div className="classes-page-container">
      <button
        className="back-navigator-btn"
        onClick={handleBack}
      >
        <ArrowLeft size={18} />
        Back to {currentClass?.name || 'Class'}
      </button>

      <div className="classes-header-banner">
        <div className="classes-header-content">
          <h1 className="classes-title">
            {currentClass?.name} <span className="arm-header-separator">:</span> {currentArm?.name}
          </h1>
          <div className="classes-meta-info">
            <span className="class-id-badge">{currentClass?.name}</span>
            <span className="class-id-badge">{currentArm?.name} Subclass</span>
            <span className="class-id-badge">ID: {armId}</span>
          </div>
          <p className="classes-subtitle">
            Manage the specifics of this subclass arm. This section allows for detailed student monitoring,
            teacher assignments, and specialized curriculum tracking for <strong>{currentClass?.name} {currentArm?.name}</strong>.
          </p>
        </div>
        <div className="banner-actions">
          <button className="le-button le-button-secondary">
            <Edit size={16} style={{ marginRight: '8px' }} />
            Configure Arm
          </button>
        </div>
      </div>

      <div className="classes-listing-section">
        {!currentArm.name && (
          <div className="classes-empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h2 className="empty-state-title">Subclass Arm Not Found</h2>
            <p className="empty-state-description">
              The arm you are looking for might have been removed or the URL is incorrect.
            </p>
            <button
              className="le-button le-button-primary add-class-btn-empty"
              onClick={handleBack}
            >
              Back to Class Overview
            </button>
          </div>
        )}

        {currentArm.name && (
          <div className="arm-details-grid">
            <div className="class-card">
              <div className="class-card-content">
                <div className="arm-info">
                  <h3 className="section-title">Arm Capacity</h3>
                  <p className="section-value">{currentArm.capacity || 'Not Set'}</p>
                </div>
              </div>
            </div>

            <div className="class-card">
              <div className="class-card-content">
                <div className="arm-info">
                  <h3 className="section-title">Students Enrolled</h3>
                  <p className="section-value">0 / {currentArm.capacity || '∞'}</p>
                </div>
              </div>
            </div>

            <div className="class-card">
              <div className="class-card-content">
                <div className="arm-info">
                  <h3 className="section-title">Assigned Teacher</h3>
                  <p className="section-value">None Assigned</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassArmDetails;