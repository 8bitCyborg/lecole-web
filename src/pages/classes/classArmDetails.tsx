import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Users, BarChart3 } from 'lucide-react';
import ClassMaster from './components/ClassMaster';
import AddArmForm from './components/AddArmForm/AddArmForm';
// import { useGetArmsQuery } from '@/services/leApi/classApi';
import './Classes.css';

const ClassArmDetails = () => {
  const { classId, armId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const state = location.state as { className?: string; armName?: string; capacity?: number };

  const currentClass = { name: state?.className || 'Class' };
  const currentArm = {
    name: state?.armName || '',
    capacity: state?.capacity
  };

  const handleBack = () => {
    navigate(`/classes/${classId}`);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
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
            {currentClass?.name}{currentArm?.name}
          </h1>

          <p className="classes-subtitle" style={{ maxWidth: '600px' }}>
            Manage the specifics of this arm. This section allows for detailed student monitoring,
            class master assignments, and specialized curriculum tracking for <strong>{currentClass?.name} {currentArm?.name}</strong>.
          </p>
          <div className="classes-meta-info banner-stats-row">
            <div className="banner-stat-item">
              <BarChart3 size={16} className="stat-icon" />
              <div className="stat-label-group">
                <span className="stat-label">Capacity</span>
                <span className="stat-value">{currentArm.capacity || 'Not Set'}</span>
              </div>
            </div>
            <div className="banner-stat-item">
              <Users size={16} className="stat-icon" />
              <div className="stat-label-group">
                <span className="stat-label">Enrolled</span>
                <span className="stat-value">0 / {currentArm.capacity || '∞'}</span>
              </div>
            </div>
            {classId && armId && (
              <ClassMaster classId={classId} armId={armId} />
            )}
          </div>
        </div>

        <button
          className="le-button le-button-primary add-class-btn-header"
          onClick={() => setShowEditModal(true)}
          style={{ zIndex: 10 }}
        >
          <Edit size={16} style={{ marginRight: '8px' }} />
          Update Arm
        </button>
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
          <div className="arm-tabs-placeholder" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Students and scheduling tabs content will appear here.</p>
          </div>
        )}
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowEditModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AddArmForm
              classId={classId || ''}
              armId={armId}
              isEdit={true}
              initialValues={{
                name: currentArm.name,
                capacity: currentArm.capacity,
              }}
              onSuccess={handleEditSuccess}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassArmDetails;