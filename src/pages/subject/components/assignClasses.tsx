import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Check } from 'lucide-react';
import { selectClassMap } from '../../../store/slices/classesSlice';
import { useAssignClassesMutation } from '../../../services/leApi/subjectApi';
import './AssignClasses.css';

interface AssignClassesProps {
  subjectId: string;
  assignedClassIds: string[];
}

const AssignClasses: React.FC<AssignClassesProps> = ({ 
  subjectId,
  assignedClassIds,
}) => {
  const [assignClasses] = useAssignClassesMutation();
  const allClassMap = useSelector(selectClassMap);
  const allClassIds = Object.keys(allClassMap);
  const [selectedIds, setSelectedIds] = useState<string[]>(assignedClassIds);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedIds(assignedClassIds);
  }, [assignedClassIds]);

  const allSelected = allClassIds.length > 0 && selectedIds.length === allClassIds.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allClassIds);
    }
  };

  const toggleClass = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await assignClasses({ id: subjectId, classIds: selectedIds }).unwrap();
    } catch (error) {
      console.error('Error assigning classes:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = JSON.stringify(selectedIds.sort()) !== JSON.stringify(assignedClassIds.slice().sort());

  return (
    <div className="assign-classes-container">
      <div className="assign-classes-header">
        <div>
          <h2 className="assign-classes-title">Academic Assignment</h2>
          <p className="assign-classes-subtitle">Assign this subject to multiple classes across your institution.</p>
        </div>

        <div className="select-all-container" onClick={toggleAll}>
          <div className="checkbox-visual" style={{ 
            background: allSelected ? '#3b82f6' : 'white', 
            borderColor: allSelected ? '#3b82f6' : '#cbd5e1',
            color: allSelected ? 'white' : '#0f172a' 
          }}>
            {allSelected && <Check size={14} strokeWidth={3} />}
          </div>
          <span className="select-all-text">{allSelected ? 'Deselect All' : 'Select All Classes'}</span>
        </div>
      </div>

      <div className="currently-assigned-section">
        <h3 className="assign-classes-title" style={{ fontSize: '1.1rem' }}>Currently Assigned</h3>
        <div className="assigned-badges-container">
          {assignedClassIds.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>No classes currently assigned.</p>
          ) : (
            assignedClassIds.map(id => (
              <div key={id} className="assigned-badge">
                <span className="assigned-badge-dot"></span>
                {allClassMap[id] || 'Loading...'}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="classes-selection-grid">
        {Object.entries(allClassMap).map(([id, name]) => (
          <div 
            key={id} 
            className={`class-select-item ${selectedIds.includes(id) ? 'selected' : ''}`}
            onClick={() => toggleClass(id)}
          >
            <div className="checkbox-visual">
              {selectedIds.includes(id) && <Check size={14} strokeWidth={3} />}
            </div>
            <span className="class-select-name">{name}</span>
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

export default AssignClasses;