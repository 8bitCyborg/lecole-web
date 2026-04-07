import React from 'react';
import { BookOpen, GraduationCap, AlertCircle } from 'lucide-react';
import '../PersonalDetails/styles.css';

interface StudentAcademicDetailsProps {
  student: any;
}

const StudentAcademicDetails: React.FC<StudentAcademicDetailsProps> = ({ student }) => {
  const hasClass = !!student.class;
  const subjects = student.class?.subjects || [];

  const formatCategory = (category: string) => {
    return category.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  if (!hasClass) {
    return (
      <div className="student-sections-container">
        <div className="le-detail-card academic-empty-card">
          <div className="le-card-icon empty-academic-icon"><AlertCircle size={32} /></div>
          <div className="le-card-info">
            <div className="le-card-label">Enrollment Status</div>
            <div className="le-card-value">No Class Assigned</div>
            <p className="academic-empty-description">
              This student is currently not enrolled in any academic class.
              Please assign them to a class through the <strong>Edit Profile</strong> section.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-sections-container">

      <div className="detail-section">
        <h3 className="detail-section-title">Current Class Subjects - {student.class.name}{student.arm?.name}</h3>
        {subjects.length > 0 ? (
          <div className="le-profile-grid">
            {subjects.map((subject: any) => (
              <div key={subject.id} className="le-detail-card subject-info-card">
                <div className="le-card-icon"><BookOpen size={24} /></div>
                <div className="le-card-info">
                  <div className="le-card-label">{subject.code || 'SUB'}</div>
                  <div className="le-card-value">{subject.name}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="le-detail-card no-subjects-card">
            <div className="le-card-icon"><AlertCircle size={24} /></div>
            <div className="le-card-info">
              <div className="le-card-label">Notice</div>
              <div className="le-card-value">No subjects defined for this class.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAcademicDetails;