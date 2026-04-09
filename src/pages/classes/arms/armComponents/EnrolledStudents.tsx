import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useGetStudentsByArmQuery } from '@/services/leApi/classApi';
import '@/pages/students/components/StudentlListing/StudentListing.css';
import '../../Classes.css';

interface EnrolledStudentsProps {
  currentArmName: string;
}

const EnrolledStudents = ({ currentArmName }: EnrolledStudentsProps) => {
  const { armId } = useParams<{ armId: string }>();
  const navigate = useNavigate();

  const { data: students = [], isLoading } = useGetStudentsByArmQuery(armId!);


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
  );
};

export default EnrolledStudents;
