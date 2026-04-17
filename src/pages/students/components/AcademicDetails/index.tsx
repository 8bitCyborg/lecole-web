import React, { useState } from 'react';
import { AlertCircle, Loader2, Edit2, Save, XCircle, Lock, ArrowLeft } from 'lucide-react';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
import {
  useGetStudentGradesQuery,
  useGetGradingModulesQuery,
  useUpsertGradesMutation,
} from '@/services/leApi/gradingApi';
import { useFindMySchoolQuery } from '@/services/leApi/schoolApi';
import '../PersonalDetails/styles.css';
import './styles.css';

interface StudentAcademicDetailsProps {
  student: any;
  onBack?: () => void;
  embedded?: boolean;
}

const StudentAcademicDetails: React.FC<StudentAcademicDetailsProps> = ({ student, onBack, embedded }) => {
  const hasClass = !!student.class;
  const subjects: any[] = student.class?.subjects || [];
  const school = useFindMySchoolQuery();
  const schoolData = school?.data;
  const { data: grades = [], isLoading } = useGetStudentGradesQuery(student.id);
  const { data: gradingModules = [], isLoading: gradingModulesLoading } = useGetGradingModulesQuery();
  const [upsertGrades, { isLoading: isSaving }] = useUpsertGradesMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  // Pending changes: `${subjectId}|${moduleId}` -> score string
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

  const hasUnsavedChanges = Object.keys(pendingChanges).length > 0;

  // Get the display value for a cell – check pending changes first, then existing grades
  const getGradeValue = (subjectId: string, moduleId: string): string => {
    const key = `${subjectId}|${moduleId}`;
    if (pendingChanges[key] !== undefined) {
      return pendingChanges[key];
    }
    const grade = (grades as any[]).find(
      (g: any) => g.subjectId === subjectId && g.gradingModuleId === moduleId
    );
    return grade ? grade.score.toString() : '';
  };

  const handleGradeChange = (subjectId: string, moduleId: string, value: string) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue > 99) return;

    const key = `${subjectId}|${moduleId}`;
    setPendingChanges(prev => ({ ...prev, [key]: value }));
  };

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

  const handleSave = async () => {
    if (!hasUnsavedChanges || !school) return;
    setSaveError(null);

    if (!schoolData?.id || !schoolData?.currentTermId || !schoolData?.currentSessionId) {
      // Show an error toast or return early
      return;
    }

    const scores = Object.entries(pendingChanges).map(([key, value]) => {
      const [subjectId, gradingModuleId] = key.split('|');
      const score = value === '' ? 0 : parseFloat(value);
      return {
        studentId: student.id,
        subjectId,
        gradingModuleId,
        score: isFinite(score) ? score : 0,
      };
    });

    const payload = {
      context: {
        schoolId: schoolData.id,
        classId: student.class.id,
        armId: student.armId,
        term: schoolData.currentTermId,
        session: schoolData.currentSessionId,
      },
      scores,
    };

    try {
      await upsertGrades(payload).unwrap();
      setPendingChanges({});
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to save grades:', err);
      setSaveError(err.data?.message || 'Failed to save. Please try again.');
    }
  };

  if (!hasClass) {
    return (
      <div className="student-sections-container">
        <div className="le-detail-card academic-empty-card">
          <div className="le-card-icon empty-academic-icon"><AlertCircle size={32} /></div>
          <div className="le-card-info">
            <div className="le-card-label">Enrollment Status</div>
            <div className="le-card-value">No Class Assigned</div>
            <p className="academic-empty-description">
              This student is currently not enrolled in any academic class.
              Please assign them to a class through the <strong>Edit Profile</strong> section.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || gradingModulesLoading) {
    return (
      <div className="student-sections-container">
        <div className="sa-loading-state">
          <Loader2 size={24} className="spin" />
          <span>Loading academic records…</span>
        </div>
      </div>
    );
  }

  const modules = gradingModules as any[];

  return (
    <div className={`student-sections-container ${embedded ? 'sa-embedded' : ''}`}>
      <div className="detail-section">
        {onBack && (
          <button className="sa-back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back to General Broadsheet</span>
          </button>
        )}
        <h3 className="detail-section-title">
          {student.user?.firstName} {student.user?.lastName} — {student.class.name}{student.arm?.name}
        </h3>

        {subjects.length > 0 && modules.length > 0 ? (
          <>
            {/* ── Toolbar ── */}
            <div className="sa-toolbar">
              <div className="sa-toolbar-left">
                <span className="sa-toolbar-badge">
                  {isEditing
                    ? (hasUnsavedChanges
                      ? <span className="sa-badge unsaved">● Unsaved changes</span>
                      : <span className="sa-badge editing">Editing</span>)
                    : <span className="sa-badge">Scorecard</span>
                  }
                </span>
              </div>
              <div className="sa-toolbar-right">
                {isEditing && hasUnsavedChanges && (
                  <button
                    className="sa-toolbar-btn save"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
                    <span>{isSaving ? 'Saving…' : 'Save'}</span>
                  </button>
                )}
                <button
                  className={`sa-toolbar-btn icon-only ${isSaving ? 'disabled' : ''}`}
                  onClick={handleToggleEdit}
                  style={isEditing ? { border: 'solid 1px #f00' } : {}}
                  disabled={isSaving}
                  title={isEditing ? 'Exit Edit Mode' : 'Edit Scores'}
                >
                  {isEditing ? <XCircle size={16} /> : <Edit2 size={16} />}
                </button>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="sa-table-container">
              <div className="sa-table-wrapper">
                <table className="sa-table">
                  <thead>
                    <tr>
                      <th className="sa-subject-col sa-sticky-col">Subject</th>
                      {modules.map((mod: any) => (
                        <th key={mod.id} className="sa-module-col">
                          {mod.name}
                          <span className="sa-module-pct">{mod.percentage}%</span>
                        </th>
                      ))}
                      <th className="sa-module-col sa-total-col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject: any) => {
                      const subjectTotal = modules.reduce((sum: number, mod: any) => {
                        const val = parseFloat(getGradeValue(subject.id, mod.id));
                        return sum + (isNaN(val) ? 0 : val);
                      }, 0);

                      return (
                        <tr key={subject.id}>
                          <td className="sa-subject-cell sa-sticky-col">
                            <span className="sa-subject-name">{subject.name}</span>
                            <span className="sa-subject-code">{subject.code}</span>
                          </td>
                          {modules.map((mod: any) => {
                            const isLocked = mod.isLocked;
                            const value = getGradeValue(subject.id, mod.id);
                            return (
                              <td
                                key={mod.id}
                                className={`sa-score-cell ${isEditing ? 'editing' : ''} ${isLocked ? 'locked' : ''} ${!value ? 'empty' : ''}`}
                              >
                                {isEditing && !isLocked ? (
                                  <input
                                    type="text"
                                    className="sa-grade-input"
                                    value={value}
                                    onChange={(e) => handleGradeChange(subject.id, mod.id, e.target.value)}
                                    placeholder=""
                                    maxLength={2}
                                    inputMode="decimal"
                                  />
                                ) : (
                                  <div className="sa-grade-display">
                                    {isLocked && <Lock size={9} className="sa-lock-icon" />}
                                    <span>{value || '-'}</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          <td className="sa-score-cell sa-total-value">
                            <div className="sa-grade-display">
                              <span>{subjectTotal > 0 ? subjectTotal : '-'}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {isSaving && (
                <div className="sa-saving-overlay">
                  <Loader2 className="spin" size={28} />
                  <p>Saving scores…</p>
                </div>
              )}

              {saveError && (
                <div className="sa-error-banner">
                  <XCircle size={14} />
                  <span>{saveError}</span>
                  <button className="sa-error-clear" onClick={() => setSaveError(null)}>Dismiss</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="le-detail-card no-subjects-card">
            <div className="le-card-icon"><AlertCircle size={24} /></div>
            <div className="le-card-info">
              <div className="le-card-label">Notice</div>
              <div className="le-card-value">
                {subjects.length === 0
                  ? 'No subjects defined for this class.'
                  : 'No grading modules configured yet.'}
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        title="Discard Changes"
        message="You have unsaved scores. Moving out of edit mode will lose these changes. Are you sure?"
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowDiscardModal(false)}
      />
    </div>
  );
};

export default StudentAcademicDetails;