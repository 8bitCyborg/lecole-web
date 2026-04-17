import GradesTable from './GradesTable';
import './styles.css';
import { useFindMySchoolQuery } from '@/services/leApi/schoolApi';
import { useGetStudentsByArmQuery } from '@/services/leApi/armsApi';
import { useGetClassQuery } from '@/services/leApi/classApi';
import {
  useGetGradingModulesQuery,
  useGetGradesByArmQuery,
} from '@/services/leApi/gradingApi';

const Grades = ({ classId, armId, isEmbedded }: { classId: string, armId: string, isEmbedded?: boolean }) => {

  const school = useFindMySchoolQuery();
  const schoolData = school?.data;
  const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsByArmQuery(armId!);
  const { data: classData, isLoading: isLoadingClass } = useGetClassQuery(classId);
  const { data: modules = [], isLoading: isLoadingModules } = useGetGradingModulesQuery();
  const { data: existingGrades = [], isLoading: isLoadingGrades } = useGetGradesByArmQuery(armId!);

  const subjects = classData?.subjects || [];

  if (isLoadingStudents || isLoadingClass || isLoadingModules || isLoadingGrades) {
    return (
      <div className="grades-empty-state" style={{ background: 'white' }}>
        <div className="loading-dense">Synchronizing academic data...</div>
      </div>
    );
  }

  if (students.length === 0 || subjects.length === 0) {
    return (
      <div className="grades-empty-state" style={{ background: 'white', borderTopLeftRadius: 0 }}>
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
    <GradesTable
      classId={classId}
      armId={armId}
      classData={classData}
      schoolData={schoolData}
      modules={modules}
      subjects={subjects}
      students={students}
      existingGrades={existingGrades}
      isEmbedded={isEmbedded}
    />
  );
};

export default Grades;
