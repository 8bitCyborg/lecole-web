import { useGetStudentsByArmQuery, useGetClassQuery } from '@/services/leApi/classApi';
import '../styles.css';

const Grades = ({ classId, armId }: { classId: string, armId: string }) => {

  const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsByArmQuery(armId!);
  const { data: classData, isLoading: isLoadingClass } = useGetClassQuery(classId);

  const subjects = classData?.subjects || [];

  if (isLoadingStudents || isLoadingClass) {
    return (
      <div className="arms-empty-state" style={{ background: 'white' }}>
        <div className="loading-dense">Synchronizing academic data...</div>
      </div>
    );
  }

  if (students.length === 0 || subjects.length === 0) {
    return (
      <div className="arms-empty-state" style={{ background: 'white', borderTopLeftRadius: 0 }}>
        <div className="empty-state-icon">📝</div>
        <h3 className="empty-state-title">Setup Incomplete</h3>
        <p className="empty-state-description">
          {students.length === 0
            ? "No students enrolled in this arm yet."
            : "No subjects assigned to this class yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grades-container">
      <div className="grades-table-wrapper">
        <table className="grades-table">
          <thead>
            <tr>
              <th className="sticky-col"></th>
              {subjects.map((subject: any) => (
                <th key={subject.id}>
                  <div className="rotate-label">{subject.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => (
              <tr key={student.id}>
                <td className="sticky-col">
                  <div className="student-info-cell">
                    <span className="student-name-mini">
                      {student.user.firstName} {student.user.lastName}
                    </span>
                  </div>
                </td>
                {subjects.map((subject: any) => (
                  <td key={subject.id}>
                    {/* Scores to be displayed here */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;