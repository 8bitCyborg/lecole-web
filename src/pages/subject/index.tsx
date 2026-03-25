import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2 } from 'lucide-react';
import { useGetSubjectsQuery, useDeleteSubjectMutation } from '../../services/leApi/subjectApi';
import AddSubjectForm from './components/AddSubjectForm';
import DeleteConfirmationModal from '../../components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
import './Subjects.css';

const SubjectPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<any>(null);
  const { data: subjects = [], isLoading } = useGetSubjectsQuery();
  const [deleteSubject] = useDeleteSubjectMutation();

  const navigate = useNavigate();

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, sub: any) => {
    e.stopPropagation();
    setSubjectToDelete(sub);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (subjectToDelete) {
      try {
        await deleteSubject(subjectToDelete.id).unwrap();
        setShowDeleteModal(false);
        setSubjectToDelete(null);
      } catch (error) {
        console.error('Failed to delete subject:', error);
      }
    }
  };

  return (
    <div className="subjects-page-container">
      <div className="subjects-header-banner">
        <div className="subjects-header-content">
          <h1 className="subjects-title">Academic Curriculum</h1>
          <p className="subjects-subtitle">
            Manage your school's curriculum by adding, updating, and organizing subjects.
            Define clear subject codes and names to streamline teacher assignments and
            student progress tracking.
          </p>
        </div>
        <button
          className="le-button le-button-primary add-subject-btn-header"
          onClick={() => setShowAddModal(true)}
        >
          Add New Subject
        </button>
      </div>

      <div className="subjects-listing-section">
        {isLoading && (
          <div className="loading-state">Loading subjects...</div>
        )}

        {!isLoading && subjects.length === 0 && (
          <div className="subjects-empty-state">
            <div className="empty-state-icon">📚</div>
            <h2 className="empty-state-title">No Subjects Added Yet</h2>
            <p className="empty-state-description">
              Start building your curriculum by adding your first subject.
              Once added, they will be available for class assignments.
            </p>
            <button
              className="le-button le-button-primary add-subject-btn-empty"
              onClick={() => setShowAddModal(true)}
            >
              Add First Subject
            </button>
          </div>
        )}

        {!isLoading && subjects.length > 0 && (
          <div className="subjects-grid">
            {subjects.map((sub: any) => (
              <div
                key={sub.id}
                className="subject-card"
                onClick={() => navigate(`/subjects/${sub.id}`)}
              >
                <div className="subject-card-content">
                  <div className="subject-info-main">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="subject-name-title">{sub.name}</span>
                      {sub.code && <span className="subject-code">{sub.code}</span>}
                    </div>
                    <ChevronRight size={20} className="class-card-icon" />
                  </div>
                  <div className="subject-card-actions">
                    <Trash2
                      size={18}
                      className="subject-card-icon delete-icon"
                      color="red"
                      onClick={(e) => handleDeleteClick(e, sub)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
            <AddSubjectForm
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title={`Delete Subject: ${subjectToDelete?.name}`}
        message={
          <>
            <p>Are you sure you want to delete this subject? This action cannot be undone.</p>
            <div className="delete-impact-notice">
              <p><strong>Impact:</strong></p>
              <ul>
                <li>This subject will be removed from all class curriculums.</li>
                <li>Historic academic records for this subject will be preserved but no new records can be created.</li>
              </ul>
            </div>
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default SubjectPage;