import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGetClassesQuery, useGetArmsQuery } from '../../services/leApi/classApi';
import AddArmForm from './components/AddArmForm';
import './Classes.css';

const ClassArmsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: classes = [] } = useGetClassesQuery();
  const { data: arms = [], isLoading: armsLoading } = useGetArmsQuery(classId || '');

  // Find current class name
  const currentClass = classes.find((c: any) => c.id === classId);

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  return (
    <div className="classes-page-container">
      <button
        className="back-navigator-btn"
        onClick={() => navigate('/classes')}
      >
        <ArrowLeft size={18} />
        Back to Classes
      </button>
      <div className="classes-header-banner">
        <div className="classes-header-content">
          <h1 className="classes-title">{currentClass?.name || 'Class Details'}</h1>
          <div className="classes-meta-info">
            <span className="class-id-badge">ID: {classId}</span>
          </div>
          <p className="classes-subtitle">
            Manage subclasses and academic arms for <strong>{currentClass?.name}</strong>.
            This is the hub for arm-level distribution, student assignments, and class-specific scheduling.
          </p>
        </div>
        <button
          className="le-button le-button-primary add-class-btn-header"
          onClick={() => setShowAddModal(true)}
        >
          Add New Arm
        </button>
      </div>

      <div className="classes-listing-section">
        {armsLoading ? (
          <div className="loading-state">Loading Arms...</div>
        ) : arms.length === 0 ? (
          <div className="classes-empty-state">
            <div className="empty-state-icon">📂</div>
            <h2 className="empty-state-title">No Arms Defined Yet</h2>
            <p className="empty-state-description">
              Create different arms or sections for this class (e.g., A, B, Gold, Silver) to begin student enrollment at the arm level.
            </p>
            <button
              className="le-button le-button-primary add-class-btn-empty"
              onClick={() => setShowAddModal(true)}
            >
              Create Your First Arm
            </button>
          </div>
        ) : (
          <div className="classes-grid">
            {arms.map((arm: any) => (
              <div key={arm.id} className="class-card">
                <div className="class-card-content">
                  <div className="arm-info">
                    <h3 className="class-name-title">{currentClass?.name}{arm.name}</h3>
                    {arm.capacity && (
                      <span className="arm-capacity-badge">
                        Capacity: {arm.capacity}
                      </span>
                    )}
                  </div>
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
            <AddArmForm
              classId={classId || ''}
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassArmsPage;

