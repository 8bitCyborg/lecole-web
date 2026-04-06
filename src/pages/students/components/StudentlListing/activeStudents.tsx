import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2, ChevronLeft } from 'lucide-react';
import { useGetActiveStudentsQuery, useWithdrawStudentMutation } from '@/services/leApi/studentApi';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
import '../../Students.css';

interface ActiveStudentsProps {
  onAddClick: () => void;
}

const ActiveStudents: React.FC<ActiveStudentsProps> = ({ onAddClick }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading } = useGetActiveStudentsQuery({ page, limit });
  const [withdrawStudent] = useWithdrawStudentMutation();

  const students = response?.data || [];
  const totalPages = response?.totalPages || 0;
  const totalStudents = response?.total || 0;

  const handleDeleteClick = (e: React.MouseEvent, student: any) => {
    e.stopPropagation();
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        await withdrawStudent(studentToDelete.id).unwrap();
        setShowDeleteModal(false);
        setStudentToDelete(null);
      } catch (error) {
        console.error('Failed to withdraw student:', error);
      }
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (isLoading) {
    return <div className="loading-state">Loading students...</div>;
  }

  if (students.length === 0 && page === 1) {
    return (
      <div className="students-empty-state">
        <div className="empty-state-icon">🎓</div>
        <h2 className="empty-state-title">No Students Enrolled Yet</h2>
        <p className="empty-state-description">
          Start building your student database by enrolling your first student.
        </p>
        <button
          className="le-button le-button-primary"
          onClick={onAddClick}
        >
          Get Started – Enroll a Student
        </button>
      </div>
    );
  }

  return (
    <div className="students-table-container">
      <table className="students-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Admission No.</th>
            <th>Gender</th>
            <th>Class & Arm</th>
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
              <td data-label="Class & Arm">
                <div className="student-class-info">
                  <span className="class-name">{student.class?.name || 'Unassigned'}</span>
                  <span className="arm-name">{student.arm?.name || ''}</span>
                </div>
              </td>
              <td data-label="Actions" style={{ textAlign: 'right' }}>
                <div className="student-table-actions">
                  <button
                    className="chevron-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/students/${student.id}`);
                    }}
                  >
                    <ChevronRight size={18} className="student-table-icon" />
                  </button>
                  <button
                    className="delete-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(e, student);
                    }}
                    title="Withdraw Student"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination-footer">
          <div className="pagination-info">
            Showing <span>{(page - 1) * limit + 1}</span> to <span>{Math.min(page * limit, totalStudents)}</span> of <span>{totalStudents}</span> students
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <div className="page-indicator">
              Page <span>{page}</span> of {totalPages}
            </div>
            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title={`Withdraw Student: ${studentToDelete?.user?.firstName} ${studentToDelete?.user?.lastName}`}
        message={
          <>
            <p>Are you sure you want to withdraw this student? Their academic history will be preserved.</p>
            <div className="delete-impact-notice">
              <p><strong>Status Update:</strong></p>
              <ul>
                <li>The student's enrollment status will change to <strong>WITHDRAWN</strong>.</li>
                <li>They will be removed from their current class and arm.</li>
                <li>Historical records (grades, payments) will remain accessible.</li>
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

export default ActiveStudents;
