import React, { useState } from 'react';
import { useGetClassesQuery, useDeleteClassMutation } from '../../services/leApi/classApi';
import AddClassForm from './classComponents/AddClassForm/AddClassForm';
import Sheet from '@/components/ui/Sheet';
import ClassListing from './classComponents/ClassListing';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
// import emptyClassesIllustration from '@/assets/empty-classes.png';
import './Classes.css';

const ClassPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<any>(null);
  const { data: classMap = [] } = useGetClassesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const classes = classMap;

  const [deleteClass] = useDeleteClassMutation();

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
            track student distribution, and assign staff to their respective departments.
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
            {/* <img
              src={emptyClassesIllustration}
              alt="No classes"
              className="ac-empty-illustration"
            /> */}
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
          <ClassListing
            classes={classes}
            onDeleteClick={handleDeleteClick}
          />
        )}
      </div>

      <Sheet
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        isSubmitting={isSubmitting}
      // maxWidth="50rem"
      >
        <AddClassForm
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddModal(false)}
          onLoadingChange={setIsSubmitting}
        />
      </Sheet>

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