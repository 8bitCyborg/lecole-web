import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useGetClassesQuery } from '../../services/leApi/classApi';
import AddClassForm from './components/AddClassForm';
import './Classes.css';

const ClassPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: classes = [] } = useGetClassesQuery();
  const navigate = useNavigate();

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  return (
    <div className="classes-page-container">
      <div className="classes-header-banner">
        <div className="classes-header-content">
          <h1 className="classes-title">Manage Your Classes</h1>
          <p className="classes-subtitle">
            Efficiently organize your school's academic structure. Create and manage all classes, 
            track student distribution, and assign teachers to their respective departments.
          </p>
        </div>
        <button 
          className="le-button le-button-primary add-class-btn-header"
          onClick={() => setShowAddModal(true)}
        >
          Add New Class
        </button>
      </div>

      <div className="classes-listing-section">
        {classes.length === 0 ? (
          <div className="classes-empty-state">
            <div className="empty-state-icon">🏫</div>
            <h2 className="empty-state-title">No Classes Created Yet</h2>
            <p className="empty-state-description">
              Start by creating your first class. Once added, your classes will appear here for easy management 
              and student enrollment.
            </p>
            <button 
              className="le-button le-button-primary add-class-btn-empty"
              onClick={() => setShowAddModal(true)}
            >
              Get Started – Add a Class
            </button>
          </div>
        ) : (
          <div className="classes-grid">
            {classes.map((cls: any) => (
              <div 
                key={cls.id} 
                className="class-card"
                onClick={() => navigate(`/classes/${cls.id}`)}
              >
                <div className="class-card-content">
                  <h3 className="class-name-title">{cls.name}</h3>
                  <ChevronRight size={20} className="class-card-arrow" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="modal-close" 
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AddClassForm 
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPage;