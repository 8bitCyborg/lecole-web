import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useGetStudentsByArmQuery } from '@/services/leApi/armsApi';
import '@/pages/students/components/StudentlListing/StudentListing.css';
import '../../Classes.css';

interface EnrolledStudentsProps {
  currentArmName: string;
}

const EnrolledStudents = ({ currentArmName }: EnrolledStudentsProps) => {
  const { armId } = useParams<{ armId: string }>();
  const navigate = useNavigate();

  const { data: students = [], isLoading } = useGetStudentsByArmQuery(armId!);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(students.length / itemsPerPage);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return students.slice(start, start + itemsPerPage);
  }, [students, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [armId]);

  if (!currentArmName) return null;

  return (
    <div className="arm-students-section">

      {isLoading && <div className="loading-state">Loading students...</div>}

      {!isLoading && students.length === 0 && (
        <div className="classes-empty-state" style={{ background: 'white', padding: '4rem' }}>
          <div className="empty-state-icon">🎓</div>
          <h2 className="empty-state-title">No Students Assigned</h2>
          <p className="empty-state-description">
            There are currently no students assigned to this arm.
          </p>
        </div>
      )}

      {!isLoading && students.length > 0 && (
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
              {paginatedStudents.map((student: any) => (
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

          {totalPages > 1 && (
            <div className="table-pagination">
              <div className="pagination-info">
                Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to <span>{Math.min(currentPage * itemsPerPage, students.length)}</span> of <span>{students.length}</span> students
              </div>
              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  title="Previous Page"
                >
                  <ChevronLeft size={20} color="#00b0ff" />
                </button>
                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`pagination-page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  title="Next Page"
                >
                  <ChevronRight size={20} color="#00b0ff" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default EnrolledStudents;
