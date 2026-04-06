import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Edit,
  Fingerprint,
} from 'lucide-react';
import { useGetStudentByIdQuery } from '@/services/leApi/studentApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentPersonalDetails from './components/PersonalDetails';
import StudentFinanceDetails from './components/FinanceDetails';
import './components/PersonalDetails/styles.css';

const StudentDetails = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading, isError } = useGetStudentByIdQuery(studentId!);

  const handleBack = () => {
    navigate('/students');
  };

  if (isLoading) {
    return <div className="student-profile-container loading-state">Loading student profile...</div>;
  }

  if (isError || !student) {
    return (
      <div className="student-profile-container">
        <button className="back-navigator-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Students
        </button>
        <div className="students-empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2 className="empty-state-title">Profile Not Found</h2>
          <button className="le-button le-button-primary" onClick={handleBack}>
            Return to Overview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile-container">
      <button className="back-navigator-btn" onClick={handleBack}>
        <ArrowLeft size={18} />
        Back to Students
      </button>

      <div className="student-header-banner">
        <div className="student-header-content">
          <div className="student-title-row">
            <div className="student-avatar-mini">
              {student.user.firstName[0]}{student.user.lastName[0]}
            </div>
            <h1 className="student-details-name">
              {student.user.firstName} {student.user.lastName}
            </h1>
            <div className="banner-badge-group">
              <span className={`status-tag status-${student.status.toLowerCase()}`}>
                {student.status}
              </span>
              <span className={`status-tag ${student.isFeesPaid ? 'status-active' : 'status-withdrawn'}`}>
                {student.isFeesPaid ? 'Fully Paid' : 'Outstanding Balance'}
              </span>
            </div>
          </div>

          <p className="student-subtitle">
            Comprehensive academic profile for <strong>{student.user.firstName} {student.user.lastName}</strong>.
            This record facilitates student monitoring, performance tracking, and institutional administration
            within the <strong>{student.class?.name || 'Unassigned'}</strong> framework.
          </p>

          <div className="banner-stats-row">
            <div className="banner-stat-item">
              <Fingerprint size={16} className="stat-icon" />
              <div className="stat-label-group">
                <span className="stat-label">Admission ID</span>
                <span className="stat-value">{student.admissionNumber}</span>
              </div>
            </div>
            <div className="banner-stat-item">
              <Mail size={16} className="stat-icon" />
              <div className="stat-label-group">
                <span className="stat-label">Email</span>
                <span className="stat-value">{student.user.email || 'N/A'}</span>
              </div>
            </div>
            <div className="banner-stat-item">
              <Calendar size={16} className="stat-icon" />
              <div className="stat-label-group">
                <span className="stat-label">Date of Birth</span>
                <span className="stat-value">
                  {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button className="le-button le-button-primary profile-edit-btn">
          <Edit size={16} style={{ marginRight: '8px' }} />
          Edit Profile
        </button>
      </div>

      <Tabs defaultValue="personal" className="student-tabs">
        <TabsList className="student-tabs-list">
          <TabsTrigger value="personal" className="student-tabs-trigger">Personal</TabsTrigger>
          <TabsTrigger value="academic" className="student-tabs-trigger">Academic</TabsTrigger>
          <TabsTrigger value="finance" className="student-tabs-trigger">Financial</TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="student-tabs-content">
          <StudentPersonalDetails student={student} />
        </TabsContent>
        <TabsContent value="finance" className="student-tabs-content">
          <StudentFinanceDetails student={student} />
        </TabsContent>
        <TabsContent value="academic" className="student-tabs-content">
          <div>
            <p>Coming Soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetails;