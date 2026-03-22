import React from 'react';
import type { School } from '../../../store/slices/schoolSlice';
import {
  School as SchoolIcon,
  BookOpen,
  GraduationCap,
  Calendar,
  Layers,
  Users,
  User,
  Quote,
  Globe,
  History
} from 'lucide-react';

interface SchoolDetailsCardProps {
  school: School | null;
}

const SchoolDetailsCard: React.FC<SchoolDetailsCardProps> = ({ school }) => {
  if (!school) return null;

  const formatValue = (val: string | null | undefined) => {
    if (!val) return 'N/A';
    return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const sections = [
    {
      title: 'Academic Framework',
      items: [
        { label: 'School Type', value: formatValue(school.type), icon: <SchoolIcon size={24} /> },
        { label: 'Curriculum', value: formatValue(school.curriculum), icon: <BookOpen size={24} /> },
        { label: 'Grading System', value: formatValue(school.grading_system), icon: <GraduationCap size={24} /> },
      ]
    },

    {
      title: 'Administration & History',
      items: [
        { label: 'Ownership', value: formatValue(school.ownership_type), icon: <Users size={24} /> },
        { label: 'Proprietor', value: school.proprietor || 'N/A', icon: <User size={24} /> },
        { label: 'Inception', value: formatDate(school.date_of_inception), icon: <History size={24} /> },
      ]
    },
    {
      title: 'Institutional Brand',
      items: [
        { label: 'School Motto', value: school.motto || 'N/A', icon: <Quote size={24} /> },
        {
          label: 'Official Website',
          value: school.website || 'N/A',
          icon: <Globe size={24} />,
          isLink: !!school.website
        },
      ]
    }
  ];

  return (
    <div className="school-details-container">
      {sections.map((section, sIndex) => (
        <div key={sIndex} className="detail-section">
          <h3 className="detail-section-title">{section.title}</h3>
          <div className="le-profile-grid">
            {section.items.map((item, index) => (
              <div key={index} className="le-detail-card">
                <div className="le-card-icon">{item.icon}</div>
                <div className="le-card-info">
                  <div className="le-card-label">{item.label}</div>
                  <div className="le-card-value">
                    {item.isLink ? (
                      <a
                        href={item.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="le-card-link"
                      >
                        {item.value.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchoolDetailsCard;
