import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User, Mail, Phone, BookOpen, UserCheck } from 'lucide-react';
import { useGetTeacherQuery } from '../../services/leApi/teacherApi';
import './Teachers.css';

const TeacherDetails = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const { data: teacher, isLoading, isError } = useGetTeacherQuery(teacherId!);

  const handleBack = () => {
    navigate('/teachers');
  };

  if (isLoading) {
    return <div className="teachers-page-container loading-state">Loading teacher details...</div>;
  }

  if (isError || !teacher) {
    return (
      <div className="teachers-page-container">
        <button className="back-navigator-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Teachers
        </button>
        <div className="teachers-empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2 className="empty-state-title">Teacher Not Found</h2>
          <p className="empty-state-description">
            The teacher you are looking for might have been removed or the URL is incorrect.
          </p>
          <button className="le-button le-button-primary" onClick={handleBack}>
            Back to Overview
          </button>
        </div>
      </div>
    );
  }

  const { user } = teacher;

  return (
    <div className="teachers-page-container">
      <button className="back-navigator-btn" onClick={handleBack}>
        <ArrowLeft size={18} />
        Back to Teachers
      </button>

      <div className="teachers-header-banner">
        <div className="teachers-header-content">
          <h1 className="teachers-title">
            {user.first_name} {user.last_name}
          </h1>
          <p className="teachers-subtitle">
            Profile overview for <strong>{user.first_name} {user.last_name}</strong>. Manage contact 
            information, staff assignments, and track responsibilities within the institution.
          </p>

          <div className="class-meta-counts">
             {teacher.staffId && (
               <span className="class-id-badge">Staff ID: {teacher.staffId}</span>
             )}
             <span className="class-id-badge">Role: {user.role}</span>
          </div>
        </div>
        <div className="banner-actions">
          <button className="le-button le-button-primary">
            <Edit size={16} style={{ marginRight: '8px' }} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="arm-details-grid">
        {/* Contact Information */}
        <div className="teachers-table-container" style={{ padding: '2rem' }}>
          <h3 className="section-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8.5rem' }}>
             <User size={18} /> Basic Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span className="teacher-email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>Full Name</span>
              <p style={{ margin: '0.25rem 0 0', fontWeight: 600, fontSize: '1.1rem' }}>{user.first_name} {user.last_name}</p>
            </div>
            <div>
               <span className="teacher-email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Mail size={14} /> Email Address
               </span>
               <p style={{ margin: '0.25rem 0 0', fontWeight: 600, fontSize: '1.1rem' }}>{user.email || 'N/A'}</p>
            </div>
            <div>
               <span className="teacher-email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Phone size={14} /> Phone Number
               </span>
               <p style={{ margin: '0.25rem 0 0', fontWeight: 600, fontSize: '1.1rem' }}>{user.phone}</p>
            </div>
          </div>
        </div>

        {/* Academic Profile */}
        <div className="teachers-table-container" style={{ padding: '2rem' }}>
           <h3 className="section-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <BookOpen size={18} /> Academic Roles
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <span className="teacher-email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={14} /> Class Master Assignment
                </span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 600, fontSize: '1.1rem', color: teacher.arm ? '#1e40af' : '#64748b' }}>
                  {teacher.arm ? `${teacher.arm.name}` : 'No Class Assigned'}
                </p>
              </div>
              
              <div>
                <span className="teacher-email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>Assigned Subjects</span>
                <div className="class-subjects-list" style={{ marginTop: '0.75rem' }}>
                  {teacher.subjects && teacher.subjects.length > 0 ? (
                    teacher.subjects.map((sub: any) => (
                      <span key={sub.id} className="assigned-subject-pill">
                        {sub.name}
                      </span>
                    ))
                  ) : (
                    <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.9rem', margin: 0 }}>No subjects assigned to this teacher yet.</p>
                  )}
                </div>
              </div>
           </div>
        </div>
      </div>

      {teacher.bio && (
        <div className="teachers-table-container" style={{ padding: '2rem', marginTop: '2rem' }}>
          <h3 className="section-title" style={{ marginBottom: '1rem' }}>Teacher Biography</h3>
          <p style={{ lineHeight: 1.6, color: '#334155', margin: 0 }}>{teacher.bio}</p>
        </div>
      )}
    </div>
  );
};

export default TeacherDetails;
