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

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allTeacherIds);
    }
  };

  const toggleTeacher = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

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

  const hasChanges = JSON.stringify(selectedIds.sort()) !== JSON.stringify(assignedTeacherIds.slice().sort());

  // Sort teachers by name for the display list
  const sortedTeachers = Object.entries(allTeacherMap)
    .map(([id, details]) => ({ id, ...details }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="assign-teachers-container">
      <div className="assign-teachers-header">
        <div>
          <h2 className="assign-teachers-title">Staff Assignment</h2>
          <p className="assign-teachers-subtitle">Assign subject matter experts and instructors to this subject.</p>
        </div>

        <div className="select-all-container" onClick={toggleAll}>
          <div className="checkbox-visual" style={{
            background: allSelected ? '#3b82f6' : 'white',
            borderColor: allSelected ? '#3b82f6' : '#cbd5e1',
            color: allSelected ? 'white' : '#0f172a'
          }}>
            {allSelected && <Check size={14} strokeWidth={3} />}
          </div>
          <span className="select-all-text">{allSelected ? 'Deselect All' : 'Select All Teachers'}</span>
        </div>
      </div>

      <div className="currently-assigned-section">
        <h3 className="assign-teachers-title" style={{ fontSize: '1.1rem' }}>Currently Assigned</h3>
        <div className="assigned-badges-container">
          {assignedTeacherIds.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>No teachers currently assigned.</p>
          ) : (
            assignedTeacherIds.map(id => (
              <div key={id} className="assigned-badge">
                <span className="assigned-badge-dot"></span>
                {allTeacherMap[id]?.name || 'Loading...'}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="teachers-selection-grid">
        {sortedTeachers.map(({ id, name, email }) => (
          <div
            key={id}
            className={`teacher-select-item ${selectedIds.includes(id) ? 'selected' : ''}`}
            onClick={() => toggleTeacher(id)}
          >
            <div className="teacher-info-wrapper">
              <div className="checkbox-visual">
                {selectedIds.includes(id) && <Check size={14} strokeWidth={3} />}
              </div>
              <div className="teacher-details">
                <span className="teacher-select-name">{name}</span>
                {email && <span className="teacher-select-email">{email}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="assign-actions">
        <button
          className="le-button le-button-primary"
          onClick={handleSave}
          disabled={!hasChanges || isUpdating}
        >
          {isUpdating ? 'Saving...' : 'Save Assignments'}
        </button>
      </div>
    </div>
  );
};

export default AssignTeachers;