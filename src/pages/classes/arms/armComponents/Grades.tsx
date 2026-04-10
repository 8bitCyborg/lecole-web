import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Save, Lock } from 'lucide-react';
import {
  useGetStudentsByArmQuery,
  useGetClassQuery
} from '@/services/leApi/classApi';
import { useGetGradingModulesQuery } from '@/services/leApi/gradingApi';
import '../styles.css';

const Grades = ({ classId, armId }: { classId: string, armId: string }) => {

  const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsByArmQuery(armId!);
  const { data: classData, isLoading: isLoadingClass } = useGetClassQuery(classId);
  const { data: modules = [], isLoading, error } = useGetGradingModulesQuery();

  const subjects = classData?.subjects || [];

  console.log('modules', modules);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowScrollLeft(scrollLeft > 10);
      setShowScrollRight(scrollWidth > clientWidth && scrollLeft < (scrollWidth - clientWidth - 10));
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const targetScroll = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [students, subjects, modules]);

  if (isLoadingStudents || isLoadingClass || isLoading) {
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
      <div
        className="grades-table-wrapper"
        ref={scrollRef}
        onScroll={checkScroll}
      >
        <table className="grades-table">
          {/* ... table content ... */}
          <thead>
            <tr>
              <th className="sticky-col" rowSpan={modules.length > 0 ? 2 : 1}></th>
              {subjects.map((subject: any) => (
                <th key={subject.id} colSpan={modules.length || 1}>
                  <div className="rotate-label">{subject.name}</div>
                </th>
              ))}
            </tr>
            {modules.length > 0 && (
              <tr>
                {subjects.map((subject: any) => (
                  modules.map((module: any, mIndex: number) => (
                    <th
                      key={`${subject.id}-${module.id}`}
                      className={`module-sub-header ${mIndex === modules.length - 1 ? 'subject-group-last' : ''}`}
                    >
                      {module.name}
                    </th>
                  ))
                ))}
              </tr>
            )}
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
                  modules.length > 0 ? (
                    modules.map((module: any, mIndex: number) => {
                      const isLocked = module.isLocked;
                      return (
                        <td
                          key={`${subject.id}-${module.id}`}
                          className={`module-grade-cell ${mIndex === modules.length - 1 ? 'subject-group-last' : ''} ${isEditing ? 'editing' : ''} ${isLocked ? 'locked' : ''}`}
                        >
                          {isEditing && !isLocked ? (
                            <input
                              type="text"
                              className="grade-input"
                              defaultValue=""
                              placeholder="-"
                              maxLength={2}
                              inputMode='numeric'
                              pattern='[0-9]*'
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  setIsEditing(false);
                                }
                              }}
                            />
                          ) : (
                            <div className="grade-display">
                              {isLocked && <Lock size={9} className="lock-icon-mini" />}
                              <span>-</span>
                            </div>
                          )}
                        </td>
                      );
                    })
                  ) : (
                    <td
                      key={subject.id}
                      className={`module-grade-cell subject-group-last ${isEditing ? 'editing' : ''}`}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          className="grade-input"
                          defaultValue="-"
                          placeholder="-"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showScrollLeft && (
        <button
          className="scroll-indicator-minimal left"
          onClick={() => handleScroll('left')}
          title="Scroll Left"
        >
          <ChevronLeft size={16} />
        </button>
      )}


      <div className='right'>

        {showScrollRight && (
          <button
            className="scroll-indicator-minimal right"
            onClick={() => handleScroll('right')}
            title="Scroll Right"
          >
            <ChevronRight size={16} />
          </button>
        )}

        <button
          className={`edit-toggle-button right ${isEditing ? 'active' : ''}`}
          onClick={() => setIsEditing(!isEditing)}
          title={isEditing ? "Save Changes" : "Edit Broadsheet"}
        >
          {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
        </button>

      </div>
    </div>
  );
};

export default Grades;