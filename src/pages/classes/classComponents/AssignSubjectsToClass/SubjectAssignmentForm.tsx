import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Save, Loader2 } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  code?: string;
}

interface SubjectAssignmentFormProps {
  allSubjects: Subject[];
  initiallyAssigned: Subject[];
  onSave: (selectedIds: string[]) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const SubjectAssignmentForm: React.FC<SubjectAssignmentFormProps> = ({
  allSubjects,
  initiallyAssigned,
  onSave,
  onCancel,
  isSaving,
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(
    initiallyAssigned.map((s) => s.id)
  );

  const filtered = useMemo(() => 
    allSubjects.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code?.toLowerCase().includes(search.toLowerCase())
    ),
    [allSubjects, search]
  );

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const diff = useMemo(() => {
    const original = initiallyAssigned.map((s) => s.id);
    const added = selected.filter((id) => !original.includes(id)).length;
    const removed = original.filter((id) => !selected.includes(id)).length;
    return added + removed;
  }, [initiallyAssigned, selected]);

  const handleSave = () => onSave(selected);

  return (
    <div className="edit-mode-content">
      <div className="search-container">
        <Search size={14} className="search-icon" />
        <input
          className="search-input"
          placeholder="Find subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="subjects-edit-grid">
        {filtered.map((s) => {
          const isSelected = selected.includes(s.id);
          const wasAssigned = initiallyAssigned.some((os) => os.id === s.id);
          return (
            <div
              key={s.id}
              className={`subject-edit-card ${isSelected ? 'is-selected' : ''} ${
                wasAssigned ? 'was-assigned' : ''
              }`}
              onClick={() => toggle(s.id)}
            >
              <div className="selection-indicator">
                {wasAssigned && <Minus size={12} />}
                {!wasAssigned && <Plus size={12} />}
              </div>
              <span className="subject-name">{s.name}</span>
              {s.code && <span className="subject-code">{s.code}</span>}
              {wasAssigned && (
                <span className="was-assigned-indicator">
                  {isSelected ? 'ASSIGNED' : 'REMOVING'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="edit-actions-footer">
        <div className="changes-summary">
          {diff > 0 ? (
            <>
              <span className="change-count">{diff}</span> change
              {diff > 1 && 's'} pending
            </>
          ) : (
            'No changes'
          )}
        </div>
        <div className="footer-btns">
          <button
            className="le-button le-button-outline"
            style={{
              height: '2.5rem',
              paddingInline: '1.25rem',
              fontSize: '0.875rem',
            }}
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="le-button le-button-primary"
            style={{
              height: '2.5rem',
              paddingInline: '1.5rem',
              fontSize: '0.875rem',
            }}
            onClick={handleSave}
            disabled={isSaving || diff === 0}
          >
            {isSaving ? (
              <>
                <Loader2
                  size={14}
                  style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }}
                />{' '}
                Saving...
              </>
            ) : (
              <>
                <Save size={14} style={{ marginRight: '0.5rem' }} /> Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectAssignmentForm;
