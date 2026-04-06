import {
  Mail,
  Phone,
  BookOpen,
  History,
} from 'lucide-react';
import './styles.css';

interface StudentPersonalDetailsProps {
  student: any;
}

const StudentPersonalDetails: React.FC<StudentPersonalDetailsProps> = ({ student }) => {
  const sections = [
    {
      title: 'Institutional Enrollment',
      items: [
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

export default StudentPersonalDetails;