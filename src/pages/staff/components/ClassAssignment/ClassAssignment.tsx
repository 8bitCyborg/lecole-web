import React, { useState, useEffect, useMemo } from 'react';
import { Check } from 'lucide-react';
import { useGetSchoolArmsQuery, useAssignMasterToArmMutation, useGetClassesQuery, CATEGORY_OPTIONS } from '@/services/leApi/classApi';
import type { Category } from '@/services/leApi/classApi';
import type { Staff } from '@/services/leApi/staffApi';
import './ClassAssignment.css';

interface ClassAssignmentProps {
  staff: Staff;
}

const CATEGORY_ACCENT: Record<string, string> = {
  EARLY_YEARS: 'amber',
  BASIC: 'emerald',
  JUNIOR_SECONDARY: 'blue',
  SENIOR_SECONDARY: 'violet',
  OTHER: 'slate',
};

const categoryOrder: Category[] = [
  'EARLY_YEARS',
  'BASIC',
  'JUNIOR_SECONDARY',
  'SENIOR_SECONDARY',
  'OTHER',
];

const ClassAssignment: React.FC<ClassAssignmentProps> = ({ staff }) => {
  const { data: armMap = {}, isLoading: armsLoading } = useGetSchoolArmsQuery();
  const [assignMaster] = useAssignMasterToArmMutation();
  const { data: classMap = {} } = useGetClassesQuery();

  const arms = useMemo(() => Object.values(armMap), [armMap]);

  const initialAssignedIds = useMemo(() =>
    arms.filter(arm => arm.classMasterId === staff.id).map(arm => arm.id)
    , [arms, staff.id]);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialAssignedIds);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedIds(initialAssignedIds);
  }, [initialAssignedIds]);

  // Only show arms that are either assigned to this staff or have no master
  const filteredArms = useMemo(() =>
    arms.filter(arm => !arm.classMasterId || arm.classMasterId === staff.id)
    , [arms, staff.id]);

  // Arms that ARE selected (initial or new)
  const currentSelectedArms = useMemo(() =>
    filteredArms.filter(arm => selectedIds.includes(arm.id))
    , [filteredArms, selectedIds]);

  // Arms that ARE NOT selected (available)
  const availableArms = useMemo(() =>
    filteredArms.filter(arm => !selectedIds.includes(arm.id))
    , [filteredArms, selectedIds]);

  const groupedAvailableArms = useMemo(() => {
    return availableArms.reduce((acc, arm) => {
      const classId = arm.classId;
      const cat = classMap[classId]?.category || 'OTHER';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(arm);
      return acc;
    }, {} as Record<string, typeof arms>);
  }, [availableArms, classMap]);

  const allFilteredArmIds = filteredArms.map(a => a.id);
  const allSelected = allFilteredArmIds.length > 0 && allFilteredArmIds.every(id => selectedIds.includes(id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !allFilteredArmIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...allFilteredArmIds])]);
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

  const toggleArm = (id: string) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Find arms to assign
      const toAssign = selectedIds.filter(id => !initialAssignedIds.includes(id));
      // Find arms to unassign
      const toUnassign = initialAssignedIds.filter(id => !selectedIds.includes(id));

      // Batch process mutations
      const promises = [
        ...toAssign.map(armId => assignMaster({ armId, staffId: staff.id }).unwrap()),
        ...toUnassign.map(armId => assignMaster({ armId, staffId: null }).unwrap())
      ];

      await Promise.all(promises);
    } catch (error) {
      console.error('Error saving class assignments:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges =
    JSON.stringify([...selectedIds].sort()) !==
    JSON.stringify([...initialAssignedIds].sort());

  if (armsLoading) return <div className="ca-loading">Loading arms...</div>;

  const getFullArmName = (arm: typeof arms[0]) => {
    const className = arm.class?.name || classMap[arm.classId]?.name || '';
    return `${className} ${arm.name}`.trim();
  };

  const sortArms = (a: typeof arms[0], b: typeof arms[0]) => {
    return getFullArmName(a).localeCompare(getFullArmName(b), undefined, { numeric: true, sensitivity: 'base' });
  };

  return (
    <div className="class-assignment-container">
      <div className="ca-summary-bar">
        <div className="ca-summary-text">
          <h3 className="ca-summary-title">Class Master Assignments</h3>
          <p className="ca-summary-desc">
            Assign this staff member as the manager for specific class arms.
            <br />
            <b>{initialAssignedIds.length > 0 && ` Currently managing ${initialAssignedIds.length} arm${initialAssignedIds.length === 1 ? '' : 's'}.`}</b>
          </p>
        </div>

        <button className="ca-select-all-btn" onClick={toggleAll}>
          <span className={`ca-mini-check ${allSelected ? 'ca-mini-check--active' : ''}`}>
            {allSelected && <Check size={10} strokeWidth={3.5} />}
          </span>
          {allSelected ? 'Deselect All Available' : 'Select All Available'}
        </button>
      </div>

      {currentSelectedArms.length > 0 && (
        <div className="ca-categories" style={{ paddingBottom: '0rem' }}>
          <div className="ca-category-group ca-category-group--blue" style={{ borderLeftWidth: '4px' }}>
            <div className="ca-category-header" style={{ marginBottom: '0.75rem' }}>
              <div className="ca-category-label-row">
                <span className="ca-category-badge ca-category-badge--blue" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }}>
                  Current Assignments
                </span>
                <span className="ca-category-count">
                  {currentSelectedArms.length} Arm{currentSelectedArms.length === 1 ? '' : 's'} Selected
                </span>
              </div>
            </div>
            <div className="ca-pills-grid">
              {[...currentSelectedArms].sort(sortArms).map(arm => {
                return (
                  <button
                    key={arm.id}
                    className="ca-pill ca-pill--selected"
                    onClick={() => toggleArm(arm.id)}
                    title="Click to deselect"
                  >
                    <span className="ca-pill-check ca-pill-check--selected">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span className="ca-pill-name">{getFullArmName(arm)}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: '1.5rem', borderBottom: '1px solid #f1f5f9', width: '100%' }}></div>
          </div>
        </div>
      )}

      <div className="ca-categories">
        {categoryOrder.map(cat => {
          const catArms = groupedAvailableArms[cat];
          if (!catArms || catArms.length === 0) return null;

          const catIds = catArms.map(a => a.id);
          const allCatSelected = catIds.every(id => selectedIds.includes(id));
          const someCatSelected = catIds.some(id => selectedIds.includes(id));
          const accent = CATEGORY_ACCENT[cat] || 'slate';
          const label = CATEGORY_OPTIONS.find(o => o.value === cat)?.label || cat;

          return (
            <div key={cat} className={`ca-category-group ca-category-group--${accent}`}>
              <div className="ca-category-header">
                <div className="ca-category-label-row">
                  <span className={`ca-category-badge ca-category-badge--${accent}`}>{label}</span>
                  <span className="ca-category-count">
                    {catIds.filter(id => selectedIds.includes(id)).length}&thinsp;/&thinsp;{catIds.length}
                  </span>
                </div>
                <button
                  className={`ca-category-toggle ${allCatSelected ? 'ca-category-toggle--active' : someCatSelected ? 'ca-category-toggle--partial' : ''}`}
                  onClick={() => toggleCategory(catIds)}
                >
                  <span className={`ca-mini-check ${allCatSelected ? 'ca-mini-check--active' : ''}`}>
                    {allCatSelected && <Check size={10} strokeWidth={3.5} />}
                  </span>
                  {allCatSelected ? 'Deselect' : 'Select all'}
                </button>
              </div>

              <div className="ca-pills-grid">
                {[...catArms].sort(sortArms).map(arm => {
                  const isSelected = selectedIds.includes(arm.id);
                  return (
                    <button
                      key={arm.id}
                      className={`ca-pill ${isSelected ? 'ca-pill--selected' : ''}`}
                      onClick={() => toggleArm(arm.id)}
                    >
                      <span className={`ca-pill-check ${isSelected ? 'ca-pill-check--selected' : ''}`}>
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </span>
                      <span className="ca-pill-name">{getFullArmName(arm)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ca-footer">
        {hasChanges && <span className="ca-unsaved-badge">Unsaved changes</span>}
        <button
          className="le-button le-button-primary ca-save-btn"
          disabled={!hasChanges || isUpdating}
          onClick={handleSave}
        >
          {isUpdating ? 'Saving…' : 'Save Assignments'}
        </button>
      </div>
    </div>
  );
};

export default ClassAssignment;