import { useState } from 'react';
import AddTeacherForm from './components/AddTeacherForm';
import TeacherListing from './components/TeacherListing';
import './Teachers.css';

import { useGetTeachersQuery } from '../../services/leApi/teacherApi';

const TeacherPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: teachers = [], isLoading } = useGetTeachersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  return (
    <div className="teachers-page-container">
      <div className="teachers-header-banner">
        <div className="teachers-header-content">
          <h1 className="teachers-title">Our Dedicated Faculty</h1>
          <p className="teachers-subtitle">
            Streamline your staff management. <br />
            Easily onboard teachers, maintain up-to-date records, and track teaching loads from class to class.
          </p>
        </div>
        <button
          className="le-button le-button-primary add-teacher-btn-header"
          onClick={() => setShowAddModal(true)}
        >
          Add New Teacher
        </button>
      </div>

      <div className="teachers-listing-section">
        {isLoading ? (
          <div className="loading-state">Loading teachers...</div>
        ) : teachers.length === 0 ? (
          <div className="teachers-empty-state">
            <div className="empty-state-icon">👨‍🏫</div>
            <h2 className="empty-state-title">No Teachers Registered</h2>
            <p className="empty-state-description">
              Start building your school's faculty by adding your first teacher. Once added,
              you can assign them to classes and subjects.
            </p>
            <button
              className="le-button le-button-primary add-teacher-btn-empty"
              onClick={() => setShowAddModal(true)}
            >
              Get Started – Add a Teacher
            </button>
          </div>
        ) : (
          <TeacherListing teachers={teachers} />
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
            <AddTeacherForm
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPage;