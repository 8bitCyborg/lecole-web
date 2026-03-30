import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Users, Presentation } from 'lucide-react';
import { useGetSubjectByIdQuery } from '../../services/leApi/subjectApi';
import AssignClasses from './components/AssignClasses/assignClasses';
import AssignTeachers from './components/AssignTeachers/AssignTeachers';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import './Subjects.css';

const SubjectDetails = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { data: subject, isLoading, isError } = useGetSubjectByIdQuery(subjectId!);

  const handleBack = () => {
    navigate('/subjects');
  };

  if (isLoading) {
    return <div className="subjects-page-container loading-state">Loading subject details...</div>;
  }

  if (isError || !subject) {
    return (
      <div className="subjects-page-container">
        <button className="back-navigator-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Subjects
        </button>
        <div className="subjects-empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2 className="empty-state-title">Subject Not Found</h2>
          <p className="empty-state-description">
            The subject you are looking for might have been removed or the URL is incorrect.
          </p>
          <button className="le-button le-button-primary" onClick={handleBack}>
            Back to Overview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subjects-page-container">
      <button className="back-navigator-btn" onClick={handleBack}>
        <ArrowLeft size={18} />
        Back to Subjects
      </button>

      <div className="subjects-header-banner">
        <div className="subjects-header-content">
          <h1 className="subjects-title">
            {subject.name} {subject.code && <span className="arm-header-separator">({subject.code})</span>}
          </h1>
          {/* <div className="classes-meta-info"> */}
          {/* <span className="class-id-badge">ID: {subject.id}</span> */}
          {/* <span className="class-id-badge">Updated: {new Date(subject.updatedAt).toLocaleDateString()}</span> */}
          {/* </div> */}
          <p className="subjects-subtitle">
            Detailed overview of <strong>{subject.name}</strong>. Manage the curriculum, assign teachers,
            and track academic performance for this subject across all classes.
          </p>

          <div className="banner-stats-container">
            <div className="banner-stat-card">
              <span className="banner-stat-label">
                <Presentation size={14} /> Classes
              </span>
              <span className="banner-stat-value">{subject._count.classes}</span>
            </div>

            <div className="banner-stat-card">
              <span className="banner-stat-label">
                <Users size={14} /> Teachers
              </span>
              <span className="banner-stat-value">{subject._count.teachers}</span>
            </div>
          </div>
        </div>
        <div className="banner-actions">
          <button className="le-button le-button-primary">
            <Edit size={16} style={{ marginRight: '8px' }} />
            Edit Subject
          </button>
        </div>
      </div>

      <div className="subjects-listing-section">
        {subject && (
          <Tabs defaultValue="classes" className="w-full">
            <TabsList className="">
              <TabsTrigger
                value="classes"
                className=""
              >
                <Presentation size={18} className="mr-2" />
                Assigned Classes
              </TabsTrigger>
              <TabsTrigger
                value="teachers"
                className=""
              >
                <Users size={18} className="" />
                Assigned Teachers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classes" className="">
              <AssignClasses
                subjectId={subject.id}
                assignedClassIds={subject.classes?.map((c) => c.id) || []}
              />
            </TabsContent>

            <TabsContent value="teachers" className="">
              <AssignTeachers
                subjectId={subject.id}
                assignedTeacherIds={subject.staff?.map((s) => s.id) || []}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default SubjectDetails;
