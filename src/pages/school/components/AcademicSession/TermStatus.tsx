import React, { useState } from 'react';
import type { School, Term } from '@/services/leApi/schoolApi';
import { useUpdateSchoolMutation } from '@/services/leApi/schoolApi';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal/DeleteConfirmationModal';

interface TermStatusProps {
  school: School;
  term: Term | undefined;
}

const TermStatus: React.FC<TermStatusProps> = ({ school, term }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

  const isTermActive = school?.currentTermId === term?.id;

  const handleEndTerm = async () => {
    if (!school?.id) return;
    try {
      await updateSchool({
        id: school.id,
        currentTermId: null
      }).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to end term:', error);
    }
  };

  return (
    <>
      <div className="data-display-group">
        <div className="data-display-label">Term Status</div>
        <div className="term-status-control">
          {isTermActive ? (
            <div className="active-status-container">
              <span className="status-badge active">
                <span className="dot" /> Active
              </span>
              <button
                type="button"
                className="le-button le-button-secondary end-term-btn"
                onClick={() => setIsModalOpen(true)}
                disabled={isUpdating}
              >
                {isUpdating ? 'Unsetting...' : 'End Current Term'}
              </button>
            </div>
          ) : (
            <span className="status-badge inactive">Inactive / Past Term</span>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        title="End Academic Term"
        confirmText="End Term"
        cancelText="Cancel"
        variant="danger"
        message={
          <div style={{ lineHeight: '1.6' }}>
            Are you sure you want to end <strong>{term?.identifier}</strong>?
            <br />
            This action officially closes the term. All academic activities including grading, attendance, and report card generation will be finalized and moved to the archives.
            <br />
            Once concluded, this term will be read-only and uneditable.
          </div>
        }
        onConfirm={handleEndTerm}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default TermStatus;
