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
            Define clear subject codes and names to streamline staff assignments and
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

        {!isLoading && subjects?.length > 0 && (
          <div className="subjects-table-container">
            <table className="subjects-table">
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Code</th>
                  <th>Classes</th>
                  <th>Teachers</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub: any) => (
                  <tr
                    key={sub.id}
                    onClick={() => navigate(`/subjects/${sub.id}`)}
                  >
                    <td data-label="Subject Name">
                      <div className="subject-name-cell">
                        <span className="subject-name-text">{sub.name}</span>
                      </div>
                    </td>
                    <td data-label="Code">
                      <span className="subject-code-text">{sub.code || '—'}</span>
                    </td>
                    <td data-label="Classes">
                      {sub._count?.classes || 0} {sub._count?.classes === 1 ? 'Class' : 'Classes'}
                    </td>
                    <td data-label="Teachers">
                      {sub._count?.staff || 0} {sub._count?.staff === 1 ? 'Teacher' : 'Teachers'}
                    </td>
                    <td data-label="Actions" style={{ textAlign: 'right' }}>
                      <div className="subject-table-actions">
                        <button
                          className="chevron-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/subjects/${sub.id}`);
                          }}
                        >
                          <ChevronRight size={18} className="subject-table-icon" color='#00f' />
                        </button>
                        <button
                          className="delete-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(e, sub);
                          }}
                        >
                          <Trash2 size={18} color='#f00' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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