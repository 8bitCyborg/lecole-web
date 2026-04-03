import React, { useState, useEffect, useMemo } from 'react';
import { Check } from 'lucide-react';
import { useGetSubjectsQuery } from '@/services/leApi/subjectApi';
import { useAssignSubjectsMutation } from '@/services/leApi/staffApi';
import type { Staff } from '@/services/leApi/staffApi';
import './SubjectAssignment.css';

interface SubjectAssignmentProps {
  staff: Staff;
}

const SubjectAssignment: React.FC<SubjectAssignmentProps> = ({ staff }) => {
  const { data: allSubjects = [], isLoading } = useGetSubjectsQuery();
  const [assignSubjects] = useAssignSubjectsMutation();

  const initialSubjectIds = useMemo(() =>
    staff.subjects?.map((s: any) => s.id) || []
    , [staff.subjects]);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialSubjectIds);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedIds(initialSubjectIds);
  }, [initialSubjectIds]);

  const allSubjectIds = allSubjects.map((s: any) => s.id);
  const allSelected = allSubjectIds.length > 0 && selectedIds.length === allSubjectIds.length;

  const toggleAll = () =>
    allSelected ? setSelectedIds([]) : setSelectedIds(allSubjectIds);

  const toggleSubject = (id: string) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await assignSubjects({ id: staff.id, subjectIds: selectedIds }).unwrap();
    } catch (error) {
      console.error('Error saving subject assignments:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges =
    JSON.stringify([...selectedIds].sort()) !==
    JSON.stringify([...initialSubjectIds].sort());

  const sortedSubjects = [...allSubjects].sort((a, b) => a.name.localeCompare(b.name));

  if (isLoading) return <div className="sa-loading">Loading subjects...</div>;

  return (
    <div className="subject-assignment-container">
      {/* ── Summary bar ──────────────────────────────────────────────── */}
      <div className="sa-summary-bar">
        <div className="sa-summary-text">
          <h3 className="sa-summary-title">Subject Assignment</h3>
          <p className="sa-summary-desc">
            Assign the subjects this staff member is qualified to teach.
            <br />
            <b>{initialSubjectIds.length > 0 && ` Currently assigned to teach ${initialSubjectIds.length} subject${initialSubjectIds.length === 1 ? '' : 's'}.`}</b>
          </p>
        </div>

        <button className="sa-select-all-btn" onClick={toggleAll}>
          <span className={`sa-mini-check ${allSelected ? 'sa-mini-check--active' : ''}`}>
            {allSelected && <Check size={10} strokeWidth={3.5} />}
          </span>
          {allSelected ? 'Deselect All Subjects' : 'Select All Subjects'}
        </button>
      </div>

      {/* ── Subjects grid ─────────────────────────────────────────────── */}
      <div className="sa-content">
        <div className="sa-subjects-grid">
          {sortedSubjects.map((sub) => {
            const isSelected = selectedIds.includes(sub.id);
            const details = sub;
            return (
              <button
                key={sub.id}
                className={`sa-card ${isSelected ? 'sa-card--selected' : ''}`}
                onClick={() => toggleSubject(sub.id)}
              >
                <div className="sa-card-info">
                  <span className="sa-card-name">{details.name}</span>
                  {details.code && <span className="sa-card-code">{details.code}</span>}
                </div>
                <span className={`sa-card-check ${isSelected ? 'sa-card-check--selected' : ''}`}>
                  {isSelected && <Check size={12} strokeWidth={3.5} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className="sa-footer">
        {hasChanges && <span className="sa-unsaved-badge">Unsaved changes</span>}
        <button
          className="le-button le-button-primary sa-save-btn"
          onClick={handleSave}
          disabled={!hasChanges || isUpdating}
        >
          {isUpdating ? 'Saving…' : 'Save Assignments'}
        </button>
      </div>
    </div>
  );
};

export default SubjectAssignment;