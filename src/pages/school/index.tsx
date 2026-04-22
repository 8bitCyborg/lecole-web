import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Settings,
  School2,
} from 'lucide-react';
import './SchoolOverview.css';
import '../academics/Academics.css';
import SchoolForm from "./components/SchoolDetailsForm";
import AcademicSession from './components/AcademicSession';

const School = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="school-page-container">
      <div className="school-header-banner">
        <div className="school-header-content">
          <h1 className="school-title">School Management</h1>
          <p className="school-subtitle">
            Overview and manage your institution's profile, academic framework, and administrative settings. Ensure your school's details are up-to-date.
          </p>
        </div>
      </div>

      <div className="grading-tabs-card">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grading-tabs-list">
            <TabsTrigger value="profile" className="grading-tabs-trigger">
              <School2 size={18} />
              Profile
            </TabsTrigger>
            <TabsTrigger value="academic-session" className="grading-tabs-trigger">
              <Settings size={18} />
              Academic Session
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="grading-tabs-content">
            <SchoolForm
              isEditMode={isEditing}
              onEdit={() => setIsEditing(true)}
              onSuccess={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </TabsContent>
          <TabsContent value="academic-session" className="grading-tabs-content">
            <AcademicSession />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default School;