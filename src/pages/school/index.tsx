import { useState } from 'react';
import { useFindMySchoolQuery } from "../../services/leApi/schoolApi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Settings } from 'lucide-react';
import './SchoolOverview.css';
import '../academics/Academics.css';
import SchoolForm from "./components/SchoolDetailsForm";

const School = () => {
  const { data: school, isLoading, refetch } = useFindMySchoolQuery();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <div className="school-loading">Loading school info...</div>;
  }



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
        <Tabs defaultValue="management" className="w-full">
          <TabsList className="grading-tabs-list">
            <TabsTrigger value="management" className="grading-tabs-trigger">
              <Settings size={18} />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="grading-tabs-content">
            <SchoolForm
              initialData={school}
              isEditMode={isEditing}
              onEdit={() => setIsEditing(true)}
              onSuccess={() => { setIsEditing(false); refetch(); }}
              onCancel={() => setIsEditing(false)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default School;