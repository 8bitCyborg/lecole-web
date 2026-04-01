import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, BookOpen } from 'lucide-react';
import { useGetStaffMemberQuery } from '../../services/leApi/staffApi';
import ClassAssignment from './components/ClassAssignment/ClassAssignment';

import './Staff.css';

const StaffDetails = () => {

  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const { data: staff, isLoading, isError } = useGetStaffMemberQuery(staffId!);

  console.log('staff', staff);

  const handleBack = () => {
    navigate('/staff');
  };

  if (isLoading) {
    return <div className="staff-page-container loading-state">Loading staff details...</div>;
  }

  if (isError || !staff) {
    return (
      <div className="staff-page-container">
        <button className="back-navigator-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Staff
        </button>
        <div className="staff-empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2 className="empty-state-title">Staff Member Not Found</h2>
          <p className="empty-state-description">
            The staff member you are looking for might have been removed or the URL is incorrect.
          </p>
          <button className="le-button le-button-primary" onClick={handleBack}>
            Back to Overview
          </button>
        </div>
      </div>
    );
  }

  const { user } = staff;

  return (
    <div className="staff-page-container">
      <button className="back-navigator-btn" onClick={handleBack}>
        <ArrowLeft size={18} />
        Back to Staff
      </button>

      <div className="staff-header-banner">
        <div className="staff-header-content">
          <h1 className="staff-title">
            {staff.title && `${staff.title}. `}{user.firstName} {user.lastName}
          </h1>
          <p className="staff-subtitle">
            Profile overview for <strong>{user.firstName} {user.lastName}</strong>. Manage contact
            information, staff assignments, and track responsibilities within the institution.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0rem', margin: '1.25rem 0', color: 'rgba(255, 255, 255, 0.9)' }}>
            {user.email && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <Mail size={16} /> {user.email}
              </span>
            )}
            {user.phone && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <Phone size={16} /> {user.phone}
              </span>
            )}
          </div>

          <div className="staff-meta">
            {staff.staffId && (
              <div className="staff-meta-item">
                <span className="staff-meta-label">Staff ID</span>
                <span className="staff-meta-value">{staff.staffId}</span>
              </div>
            )}
            <div className="staff-meta-item">
              <span className="staff-meta-label">Designation</span>
              <span className="staff-meta-value">{staff.designation}</span>
            </div>
            <div className="staff-meta-item">
              <span className="staff-meta-label">Role</span>
              <span className="staff-meta-value">{staff.isTeachingStaff ? 'Teaching' : 'Non-Teaching'}</span>
            </div>
          </div>
        </div>

        <div className="banner-actions">
          <button className="le-button le-button-primary">
            <Edit size={16} style={{ marginRight: '8px' }} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="staff-table-container" style={{ padding: '2rem' }}>
        <h3 className="section-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} /> Academic Roles
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ClassAssignment staff={staff} />

          <div>
            <span className="staff-email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>Assigned Subjects</span>
            <div className="class-subjects-list" style={{ marginTop: '0.75rem' }}>
              {staff.subjects && staff.subjects.length > 0 ? (
                staff.subjects.map((sub: any) => (
                  <span key={sub.id} className="assigned-subject-pill">
                    {sub.name}
                  </span>
                ))
              ) : (
                <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.9rem', margin: 0 }}>No subjects assigned to this staff member yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {staff.bio && (
        <div className="staff-table-container" style={{ padding: '2rem', marginTop: '2rem' }}>
          <h3 className="section-title" style={{ marginBottom: '1rem' }}>Staff Biography</h3>
          <p style={{ lineHeight: 1.6, color: '#334155', margin: 0 }}>{staff.bio}</p>
        </div>
      )}
    </div>
  );
};

export default StaffDetails;
