import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2 } from 'lucide-react';
import { useGetClassesQuery, useDeleteClassMutation } from '../../services/leApi/classApi';
import AddClassForm from './components/AddClassForm';
import DeleteConfirmationModal from '../../components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
import './Classes.css';

const ClassPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<any>(null);
  const { data: classes = [] } = useGetClassesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [deleteClass] = useDeleteClassMutation();
  const navigate = useNavigate();

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, cls: any) => {
    e.stopPropagation();
    setClassToDelete(cls);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (classToDelete) {
      try {
        await deleteClass(classToDelete.id).unwrap();
        setShowDeleteModal(false);
        setClassToDelete(null);
      } catch (error) {
        console.error('Failed to delete class:', error);
      }
    }
  };

  return (
    <div className="classes-page-container">
      <div className="classes-header-banner">
        <div className="classes-header-content">
          <h1 className="classes-title">Manage Your Classes</h1>
          <p className="classes-subtitle">
            Efficiently organize your school's academic structure. Create and manage all classes,
            track student distribution, and assign teachers to their respective departments.
          </p>
        </div>
        <button
          className="le-button le-button-primary add-class-btn-header"
          onClick={() => setShowAddModal(true)}
        >
          Add New Class
        </button>
      </div>

      <div className="classes-listing-section">
        {classes.length === 0 ? (
          <div className="classes-empty-state">
            <div className="empty-state-icon">🏫</div>
            <h2 className="empty-state-title">No Classes Created Yet</h2>
            <p className="empty-state-description">
              Start by creating your first class. Once added, your classes will appear here for easy management
              and student enrollment.
            </p>
            <button
              className="le-button le-button-primary add-class-btn-empty"
              onClick={() => setShowAddModal(true)}
            >
              Get Started – Add a Class
            </button>
          </div>
        ) : (
          <div className="classes-grid">
            {classes.map((cls: any) => (
              <div
                key={cls.id}
                className="class-card"
                onClick={() => navigate(`/classes/${cls.id}`)}
              >
                <div className="class-card-content">
                  <div className="class-name-title class-card-actions">
                    <div className="class-info-main">
                      {cls.name}
                      <div className="class-meta-counts">
                        <span className="class-arms-count">
                          {cls._count?.arms || 0} {cls._count?.arms === 1 ? 'Arm' : 'Arms'}
                        </span>
                        <span className="class-arms-count">
                          {cls._count?.subjects || 0} {cls._count?.subjects === 1 ? 'Subject' : 'Subjects'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="class-card-icon" />
                  </div>
                  <Trash2
                    size={20}
                    className="class-card-icon delete-icon"
                    color="red"
                    onClick={(e) => handleDeleteClick(e, cls)}
                  />
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
            <AddClassForm
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title={`Delete Class: ${classToDelete?.name}`}
        message={
          <>
            <p>Are you sure you want to delete this class? This action cannot be undone.</p>
            <div className="delete-impact-notice">
              <p><strong>Impact:</strong></p>
              <ul>
                <li>All <strong>Arms</strong> under this class will be permanently deleted.</li>
                <li>All <strong>Students</strong> assigned to this class will be unassigned.</li>
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

export default ClassPage;