import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Check } from 'lucide-react';
import { selectClassMap } from '../../../store/slices/classesSlice';
import { useAssignClassesMutation } from '../../../services/leApi/subjectApi';
import { CATEGORY_OPTIONS } from '../../../services/leApi/classApi';
import type { Category } from '../../../services/leApi/classApi';
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

  // Group classes by category for display
  const groupedClasses = Object.entries(allClassMap).reduce((acc, [id, details]) => {
    const cat = details.category || 'OTHER';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ id, ...details });
    return acc;
  }, {} as Record<string, { id: string; name: string; category: string }[]>);

  const getCategoryLabel = (cat: string) => {
    return CATEGORY_OPTIONS.find(opt => opt.value === cat)?.label || cat;
  };

  const categoryOrder: Category[] = [
    'EARLY_YEARS',
    'BASIC',
    'JUNIOR_SECONDARY',
    'SENIOR_SECONDARY',
    'OTHER'
  ];

  const allSelected = allClassIds.length > 0 && selectedIds.length === allClassIds.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allClassIds);
    }
  };

  const toggleCategory = (catIds: string[]) => {
    const allCatSelected = catIds.every(id => selectedIds.includes(id));
    if (allCatSelected) {
      setSelectedIds(prev => prev.filter(id => !catIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...catIds])]);
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
                {allClassMap[id]?.name || 'Loading...'}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="assignment-categories-stack">
        {categoryOrder.map(cat => {
          const catClasses = groupedClasses[cat];
          if (!catClasses || catClasses.length === 0) return null;

          const catIds = catClasses.map(c => c.id);
          const allCatSelected = catIds.every(id => selectedIds.includes(id));

          return (
            <div key={cat} className="category-assignment-group" style={{ marginBottom: '2.5rem' }}>
              <div className="category-header-row" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em', color: '#1e3a8a' }}>
                  {getCategoryLabel(cat)}
                </h4>
                <div
                  className="category-toggle-btn"
                  onClick={() => toggleCategory(catIds)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#64748b',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s ease',
                    background: '#f8fafc'
                  }}
                >
                  <div className="checkbox-visual" style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    marginRight: 0,
                    background: allCatSelected ? '#3b82f6' : 'white',
                    borderColor: allCatSelected ? '#3b82f6' : '#cbd5e1'
                  }}>
                    {allCatSelected && <Check size={12} strokeWidth={4} color="white" />}
                  </div>
                  {allCatSelected ? 'Deselect Category' : 'Select Category'}
                </div>
              </div>

              <div className="classes-selection-grid">
                {catClasses.map(({ id, name }) => (
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
            </div>
          );
        })}
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