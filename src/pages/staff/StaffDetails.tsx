import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, BookOpen, Presentation } from 'lucide-react';
import { useGetStaffMemberQuery } from '../../services/leApi/staffApi';
import ClassAssignment from './components/ClassAssignment/ClassAssignment';
import SubjectAssignment from './components/SubjectAssignment/SubjectAssignment';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

import './Staff.css';

const StaffDetails = () => {

  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const { data: staff, isLoading, isError } = useGetStaffMemberQuery(staffId!);

  console.log('staff', staff);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div className="staff-page-container loading-state">Loading staff details...</div>;
  }

  if (isError || !staff) {
    return (
      <div className="staff-page-container">
        <button className="back-navigator-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back
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
        Back
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

      <div className="staff-listing-section">
        <div className="staff-tabs-card">
          <Tabs defaultValue="classes" className="w-full">
            <TabsList className="staff-tabs-list">
              <TabsTrigger value="classes" className="staff-tabs-trigger">
                <Presentation size={18} className="mr-2" />
                Class Assignments
              </TabsTrigger>
              <TabsTrigger value="subjects" className="staff-tabs-trigger">
                <BookOpen size={18} className="mr-2" />
                Assigned Subjects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classes" className="staff-tabs-content">
              <ClassAssignment staff={staff} />
            </TabsContent>

            <TabsContent value="subjects" className="staff-tabs-content">
              <SubjectAssignment staff={staff} />
            </TabsContent>
          </Tabs>
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
