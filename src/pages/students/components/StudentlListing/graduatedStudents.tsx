import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, GraduationCap } from 'lucide-react';
import { useGetGraduatedStudentsQuery } from '@/services/leApi/studentApi';
import '../../Students.css';

const GraduatedStudents = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading } = useGetGraduatedStudentsQuery({ page, limit });

  const students = response?.data || [];
  const totalPages = response?.totalPages || 0;
  const totalStudents = response?.total || 0;

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (isLoading) {
    return <div className="loading-state">Loading alumni records...</div>;
  }

  if (students.length === 0 && page === 1) {
    return (
      <div className="students-empty-state">
        <div className="empty-state-icon">
          <GraduationCap size={64} />
        </div>
        <h2 className="empty-state-title">No Alumni Yet</h2>
        <p className="empty-state-description">
          Students who have successfully graduated from the institution will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="students-table-container">
      <table className="students-table">
        <thead>
          <tr className="students-table-header">
            <th>Alumni Name</th>
            <th>Admission No.</th>
            <th>Gender</th>
            <th>Final Class & Arm</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student: any) => (
            <tr
              key={student.id}
              onClick={() => navigate(`/students/${student.id}`)}
            >
              <td data-label="Alumni Name">
                <div className="student-name-cell">
                  <div className="student-avatar graduated-avatar">
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
              <td data-label="Final Class & Arm">
                <div className="student-class-info">
                  <span className="class-name">{student.class?.name || 'N/A'}</span>
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
                    title="View Alumni Profile"
                  >
                    <ChevronRight size={18} className="student-table-icon" />
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
            Showing <span>{(page - 1) * limit + 1}</span> to <span>{Math.min(page * limit, totalStudents)}</span> of <span>{totalStudents}</span> alumni students
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
    </div>
  );
};

export default GraduatedStudents;
