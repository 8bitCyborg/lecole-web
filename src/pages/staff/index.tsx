import React, { useState } from 'react';
import { Users, GraduationCap, Briefcase } from 'lucide-react';
import AddStaffForm from './components/AddStaffForm';
import Sheet from '@/components/ui/Sheet';
import StaffListing from './components/StaffListing';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import './Staff.css';

const StaffPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  return (
    <div className="staff-page-container">
      <div className="staff-header-banner">
        <div className="staff-header-content">
          <h1 className="staff-title">Institutional Staff</h1>
          <p className="staff-subtitle">
            Manage your school's dedicated faculty and administrative personnel.
            Keep records up-to-date, manage teaching roles, and oversee institutional staffing.
          </p>
        </div>
        <button
          className="le-button le-button-primary add-staff-btn-header"
          onClick={() => setShowAddModal(true)}
        >
          Add New Staff
        </button>
      </div>

      <div className="staff-listing-section">
        <div className="staff-tabs-card">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="staff-tabs-list">
              <TabsTrigger value="all" className="staff-tabs-trigger">
                <Users size={18} className="mr-2" />
                All Staff
              </TabsTrigger>
              <TabsTrigger value="teaching" className="staff-tabs-trigger">
                <GraduationCap size={18} className="mr-2" />
                Teaching Staff
              </TabsTrigger>
              <TabsTrigger value="non-teaching" className="staff-tabs-trigger">
                <Briefcase size={18} className="mr-2" />
                Non-Teaching
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="staff-tabs-content">
              <StaffListing filter="all" onAddClick={() => setShowAddModal(true)} />
            </TabsContent>

            <TabsContent value="teaching" className="staff-tabs-content">
              <StaffListing filter="teaching" />
            </TabsContent>

            <TabsContent value="non-teaching" className="staff-tabs-content">
              <StaffListing filter="non-teaching" />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Sheet
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        isSubmitting={isSubmitting}
        style={{ width: '50vw' }}
      >
        <AddStaffForm
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddModal(false)}
          onLoadingChange={setIsSubmitting}
        />
      </Sheet>
    </div>
  );
};

export default StaffPage;