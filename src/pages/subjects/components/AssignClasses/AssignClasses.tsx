import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useAssignClassesMutation } from '@/services/leApi/subjectApi';
import { useGetClassesQuery, CATEGORY_OPTIONS } from '@/services/leApi/classApi';
import type { Category, Class } from '@/services/leApi/classApi';
import './AssignClasses.css';

interface AssignClassesProps {
  subjectId: string;
  assignedClassIds: string[];
}

// Color accent per education level
const CATEGORY_ACCENT: Record<string, string> = {
  EARLY_YEARS: 'amber',
  BASIC: 'emerald',
  JUNIOR_SECONDARY: 'blue',
  SENIOR_SECONDARY: 'violet',
  OTHER: 'slate',
};

const AssignClasses: React.FC<AssignClassesProps> = ({
  subjectId,
  assignedClassIds,
}) => {
  const [assignClasses] = useAssignClassesMutation();
  const { data: classes = [] } = useGetClassesQuery();
  const allClassIds = classes.map(c => c.id);
  const [selectedIds, setSelectedIds] = useState<string[]>(assignedClassIds);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedIds(assignedClassIds);
  }, [assignedClassIds]);

  const groupedClasses = classes.reduce((acc, details) => {
    const cat = details.category || 'OTHER';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(details);
    return acc;
  }, {} as Record<string, Class[]>);

  const getCategoryLabel = (cat: string) =>
    CATEGORY_OPTIONS.find(opt => opt.value === cat)?.label || cat;

  const categoryOrder: Category[] = [
    'EARLY_YEARS',
    'BASIC',
    'JUNIOR_SECONDARY',
    'SENIOR_SECONDARY',
    'OTHER',
  ];

  const allSelected = allClassIds.length > 0 && selectedIds.length === allClassIds.length;

  const toggleAll = () =>
    allSelected ? setSelectedIds([]) : setSelectedIds(allClassIds);

  const toggleCategory = (catIds: string[]) => {
    const allCatSelected = catIds.every(id => selectedIds.includes(id));
    if (allCatSelected) {
      setSelectedIds(prev => prev.filter(id => !catIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...catIds])]);
    }
  };

  const toggleClass = (id: string) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );

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

  const hasChanges =
    JSON.stringify(selectedIds.slice().sort()) !==
    JSON.stringify(assignedClassIds.slice().sort());

  return (
    <div className="assign-classes-container">

      {/* ── Summary bar ──────────────────────────────────────────────── */}
      <div className="ac-summary-bar">
        <div className="ac-summary-text">
          <h3 className="ac-summary-title">Class Assignments</h3>
          <p className="ac-summary-desc">
            Use this tab to assign or unassign this subject to classes across your institution.
            <br />
            <b>{assignedClassIds.length > 0 && ` Currently assigned to ${assignedClassIds.length} class${assignedClassIds.length === 1 ? '' : 'es'}.`}</b>
          </p>
        </div>

        <button className="ac-select-all-btn" onClick={toggleAll}>
          <span className={`ac-mini-check ${allSelected ? 'ac-mini-check--active' : ''}`}>
            {allSelected && <Check size={10} strokeWidth={3.5} />}
          </span>
          {allSelected ? 'Deselect All Classes' : 'Select All Classes'}
        </button>
      </div>

      {/* ── Category sections ─────────────────────────────────────────── */}
      <div className="ac-categories">
        {categoryOrder.map(cat => {
          const catClasses = groupedClasses[cat];
          if (!catClasses || catClasses.length === 0) return null;

          const catIds = catClasses.map((c: Class) => c.id);
          const allCatSelected = catIds.every((id: string) => selectedIds.includes(id));
          const someCatSelected = catIds.some((id: string) => selectedIds.includes(id));
          const accent = CATEGORY_ACCENT[cat] || 'slate';

          return (
            <div key={cat} className={`ac-category-group ac-category-group--${accent}`}>
              <div className="ac-category-header">
                <div className="ac-category-label-row">
                  <span className={`ac-category-badge ac-category-badge--${accent}`}>
                    {getCategoryLabel(cat)}
                  </span>
                  <span className="ac-category-count">
                    {catIds.filter((id: string) => selectedIds.includes(id)).length}&thinsp;/&thinsp;{catIds.length}
                  </span>
                </div>
                <button
                  className={`ac-category-toggle ${allCatSelected ? 'ac-category-toggle--active' : someCatSelected ? 'ac-category-toggle--partial' : ''}`}
                  onClick={() => toggleCategory(catIds)}
                >
                  <span className={`ac-mini-check ${allCatSelected ? 'ac-mini-check--active' : ''}`}>
                    {allCatSelected && <Check size={10} strokeWidth={3.5} />}
                  </span>
                  {allCatSelected ? 'Deselect' : `Select all`}
                </button>
              </div>

              <div className="ac-pills-grid">
                {catClasses.map(({ id, name }: Class) => {
                  const isSelected = selectedIds.includes(id);
                  return (
                    <button
                      key={id}
                      className={`ac-pill ${isSelected ? 'ac-pill--selected' : ''}`}
                      onClick={() => toggleClass(id)}
                    >
                      <span className={`ac-pill-check ${isSelected ? 'ac-pill-check--selected' : ''}`}>
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </span>
                      <span className="ac-pill-name">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className="ac-footer">
        {hasChanges && (
          <span className="ac-unsaved-badge">Unsaved changes</span>
        )}
        <button
          className="le-button le-button-primary ac-save-btn"
          onClick={handleSave}
          disabled={!hasChanges || isUpdating}
        >
          {isUpdating ? 'Saving…' : 'Save Assignments'}
        </button>
      </div>

    </div>
  );
};

export default AssignClasses;