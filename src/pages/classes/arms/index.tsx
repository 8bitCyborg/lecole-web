import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Users, BarChart3, Plus } from 'lucide-react';
import { useGetStudentsByArmQuery } from '@/services/leApi/classApi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ClassMaster from '@/pages/classes/arms/armComponents/ClassMaster';
import AddArmForm from '@/pages/classes/classComponents/AddArmForm/AddArmForm';
import AddStudentForm from '@/pages/students/components/AddStudentForm/AddStudentForm';
import EnrolledStudents from '@/pages/classes/arms/armComponents/EnrolledStudents';
import Grades from './armComponents/Grades';

import '../Classes.css';
import './styles.css';

const ClassArmDetails = () => {
  const { classId, armId } = useParams<{ classId: string; armId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const state = location.state as { className?: string; armName?: string; capacity?: number };
  const { data: students = [], refetch } = useGetStudentsByArmQuery(armId!);

  const currentClass = { name: state?.className || 'Class' };
  const currentArm = {
    name: state?.armName || '',
    capacity: state?.capacity
  };

  const handleBack = () => {
    navigate(`/classes/${classId}`);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
  };

  const handleEnrollSuccess = () => {
    setShowEnrollModal(false);
    refetch();
  };

  return (
    <div className="classes-page-container">
      <button
        className="back-navigator-btn"
        onClick={handleBack}
      >
        <ArrowLeft size={18} />
        Back to {currentClass?.name || 'Class'}
      </button>

      <div className="classes-header-banner">
        <div className="classes-header-content">
          <h1 className="classes-title">
            {currentClass?.name}{currentArm?.name}
          </h1>

          <p className="classes-subtitle" style={{ maxWidth: '600px' }}>
            Manage the specifics of this arm. This section allows for detailed student monitoring,
            class master assignments, and specialized curriculum tracking for <strong>{currentClass?.name} {currentArm?.name}</strong>.
          </p>
          <div className="classes-meta-info banner-stats-row">
            <div className="banner-stat-item">
              <BarChart3 size={16} className="stat-icon" />
              <div className="stat-label-group">
                <span className="stat-label">Capacity</span>
                <span className="stat-value">{currentArm.capacity || 'Not Set'}</span>
              </div>
            </div>
            <div className="banner-stat-item">
              <Users size={16} className="stat-icon" />
              <div className="stat-label-group">
                <span className="stat-label">Enrolled</span>
                <span className="stat-value">{students.length} / {currentArm.capacity || '∞'}</span>
              </div>
            </div>
            {classId && armId && (
              <ClassMaster classId={classId} armId={armId} />
            )}
          </div>
        </div>

        <div className="banner-action-group">
          <button
            className="le-button le-button-primary add-class-btn-header"
            onClick={() => setShowEnrollModal(true)}
            style={{ position: 'relative', bottom: 'auto', right: 'auto' }}
          >
            <Plus size={16} style={{ marginRight: '8px' }} />
            Enroll Student
          </button>
          <button
            className="le-button le-button-primary add-class-btn-header"
            onClick={() => setShowEditModal(true)}
            style={{ position: 'relative', bottom: 'auto', right: 'auto', background: 'rgba(255, 255, 255, 0.1) !important', border: '1px solid rgba(255, 255, 255, 0.3) !important', color: 'white !important' }}
          >
            <Edit size={16} style={{ marginRight: '8px' }} />
            Update Arm
          </button>
        </div>
      </div>

      <div className="classes-listing-section">
        {!currentArm.name ? (
          <div className="classes-empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h2 className="empty-state-title">Subclass Arm Not Found</h2>
            <p className="empty-state-description">
              The arm you are looking for might have been removed or the URL is incorrect.
            </p>
            <button
              className="le-button le-button-primary add-class-btn-empty"
              onClick={handleBack}
            >
              Back to Class Overview
            </button>
          </div>
        ) : (
          <div className="arms-tabs-card">
            <Tabs defaultValue="students" className="w-full">
              <TabsList className="arms-tabs-list">
                <TabsTrigger value="students" className="arms-tabs-trigger">
                  <Users size={18} />
                  Students
                </TabsTrigger>
                <TabsTrigger value="assessments" className="arms-tabs-trigger">
                  <BarChart3 size={18} />
                  Broadsheet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="arms-tabs-content">
                <EnrolledStudents currentArmName={currentArm.name} />
              </TabsContent>

              <TabsContent value="assessments" className="arms-tabs-content">
                <Grades classId={classId || ''} armId={armId || ''} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowEditModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AddArmForm
              classId={classId || ''}
              armId={armId}
              isEdit={true}
              initialValues={{
                name: currentArm.name,
                capacity: currentArm.capacity,
              }}
              onSuccess={handleEditSuccess}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}

      {showEnrollModal && (
        <div className="modal-overlay" onClick={() => setShowEnrollModal(false)}>
          <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowEnrollModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AddStudentForm
              initialValues={{
                classId: classId,
                armId: armId
              }}
              onSuccess={handleEnrollSuccess}
              onCancel={() => setShowEnrollModal(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default ClassArmDetails;