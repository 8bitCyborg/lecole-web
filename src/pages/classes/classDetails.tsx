import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, User } from 'lucide-react';
import { useGetClassesQuery, useGetArmsQuery, useDeleteArmMutation, CATEGORY_OPTIONS } from '@/services/leApi/classApi';
import AddArmForm from './components/AddArmForm/AddArmForm';
import AssignSubjectsToClass from './components/AssignSubjectsToClass/AssignSubjectsToClass';
import { useGetTeachingStaffQuery } from '@/services/leApi/staffApi';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
import './Classes.css';

const ClassArmsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [armToDelete, setArmToDelete] = useState<any>(null);
  const { data: classMap = {} } = useGetClassesQuery();
  const { data: arms = [], isLoading: armsLoading } = useGetArmsQuery(classId || '');
  const { data: teacherMap = {} } = useGetTeachingStaffQuery();
  const [deleteArm] = useDeleteArmMutation();

  // Find current class name
  const currentClass = classMap[classId || ''];
  const categoryLabel = CATEGORY_OPTIONS.find(opt => opt.value === currentClass?.category)?.label || currentClass?.category;

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, arm: any) => {
    e.stopPropagation();
    setArmToDelete(arm);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (armToDelete && classId) {
      try {
        await deleteArm({ classId, armId: armToDelete.id }).unwrap();
        setShowDeleteModal(false);
        setArmToDelete(null);
      } catch (error) {
        console.error('Failed to delete arm:', error);
      }
    }
  };

  return (
    <div className="classes-page-container">
      <button
        className="back-navigator-btn"
        onClick={() => navigate('/classes')}
      >
        <ArrowLeft size={18} />
        Back to Classes
      </button>
      <div className="classes-header-banner">
        <div className="classes-header-content">
          <h1 className="classes-title">{currentClass?.name || 'Class Details'}</h1>
          <div className="classes-meta-info">
            <span className="class-id-badge">{categoryLabel}</span>
            {/* {categoryLabel && <span className="class-category-tag">{categoryLabel}</span>} */}
          </div>

          <p className="classes-subtitle">
            This is the hub for arm-level distribution, student assignments, and class-specific scheduling. <br />
            Currently managing <strong>{arms.length} {arms.length === 1 ? 'arm' : 'arms'}</strong>.
          </p>
        </div>
        <button
          className="le-button le-button-primary add-class-btn-header"
          onClick={() => setShowAddModal(true)}
        >
          Add New Arm
        </button>
      </div>

      <AssignSubjectsToClass
        classId={classId || ''}
        assignedSubjects={currentClass?.subjects || []}
      />

      <div className="classes-listing-section">
        {armsLoading && <div className="loading-state">Loading Arms...</div>}

        {!armsLoading && arms.length === 0 && (
          <div className="classes-empty-state">
            <div className="empty-state-icon">📂</div>
            <h2 className="empty-state-title">No Arms Defined Yet</h2>
            <p className="empty-state-description">
              Create different arms or sections for this class (e.g., A, B, Gold, Silver) to begin student enrollment at the arm level.
            </p>
            <button
              className="le-button le-button-primary add-class-btn-empty"
              onClick={() => setShowAddModal(true)}
            >
              Create Your First Arm
            </button>
          </div>
        )}

        {!armsLoading && arms.length > 0 && (
          <div className="classes-grid">
            {arms.map((arm: any) => (
              <div
                key={arm.id}
                className="class-card"
                onClick={() => navigate(`/classes/${classId}/arms/${arm.id}`, {
                  state: {
                    className: currentClass?.name,
                    armName: arm.name,
                    capacity: arm.capacity
                  }
                })}
                style={{ cursor: 'pointer' }}
              >
                <div className="class-card-content">
                  <div className="arm-info">
                    <h3 className="class-name-title">
                      {currentClass?.name} <span style={{ color: '#aaa', margin: '0 4px' }}>:</span> {arm.name}
                    </h3>
                    {arm.capacity && (
                      <span className="arm-capacity-badge">
                        Capacity: {arm.capacity}
                      </span>
                    )}
                    {arm.classMasterId && teacherMap[arm.classMasterId] && (
                      <div className="arm-master-tag">
                        <User size={12} />
                        <span>{teacherMap[arm.classMasterId].user.firstName} {teacherMap[arm.classMasterId].user.lastName}</span>
                      </div>
                    )}
                  </div>
                  <Trash2
                    size={20}
                    className="class-card-icon delete-icon"
                    color="red"
                    onClick={(e) => handleDeleteClick(e, arm)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AddArmForm
              classId={classId || ''}
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title={`Delete Arm: ${currentClass?.name} - ${armToDelete?.name}`}
        message={
          <>
            <p>Are you sure you want to delete this arm? This action cannot be undone.</p>
            <div className="delete-impact-notice">
              <p><strong>Impact:</strong></p>
              <ul>
                <li>All <strong>Students</strong> assigned to this arm will be unassigned.</li>
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

export default ClassArmsPage;

