import { useState } from 'react';
import { Settings, ClipboardList } from 'lucide-react';
import GradeModuleForm from './components/GradeModuleForm';
import GradeModuleListing from './components/GradeModuleListing';
import { useGetGradingModulesQuery } from '@/services/leApi/gradingApi';
import type { GradingModule } from '@/services/leApi/gradingApi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import '../Academics.css';
import './styles.css';

const Grading = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeModule, setActiveModule] = useState<GradingModule | undefined>(undefined);
  const { data: modules = [] } = useGetGradingModulesQuery();

  const currentTotalPercentage = modules.reduce((sum, m) => sum + (m.percentage || 0), 0);

  const handleEdit = (module: GradingModule) => {
    setActiveModule(module);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveModule(undefined);
  };

  return (
    <div className="grading-page-container">
      <div className="grading-header-banner">
        <div className="grading-header-content">
          <h1 className="grading-title">Academic Grading</h1>
          <p className="grading-subtitle">
            Configure your school's grading system. Define grade modules, set weights, and manage student assessments with precision and ease.
          </p>
        </div>
      </div>

      <div className="grading-content-section">
        <div className="grading-tabs-card">
          <Tabs defaultValue="records" className="w-full">
            <TabsList className="grading-tabs-list">
              <TabsTrigger value="records" className="grading-tabs-trigger">
                <ClipboardList size={18} />
                Records
              </TabsTrigger>
              <TabsTrigger value="config" className="grading-tabs-trigger">
                <Settings size={18} />
                Configuration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="grading-tabs-content">
              <GradeModuleListing
                onEdit={handleEdit}
                onAdd={() => setShowModal(true)}
                totalPercentage={currentTotalPercentage}
              />
            </TabsContent>

            <TabsContent value="records" className="grading-tabs-content">
              <div className="academics-empty-state" style={{ background: 'white', borderRadius: '0 0 1rem 1rem', marginTop: 0 }}>
                <div className="empty-state-icon">📝</div>
                <h3 className="empty-state-title">Assessment Records Pending</h3>
                <p className="empty-state-description">
                  The grade entry interface is currently under development. Once your modules are configured, you'll be able to input scores directly from this tab.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              &times;
            </button>
            <GradeModuleForm
              module={activeModule}
              currentTotalPercentage={currentTotalPercentage}
              onSuccess={handleCloseModal}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Grading;