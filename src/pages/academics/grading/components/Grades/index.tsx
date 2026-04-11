import { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Save,
  Lock,
  Loader2,
  XCircle,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
import { useGetClassQuery } from '@/services/leApi/classApi';
import { useGetStudentsByArmQuery } from '@/services/leApi/armsApi';
import {
  useGetGradingModulesQuery,
  useGetGradesByArmQuery,
  useUpsertGradesMutation
} from '@/services/leApi/gradingApi';
import './styles.css';

const Grades = ({ classId, armId, isEmbedded }: { classId: string, armId: string, isEmbedded?: boolean }) => {

  const { school } = useAppSelector((state) => state.school);
  const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsByArmQuery(armId!);
  const { data: classData, isLoading: isLoadingClass } = useGetClassQuery(classId);
  const { data: modules = [], isLoading: isLoadingModules } = useGetGradingModulesQuery();
  const { data: existingGrades = [], isLoading: isLoadingGrades } = useGetGradesByArmQuery(armId!);

  const [upsertGrades, { isLoading: isSaving }] = useUpsertGradesMutation();

  const subjects = classData?.subjects || [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Local state for pending changes: `${studentId}|${subjectId}|${moduleId}` -> score
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

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

  const hasUnsavedChanges = Object.keys(pendingChanges).length > 0;

  const handleToggleEdit = () => {
    if (isEditing && hasUnsavedChanges) {
      setShowDiscardModal(true);
    } else {
      setIsEditing(!isEditing);
      setSaveError(null);
    }
  };

  const handleConfirmDiscard = () => {
    setPendingChanges({});
    setIsEditing(false);
    setShowDiscardModal(false);
    setSaveError(null);
  };

  const handleGradeChange = (studentId: string, subjectId: string, moduleId: string, value: string) => {
    // Only allow numbers and decimal point
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;

    // Limit to max 99
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue > 99) return;

    const key = `${studentId}|${subjectId}|${moduleId}`;
    setPendingChanges(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges || !school) return;
    setSaveError(null);

    const scores = Object.entries(pendingChanges).map(([key, value]) => {
      const [studentId, subjectId, gradingModuleId] = key.split('|');
      const score = value === '' ? 0 : parseFloat(value);
      return {
        studentId,
        subjectId,
        gradingModuleId,
        score: isFinite(score) ? score : 0
      };
    });

    const payload = {
      context: {
        schoolId: school.id,
        classId,
        armId,
        term: school.currentTerm,
        session: school.currentSession
      },
      scores
    };

    try {
      await upsertGrades(payload).unwrap();
      setPendingChanges({});
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to save grades:', err);
      setSaveError(err.data?.message || 'Failed to save academic records. Please verify connectivity and try again.');
    }
  };

  const getGradeValue = (studentId: string, subjectId: string, moduleId: string) => {
    const key = `${studentId}|${subjectId}|${moduleId}`;
    if (pendingChanges[key] !== undefined) {
      return pendingChanges[key];
    }

    const grade = existingGrades.find(
      g => g.studentId === studentId &&
        g.subjectId === subjectId &&
        g.gradingModuleId === moduleId
    );

    return grade ? grade.score.toString() : "";
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [students, subjects, modules]);

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
    <>
      {isFullScreen && <div className="fullscreen-backdrop" onClick={() => setIsFullScreen(false)} />}
      <div className={`grades-wrapper ${isFullScreen ? 'full-screen' : ''} ${isEmbedded ? 'embedded' : ''}`}>

        {/* ── Toolbar ── */}
        <div className="grades-toolbar">
          <div className="grades-toolbar-left">
            <span className="grades-toolbar-title">
              {isEditing ? (
                hasUnsavedChanges
                  ? <span className="toolbar-badge unsaved">● Unsaved changes</span>
                  : <span className="toolbar-badge editing">Editing</span>
              ) : (
                <span className="toolbar-badge">Broadsheet</span>
              )}
            </span>
          </div>

          <div className="grades-toolbar-right">
            {showScrollLeft && (
              <button
                className="toolbar-btn icon-only"
                onClick={() => handleScroll('left')}
                title="Scroll Left"
              >
                <ChevronLeft size={16} />
              </button>
            )}

            {showScrollRight && (
              <button
                className="toolbar-btn"
                onClick={() => handleScroll('right')}
                title="Scroll Right"
              >
                <ChevronRight size={16} />
              </button>
            )}

            {isEditing && hasUnsavedChanges && (
              <button
                className="toolbar-btn save"
                onClick={handleSave}
                disabled={isSaving}
                title="Save Changes"
              >
                {isSaving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
                <span>{isSaving ? 'Saving…' : 'Save'}</span>
              </button>
            )}

            <button
              className={`toolbar-btn icon-only ${isSaving ? 'disabled' : ''}`}
              onClick={handleToggleEdit}
              style={isEditing ? { border: 'solid 1px #f00' } : {}}
              disabled={isSaving}
              title={isEditing ? 'Exit Edit Mode' : 'Edit Broadsheet'}
            >
              {isEditing ? <XCircle size={16} /> : <Edit2 size={16} />}
            </button>

            <button
              className="toolbar-btn icon-only"
              style={!isFullScreen ? { border: 'solid 1px #fff', background: 'green', color: '#fff' } : { border: 'solid 1px #0f0', color: '#0f0' }}
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="grades-container">
          <div
            className="grades-table-wrapper"
            ref={scrollRef}
            onScroll={checkScroll}
          >
            <table className="grades-table">
              <thead>
                <tr style={{ position: 'sticky', top: 0, background: '#000', zIndex: 99 }}>
                  <th
                    className="sticky-col"
                    rowSpan={modules.length > 0 ? 2 : 1}
                    style={{ zIndex: 20 }}
                  ></th>
                  {subjects.map((subject: any) => (
                    <th key={subject.id} colSpan={modules.length > 0 ? modules.length + 1 : 1}>
                      <div className="rotate-label" style={{ zIndex: 0 }}>{subject.name}</div>
                    </th>
                  ))}
                </tr>
                {modules.length > 0 && (
                  <tr>
                    {subjects.map((subject: any) => (
                      [
                        ...modules.map((module: any) => (
                          <th
                            key={`${subject.id}-${module.id}`}
                            className="module-sub-header"
                            style={{ zIndex: 0 }}
                          >
                            {module.name}
                          </th>
                        )),
                        <th
                          key={`${subject.id}-total`}
                          className="module-sub-header subject-group-last total-sub-header"
                        >
                          Total
                        </th>
                      ]
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
                    {subjects.map((subject: any) => {
                      if (modules.length > 0) {
                        const subjectTotal = modules.reduce((sum: number, module: any) => {
                          const val = parseFloat(getGradeValue(student.id, subject.id, module.id));
                          return sum + (isNaN(val) ? 0 : val);
                        }, 0);

                        return [
                          ...modules.map((module: any) => {
                            const isLocked = module.isLocked;
                            const value = getGradeValue(student.id, subject.id, module.id);
                            return (
                              <td
                                key={`${subject.id}-${module.id}`}
                                className={`module-grade-cell ${isEditing ? 'editing' : ''} ${isLocked ? 'locked' : ''}`}
                              >
                                {isEditing && !isLocked ? (
                                  <input
                                    type="text"
                                    name="grade-input"
                                    id={`grade-input-${student.id}-${subject.id}-${module.id}`}
                                    className="grade-input"
                                    value={value}
                                    onChange={(e) => handleGradeChange(student.id, subject.id, module.id, e.target.value)}
                                    placeholder=""
                                    maxLength={2}
                                    inputMode='decimal'
                                  />
                                ) : (
                                  <div className="grade-display">
                                    {isLocked && <Lock size={9} className="lock-icon-mini" />}
                                    <span>{value || '-'}</span>
                                  </div>
                                )}
                              </td>
                            );
                          }),
                          <td
                            key={`${subject.id}-total`}
                            className="module-grade-cell subject-group-last total-cell"
                          >
                            <div className="grade-display">
                              <span>{subjectTotal > 0 ? subjectTotal : '-'}</span>
                            </div>
                          </td>
                        ];
                      }

                      return (
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
                            '-'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isSaving && (
            <div className="grades-loading-overlay">
              <div className="loading-spinner-container">
                <Loader2 className="spin" size={32} />
                <p>Saving grades…</p>
              </div>
            </div>
          )}

          {saveError && (
            <div className="grades-error-banner">
              <XCircle size={14} />
              <span>{saveError}</span>
              <button className="error-clear-btn" onClick={() => setSaveError(null)}>Dismiss</button>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        title="Discard Changes"
        message="You have unsaved scores on this broadsheet. Moving out of edit mode will lose these changes. Are you sure?"
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowDiscardModal(false)}
      />
    </>
  );
};

export default Grades;
