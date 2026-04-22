import { useState } from 'react';
import AddStudentForm from './components/AddStudentForm/AddStudentForm';
import Sheet from '@/components/ui/Sheet';
import StudentListing from './components/StudentlListing';
import './Students.css';

const Students = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  return (
    <div className="students-page-container">
      <div className="students-header-banner">
        <div className="students-header-content">
          <h1 className="students-title">Student Enrollment</h1>
          <p className="students-subtitle">
            Manage your school's student population. Enroll new students, track their academic progress,
            and keep their records up-to-date and easily accessible.
          </p>
        </div>
        <button
          className="le-button le-button-primary add-student-btn-header"
          onClick={() => setShowAddModal(true)}
        >
          Enroll New Student
        </button>
      </div>

      <div className="students-listing-section">
        <StudentListing onAddClick={() => setShowAddModal(true)} />
      </div>

      <Sheet
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        isSubmitting={isSubmitting}
      >
        <AddStudentForm
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddModal(false)}
          onLoadingChange={setIsSubmitting}
        />
      </Sheet>
    </div>
  );
};

export default Students;