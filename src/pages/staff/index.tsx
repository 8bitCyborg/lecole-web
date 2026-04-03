import React, { useState } from 'react';
import AddStaffForm from './components/AddStaffForm';
import StaffListing from './components/StaffListing';
import './Staff.css';
import { useGetStaffQuery, useGetTeachingStaffQuery } from '../../services/leApi/staffApi';

interface StaffPageProps {
  onlyTeaching?: boolean;
}

const StaffPage: React.FC<StaffPageProps> = ({ onlyTeaching }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const allStaffResult = useGetStaffQuery(undefined, {
    skip: !!onlyTeaching,
    refetchOnMountOrArgChange: true,
  });

  const teachingStaffResult = useGetTeachingStaffQuery(undefined, {
    skip: !onlyTeaching,
    refetchOnMountOrArgChange: true,
  });

  const { data: staff = [], isLoading } = onlyTeaching ? teachingStaffResult : allStaffResult;

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  return (
    <div className="staff-page-container">
      <div className="staff-header-banner">
        <div className="staff-header-content">
          <h1 className="staff-title">
            {onlyTeaching ? 'Teaching Faculty' : 'Our Dedicated Staff'}
          </h1>
          <p className="staff-subtitle">
            {onlyTeaching
              ? 'Manage and view all registered teaching staff'
              : "Streamline your institutional staff and faculty management in one place."
            }
          </p>
        </div>
        <button
          className="le-button le-button-primary add-staff-btn-header"
          onClick={() => setShowAddModal(true)}
        >
          Add New Staff
        </button>
      </div>

      <div className="staff-listing-section">
        {isLoading && <div className="loading-state">Loading {onlyTeaching ? 'teachers' : 'staff'}...</div>}

        {!isLoading && staff.length === 0 && (
          <div className="staff-empty-state">
            <div className="empty-state-icon">👨‍🏫</div>
            <h2 className="empty-state-title">No {onlyTeaching ? 'Teaching' : ''} Staff Registered</h2>
            <p className="empty-state-description">
              Start building your school's faculty by adding your first {onlyTeaching ? 'teaching' : 'staff'} member.
            </p>
            {!onlyTeaching && (
              <button
                className="le-button le-button-primary"
                onClick={() => setShowAddModal(true)}
              >
                Get Started – Add a Staff Member
              </button>
            )}
          </div>
        )}

        {!isLoading && staff.length > 0 && <StaffListing onlyTeaching={onlyTeaching} />}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AddStaffForm
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;