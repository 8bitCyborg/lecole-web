import React, { useState, useMemo } from 'react';
import { BookOpen, Edit, Search, Plus, Minus, Save, Loader2 } from 'lucide-react';
import { useGetSubjectsQuery } from "@/services/leApi/subjectApi";
import { useAssignSubjectsToClassMutation } from "@/services/leApi/classApi";
import './AssignSubjectsToClass.css';

interface Props {
  classId: string;
  assignedSubjects: { id: string; name: string }[];
}

const AssignSubjectsToClass: React.FC<Props> = ({ classId, assignedSubjects }) => {
  const { data: subjectsMap = {}, isLoading } = useGetSubjectsQuery();
  const [assignSubjects, { isLoading: isSaving }] = useAssignSubjectsToClassMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const subjects = useMemo(() => Object.values(subjectsMap), [subjectsMap]);
  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code?.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = () => {
    setSelected(assignedSubjects.map(s => s.id));
    setIsEditing(true);
  };

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleSave = async () => {
    try {
      await assignSubjects({ classId, subjectIds: selected }).unwrap();
      setIsEditing(false);
    } catch {
      // error is surfaced by RTK Query; keep the edit mode open
    }
  };

  const diff = useMemo(() => {
    const original = assignedSubjects.map(s => s.id);
    const added = selected.filter(id => !original.includes(id)).length;
    const removed = original.filter(id => !selected.includes(id)).length;
    return added + removed;
  }, [assignedSubjects, selected]);

  if (isLoading) {
    return (
      <div className="assign-subjects-container">
        <div className="assign-subjects-header">
          <h2 className="assign-subjects-title">
            <div className="title-icon-wrapper"><BookOpen size={16} /></div>
            Class Subjects
          </h2>
        </div>
        <div className="loading-state" style={{ color: 'var(--muted-foreground)', padding: '1rem', fontSize: '0.875rem' }}>
          Loading subjects...
        </div>
      </div>
    );
  }

  return (
    <div className="assign-subjects-container">
      <div className="assign-subjects-header" style={{ marginBottom: isEditing ? '1rem' : '1.25rem' }}>
        <h2 className="assign-subjects-title">
          <div className="title-icon-wrapper"><BookOpen size={16} /></div>
          {isEditing && 'Manage Subjects'}
          {!isEditing && 'Class Subjects'}
        </h2>
        {!isEditing && (
          <button className="le-button le-button-outline" style={{ height: '2.25rem', paddingInline: '1rem', fontSize: '0.8125rem' }} onClick={startEdit}>
            <Edit size={12} style={{ marginRight: '0.4rem' }} /> Manage
          </button>
        )}
      </div>

      {!isEditing && (
        <div className="subjects-view-list">
          {assignedSubjects.length > 0 && assignedSubjects.map(s => (
            <div key={s.id} className="subject-view-chip">{s.name}</div>
          ))}
          {assignedSubjects.length === 0 && (
            <p className="empty-subjects">No subjects assigned yet.</p>
          )}
        </div>
      )}

      {isEditing && (
        <div className="edit-mode-content">
          <div className="search-container">
            <Search size={14} className="search-icon" />
            <input className="search-input" placeholder="Find subjects..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="subjects-edit-grid">
            {filtered.map(s => {
              const isSelected = selected.includes(s.id);
              const wasAssigned = assignedSubjects.some(os => os.id === s.id);
              return (
                <div
                  key={s.id}
                  className={`subject-edit-card ${isSelected ? 'is-selected' : ''} ${wasAssigned ? 'was-assigned' : ''}`}
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
                      {isSelected && 'ASSIGNED'}
                      {!isSelected && 'REMOVING'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="edit-actions-footer">
            <div className="changes-summary">
              {diff > 0 && (
                <>
                  <span className="change-count">{diff}</span> change{diff > 1 && 's'} pending
                </>
              )}
              {diff === 0 && 'No changes'}
            </div>
            <div className="footer-btns">
              <button className="le-button le-button-outline" style={{ height: '2.5rem', paddingInline: '1.25rem', fontSize: '0.875rem' }} onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</button>
              <button className="le-button le-button-primary" style={{ height: '2.5rem', paddingInline: '1.5rem', fontSize: '0.875rem' }} onClick={handleSave} disabled={isSaving || diff === 0}>
                {isSaving
                  ? <><Loader2 size={14} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} /> Saving...</>
                  : <><Save size={14} style={{ marginRight: '0.5rem' }} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignSubjectsToClass;
