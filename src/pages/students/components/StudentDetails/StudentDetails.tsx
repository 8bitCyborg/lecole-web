import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Edit,
  History,
  Fingerprint,
  Layers
} from 'lucide-react';
import { useGetStudentByIdQuery } from '@/services/leApi/studentApi';
import './StudentDetails.css';

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

  const sections = [
    {
      title: 'Institutional Enrollment',
      items: [
        { label: 'Admission No.', value: student.admissionNumber, icon: <Fingerprint size={24} /> },
        { label: 'Current Class', value: student.class?.name || 'Unassigned', icon: <BookOpen size={24} /> },
        { label: 'Arm / Section', value: student.arm?.name || 'Unassigned', icon: <LayersIcon size={24} /> },
        { label: 'Enrollment Date', value: new Date(student.createdAt).toLocaleDateString(), icon: <History size={24} /> },
      ]
    },
    {
      title: 'Guardian & Primary Contact',
      items: [
        { label: 'Guardian Phone', value: student.guardianPhone || 'N/A', icon: <Phone size={24} /> },
        { label: 'Guardian Email', value: student.guardianEmail || 'N/A', icon: <Mail size={24} /> },
      ]
    }
  ];

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

      <div className="student-sections-container">
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="detail-section">
            <h3 className="detail-section-title">{section.title}</h3>
            <div className="le-profile-grid">
              {section.items.map((item, index) => (
                <div key={index} className="le-detail-card">
                  <div className="le-card-icon">{item.icon}</div>
                  <div className="le-card-info">
                    <div className="le-card-label">{item.label}</div>
                    <div className="le-card-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LayersIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

export default StudentDetails;