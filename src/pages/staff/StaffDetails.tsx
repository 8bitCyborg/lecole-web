import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User, Mail, Phone, BookOpen, UserCheck } from 'lucide-react';
import { useGetStaffMemberQuery } from '../../services/leApi/staffApi';
import './Staff.css';

const StaffDetails = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const { data: staff, isLoading, isError } = useGetStaffMemberQuery(staffId!);

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

          <div className="class-meta-counts">
             {staff.staffId && (
               <span className="class-id-badge">Staff ID: {staff.staffId}</span>
             )}
             <span className="class-id-badge">Designation: {staff.designation}</span>
             <span className="class-id-badge">{staff.isTeachingStaff ? 'Teaching' : 'Non-Teaching'}</span>
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
        <div className="staff-table-container" style={{ padding: '2rem' }}>
          <h3 className="section-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8.5rem' }}>
             <User size={18} /> Basic Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span className="staff-email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>Full Name</span>
              <p style={{ margin: '0.25rem 0 0', fontWeight: 600, fontSize: '1.1rem' }}>{user.firstName} {user.lastName}</p>
            </div>
            <div>
               <span className="staff-email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Mail size={14} /> Email Address
               </span>
               <p style={{ margin: '0.25rem 0 0', fontWeight: 600, fontSize: '1.1rem' }}>{user.email || 'N/A'}</p>
            </div>
            <div>
               <span className="staff-email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Phone size={14} /> Phone Number
               </span>
               <p style={{ margin: '0.25rem 0 0', fontWeight: 600, fontSize: '1.1rem' }}>{user.phone}</p>
            </div>
          </div>
        </div>

        {/* Academic Profile */}
        <div className="staff-table-container" style={{ padding: '2rem' }}>
           <h3 className="section-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <BookOpen size={18} /> Academic Roles
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <span className="staff-email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={14} /> Class Master Assignment
                </span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 600, fontSize: '1.1rem', color: staff.arm ? '#1e40af' : '#64748b' }}>
                  {staff.arm ? `${staff.arm.name}` : 'No Class Assigned'}
                </p>
              </div>
              
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
