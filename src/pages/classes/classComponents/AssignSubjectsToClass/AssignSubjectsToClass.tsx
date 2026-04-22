import React, { useState } from 'react';
import { BookOpen, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetSubjectsQuery } from "@/services/leApi/subjectApi";
import { useAssignSubjectsToClassMutation } from "@/services/leApi/classApi";
import SubjectAssignmentForm from './SubjectAssignmentForm';
import './AssignSubjectsToClass.css';

interface Props {
  classId: string;
  assignedSubjects: { id: string; name: string }[];
}

const AssignSubjectsToClass: React.FC<Props> = ({ classId, assignedSubjects }) => {
  const { data: subjects = [], isLoading } = useGetSubjectsQuery();
  const [assignSubjects, { isLoading: isSaving }] = useAssignSubjectsToClassMutation();
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (selectedIds: string[]) => {
    try {
      await assignSubjects({ classId, subjectIds: selectedIds }).unwrap();
      setIsEditing(false);
    } catch {
      // error is surfaced by RTK Query; keep the edit mode open
    }
  };

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

  // Global empty state: When no subjects exist in the school yet
  if (subjects.length === 0) {
    return (
      <div className="assign-subjects-container">
        <div className="empty-subjects-container">
          <div className="empty-subjects-text">
            <h3 className="empty-subjects-title">No Subjects Created</h3>
            <p className="empty-subjects-desc">
              Your school has not created any subjects yet. You need to create subjects before assigning them to classes.
            </p>
          </div>
          <Link 
            to="/subjects" 
            className="le-button le-button-primary empty-subjects-cta"
          >
            Go to Subjects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="assign-subjects-container">
      <div className="assign-subjects-header" style={{ marginBottom: isEditing ? '1rem' : '1.25rem' }}>
        <h2 className="assign-subjects-title">
          <div className="title-icon-wrapper"><BookOpen size={16} /></div>
          {isEditing ? 'Manage Subjects' : 'Class Subjects'}
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
            <p className="empty-subjects">No subjects assigned to this class yet.</p>
          )}
        </div>
      )}

      {isEditing && (
        <SubjectAssignmentForm
          allSubjects={subjects}
          initiallyAssigned={assignedSubjects}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default AssignSubjectsToClass;
