import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Users, BarChart3, ChevronRight, Plus } from 'lucide-react';
import ClassMaster from './components/ClassMaster';
import AddArmForm from './components/AddArmForm/AddArmForm';
import AddStudentForm from '../students/components/AddStudentForm/AddStudentForm';
import { useGetStudentsByArmQuery } from '@/services/leApi/classApi';
import './Classes.css';
import '../students/components/StudentlListing/StudentListing.css';

const ClassArmDetails = () => {
  const { classId, armId } = useParams<{ classId: string; armId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const state = location.state as { className?: string; armName?: string; capacity?: number };

  const { data: students = [], isLoading } = useGetStudentsByArmQuery(armId!);

  const currentClass = { name: state?.className || 'Class' };
  const currentArm = {
    name: state?.armName || '',
    capacity: state?.capacity
  };

  const handleBack = () => {
    navigate(`/classes/${classId}`);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
  };

  const handleEnrollSuccess = () => {
    setShowEnrollModal(false);
  };

  return (
    <div className="classes-page-container">
      <button
        className="back-navigator-btn"
        onClick={handleBack}
      >
        <ArrowLeft size={18} />
        Back to {currentClass?.name || 'Class'}
      </button>

      <div className="classes-header-banner">
        <div className="classes-header-content">
          <h1 className="classes-title">
            {currentClass?.name}{currentArm?.name}
          </h1>

          <p className="classes-subtitle" style={{ maxWidth: '600px' }}>
            Manage the specifics of this arm. This section allows for detailed student monitoring,
            class master assignments, and specialized curriculum tracking for <strong>{currentClass?.name} {currentArm?.name}</strong>.
          </p>
          <div className="classes-meta-info banner-stats-row">
            <div className="banner-stat-item">
              <BarChart3 size={16} className="stat-icon" />
              <div className="stat-label-group">
                <span className="stat-label">Capacity</span>
                <span className="stat-value">{currentArm.capacity || 'Not Set'}</span>
              </div>
            </div>
            <div className="banner-stat-item">
              <Users size={16} className="stat-icon" />
              <div className="stat-label-group">
                <span className="stat-label">Enrolled</span>
                <span className="stat-value">{students.length} / {currentArm.capacity || '∞'}</span>
              </div>
            </div>
            {classId && armId && (
              <ClassMaster classId={classId} armId={armId} />
            )}
          </div>
        </div>

        <button
          className="le-button le-button-primary add-class-btn-header"
          onClick={() => setShowEditModal(true)}
          style={{ zIndex: 10 }}
        >
          <Edit size={16} style={{ marginRight: '8px' }} />
          Update Arm
        </button>
      </div>

      <div className="classes-listing-section">
        {!currentArm.name && (
          <div className="classes-empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h2 className="empty-state-title">Subclass Arm Not Found</h2>
            <p className="empty-state-description">
              The arm you are looking for might have been removed or the URL is incorrect.
            </p>
            <button
              className="le-button le-button-primary add-class-btn-empty"
              onClick={handleBack}
            >
              Back to Class Overview
            </button>
          </div>
        )}

        {currentArm.name && (
          <div className="arm-students-section">
            <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="listing-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a' }}>
                Enrolled Students
              </h2>
              <button
                className="le-button le-button-primary"
                onClick={() => setShowEnrollModal(true)}
              >
                <Plus size={16} style={{ marginRight: '8px' }} />
                Enroll Student
              </button>
            </div>

            {isLoading ? (
              <div className="loading-state">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="classes-empty-state" style={{ background: 'white', padding: '4rem' }}>
                <div className="empty-state-icon">🎓</div>
                <h2 className="empty-state-title">No Students Assigned</h2>
                <p className="empty-state-description">
                  There are currently no students assigned to this arm.
                </p>
              </div>
            ) : (
              <div className="students-table-container">
                <table className="students-table">
                  <thead>
                    <tr className="students-table-header">
                      <th>Student Name</th>
                      <th>Admission No.</th>
                      <th>Gender</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student: any) => (
                      <tr
                        key={student.id}
                        onClick={() => navigate(`/students/${student.id}`)}
                      >
                        <td data-label="Student Name">
                          <div className="student-name-cell">
                            <div className="student-avatar">
                              {student.user.firstName[0]}{student.user.lastName[0]}
                            </div>
                            <div className="student-info">
                              <span className="student-name-text">
                                {student.user.firstName} {student.user.lastName}
                              </span>
                              <span className="student-email-text">{student.user.email || 'No Email'}</span>
                            </div>
                          </div>
                        </td>
                        <td data-label="Admission No.">
                          <span className="admission-no-badge">{student.admissionNumber}</span>
                        </td>
                        <td data-label="Gender">
                          <span className={`gender-tag ${student.gender.toLowerCase()}`}>
                            {student.gender}
                          </span>
                        </td>
                        <td data-label="Status">
                          <span className={`status-tag status-${student.status.toLowerCase()}`}>
                            {student.status}
                          </span>
                        </td>
                        <td data-label="Actions" style={{ textAlign: 'right' }}>
                          <button
                            className="chevron-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/students/${student.id}`);
                            }}
                          >
                            <ChevronRight size={18} className="student-table-icon" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowEditModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AddArmForm
              classId={classId || ''}
              armId={armId}
              isEdit={true}
              initialValues={{
                name: currentArm.name,
                capacity: currentArm.capacity,
              }}
              onSuccess={handleEditSuccess}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}

      {showEnrollModal && (
        <div className="modal-overlay" onClick={() => setShowEnrollModal(false)}>
          <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowEnrollModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AddStudentForm
              initialValues={{
                classId: classId,
                armId: armId
              }}
              onSuccess={handleEnrollSuccess}
              onCancel={() => setShowEnrollModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassArmDetails;