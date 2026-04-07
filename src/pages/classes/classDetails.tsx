import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, User, ChevronRight, LayoutGrid, BookOpen } from 'lucide-react';
import { useGetClassesQuery, useGetArmsQuery, useDeleteArmMutation, CATEGORY_OPTIONS } from '@/services/leApi/classApi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AddArmForm from './components/AddArmForm/AddArmForm';
import AssignSubjectsToClass from './components/AssignSubjectsToClass/AssignSubjectsToClass';
import { useGetStaffQuery } from '@/services/leApi/staffApi';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
import './Classes.css';

const ClassArmsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [armToDelete, setArmToDelete] = useState<any>(null);
  const { data: classes = [] } = useGetClassesQuery();
  const { data: arms = [], isLoading: armsLoading } = useGetArmsQuery(classId || '');
  const { data: allStaff = [] } = useGetStaffQuery();
  const teachers = allStaff.filter(s => s.isTeachingStaff);
  const [deleteArm] = useDeleteArmMutation();

  // Find current class name
  const currentClass = classes.find(c => c.id === (classId || ''));
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

      <div className="classes-listing-section">
        <div className="class-tabs-card">
          <Tabs defaultValue="arms" className="w-full">
            <TabsList className="class-tabs-list">
              <TabsTrigger value="arms" className="class-tabs-trigger">
                <LayoutGrid size={18} />
                Class Arms
              </TabsTrigger>
              <TabsTrigger value="subjects" className="class-tabs-trigger">
                <BookOpen size={18} />
                Assigned Subjects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="arms" className="class-tabs-content">
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
                <div className="classes-table-container">
                  <table className="classes-table">
                    <thead>
                      <tr>
                        <th>Arm Name</th>
                        <th>Students Enrolled</th>
                        <th>Capacity</th>
                        <th>Class Master</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arms.map((arm: any) => {
                        const master = arm.classMasterId ? teachers.find(t => t.id === arm.classMasterId) : null;
                        return (
                          <tr
                            key={arm.id}
                            onClick={() => navigate(`/classes/${classId}/arms/${arm.id}`, {
                              state: {
                                className: currentClass?.name,
                                armName: arm.name,
                                capacity: arm.capacity
                              }
                            })}
                          >
                            <td data-label="Arm Name">
                              <div className="class-name-cell">
                                <span className="class-name-text">
                                  {currentClass?.name} : {arm.name}
                                </span>
                              </div>
                            </td>
                            <td data-label="Enrollment">
                              <span className="admission-no-badge" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbfcce' }}>
                                {arm._count?.students || 0} Student{arm._count?.students !== 1 ? 's' : ''}
                              </span>
                            </td>
                            <td data-label="Capacity">
                              {arm.capacity ? (
                                <span className="arm-capacity-badge">
                                  Max: {arm.capacity}
                                </span>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Open</span>
                              )}
                            </td>
                            <td data-label="Class Master">
                              {master ? (
                                <div className="arm-master-tag" style={{ marginTop: 0, display: 'inline-flex' }}>
                                  <User size={12} />
                                  <span>{master.user.firstName} {master.user.lastName}</span>
                                </div>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Unassigned</span>
                              )}
                            </td>
                            <td data-label="Actions" style={{ textAlign: 'right' }}>
                              <div className="class-table-actions">
                                <button
                                  className="chevron-action-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/classes/${classId}/arms/${arm.id}`);
                                  }}
                                >
                                  <ChevronRight size={18} />
                                </button>
                                <button
                                  className="delete-action-btn"
                                  onClick={(e) => handleDeleteClick(e, arm)}
                                  title="Delete Arm"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="subjects" className="class-tabs-content">
              <AssignSubjectsToClass
                classId={classId || ''}
                assignedSubjects={currentClass?.subjects || []}
              />
            </TabsContent>
          </Tabs>
        </div>
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

