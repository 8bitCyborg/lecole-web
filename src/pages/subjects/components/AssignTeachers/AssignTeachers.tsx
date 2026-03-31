import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Check } from 'lucide-react';
import { selectTeacherMap } from '@/store/slices/teachersSlice';
import { useAssignTeachersMutation } from '@/services/leApi/subjectApi';
import './AssignTeachers.css';

interface AssignTeachersProps {
  subjectId: string;
  assignedTeacherIds: string[];
}

const AssignTeachers: React.FC<AssignTeachersProps> = ({
  subjectId,
  assignedTeacherIds,
}) => {
  const [assignTeachers] = useAssignTeachersMutation();
  const allTeacherMap = useSelector(selectTeacherMap);
  const allTeacherIds = Object.keys(allTeacherMap);
  const [selectedIds, setSelectedIds] = useState<string[]>(assignedTeacherIds);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedIds(assignedTeacherIds);
  }, [assignedTeacherIds]);

  const allSelected = allTeacherIds.length > 0 && selectedIds.length === allTeacherIds.length;

  const toggleAll = () =>
    allSelected ? setSelectedIds([]) : setSelectedIds(allTeacherIds);

  const toggleTeacher = (id: string) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await assignTeachers({ id: subjectId, teacherIds: selectedIds }).unwrap();
    } catch (error) {
      console.error('Error assigning teachers:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges =
    JSON.stringify(selectedIds.slice().sort()) !==
    JSON.stringify(assignedTeacherIds.slice().sort());

  // Sort teachers by name for the display list
  const sortedTeachers = Object.entries(allTeacherMap)
    .map(([id, details]) => ({ id, ...details }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="assign-teachers-container">

      {/* ── Summary bar ──────────────────────────────────────────────── */}
      <div className="at-summary-bar">
        <div className="at-summary-text">
          <h3 className="at-summary-title">Staff Assignment</h3>
          <p className="at-summary-desc">
            Use this tab to assign or unassign subject matter experts and instructors to this subject.
            <br />
            <b>{assignedTeacherIds.length > 0 && ` Currently assigned to ${assignedTeacherIds.length} staff member${assignedTeacherIds.length === 1 ? '' : 's'}.`}</b>
          </p>
        </div>

        <button className="at-select-all-btn" onClick={toggleAll}>
          <span className={`at-mini-check ${allSelected ? 'at-mini-check--active' : ''}`}>
            {allSelected && <Check size={10} strokeWidth={3.5} />}
          </span>
          {allSelected ? 'Deselect All Staff' : 'Select All Staff'}
        </button>
      </div>

      {/* ── Teachers grid ─────────────────────────────────────────────── */}
      <div className="at-content">
        <div className="at-teachers-grid">
          {sortedTeachers.map(({ id, name, email }) => {
            const isSelected = selectedIds.includes(id);
            return (
              <button
                key={id}
                className={`at-card ${isSelected ? 'at-card--selected' : ''}`}
                onClick={() => toggleTeacher(id)}
              >
                <div className="at-card-info">
                  <span className="at-card-name">{name}</span>
                  {email && <span className="at-card-email">{email}</span>}
                </div>
                <span className={`at-card-check ${isSelected ? 'at-card-check--selected' : ''}`}>
                  {isSelected && <Check size={12} strokeWidth={3.5} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className="at-footer">
        {hasChanges && (
          <span className="at-unsaved-badge">Unsaved changes</span>
        )}
        <button
          className="le-button le-button-primary at-save-btn"
          onClick={handleSave}
          disabled={!hasChanges || isUpdating}
        >
          {isUpdating ? 'Saving…' : 'Save Assignments'}
        </button>
      </div>

    </div>
  );
};

export default AssignTeachers;