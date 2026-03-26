import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2 } from 'lucide-react';
import { CATEGORY_OPTIONS } from '../../../services/leApi/classApi';
import type { Category, Class } from '../../../services/leApi/classApi';
import '../Classes.css';

interface ClassListingProps {
  classes: Class[];
  onDeleteClick: (e: React.MouseEvent, cls: Class) => void;
}

const ClassListing: React.FC<ClassListingProps> = ({ classes, onDeleteClick }) => {
  const navigate = useNavigate();

  // Group classes by category
  const groupedClasses = classes.reduce((acc, cls) => {
    const category = cls.category || 'OTHER';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(cls);
    return acc;
  }, {} as Record<string, Class[]>);

  // Get labels for categories
  const getCategoryLabel = (cat: string) => {
    return CATEGORY_OPTIONS.find(opt => opt.value === cat)?.label || cat;
  };

  // Define order of categories for display
  const categoryOrder: Category[] = [
    'EARLY_YEARS',
    'BASIC',
    'JUNIOR_SECONDARY',
    'SENIOR_SECONDARY',
    'OTHER'
  ];

  return (
    <div className="class-listing-wrapper">
      {categoryOrder.map(category => {
        const categoryClasses = groupedClasses[category];
        if (!categoryClasses || categoryClasses.length === 0) return null;

        return (
          <div key={category} className="category-group">
            <h3 className="category-header">{getCategoryLabel(category)}</h3>
            <div className="classes-table-container">
              <table className="classes-table">
                <thead>
                  {/* <tr>
                    <th>Class Name</th>
                    <th>Arms</th>
                    <th>Subjects</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr> */}
                </thead>
                <tbody>
                  {categoryClasses.map((cls) => (
                    <tr
                      key={cls.id}
                      onClick={() => navigate(`/classes/${cls.id}`)}
                    >
                      <td data-label="Class Name">
                        <div className="class-name-cell">
                          <span className="class-name-text">{cls.name}</span>
                        </div>
                      </td>
                      <td data-label="Arms">
                        {cls._count?.arms || 0} {cls._count?.arms === 1 ? 'Arm' : 'Arms'}
                      </td>
                      <td data-label="Subjects">
                        {cls._count?.subjects || 0} {cls._count?.subjects === 1 ? 'Subject' : 'Subjects'}
                      </td>
                      <td data-label="Actions" style={{ textAlign: 'right' }}>
                        <div className="class-table-actions">
                          <button
                            className="chevron-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/classes/${cls.id}`);
                            }}
                          >
                            <ChevronRight size={18} className="class-table-icon" color='#00f' />
                          </button>
                          <button
                            className="delete-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteClick(e, cls);
                            }}
                          >
                            <Trash2 size={18} color='#f00' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClassListing;
