import React from 'react';
import { Users, GraduationCap, Archive } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ActiveStudents from './activeStudents';
import ArchivedStudents from './archivedStudents';
import GraduatedStudents from './graduatedStudents';
import './StudentListing.css';

interface StudentListingProps {
  onAddClick: () => void;
}

const StudentListing: React.FC<StudentListingProps> = ({ onAddClick }) => {
  return (
    <div className="students-listing-section">
      <div className="student-tabs-card">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="student-tabs-list">
            <TabsTrigger
              value="active"
              className="student-tabs-trigger"
            >
              <Users size={18} className="mr-2" />
              Active Students
            </TabsTrigger>
            <TabsTrigger
              value="graduated"
              className="student-tabs-trigger"
            >
              <GraduationCap size={18} className="mr-2" />
              Graduated (Alumni)
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="student-tabs-trigger"
            >
              <Archive size={18} className="mr-2" />
              Archived (Withdrawn)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="student-tabs-content">
            <ActiveStudents onAddClick={onAddClick} />
          </TabsContent>

          <TabsContent value="graduated" className="student-tabs-content">
            <GraduatedStudents />
          </TabsContent>

          <TabsContent value="archived" className="student-tabs-content">
            <ArchivedStudents />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentListing;
