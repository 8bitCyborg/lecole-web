import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LeInput from '@/components/ui/LeInput/LeInput';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';
import './style.css';

interface AcademicSessionFormValues {
  sessionName: string;
  term: string;
  weeks: string;
  startDate: string;
}

const DataDisplay: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
  <div className="data-display-group">
    <div className="data-display-label">{label}</div>
    <div className="data-display-value">{value || '-'}</div>
  </div>
);

const AcademicSessionSchema = Yup.object().shape({
  sessionName: Yup.string().required('Session name is required (e.g. 2024/2025)'),
  term: Yup.string().required('Term is required'),
  weeks: Yup.number().typeError('Must be a number').required('Number of weeks is required').min(1, 'Minimum 1 week'),
  startDate: Yup.string().required('Start date is required'),
});

const AcademicSession: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [academicData, setAcademicData] = useState<AcademicSessionFormValues>({
    sessionName: '2024/2025',
    term: 'First Term',
    weeks: '14',
    startDate: '2024-09-02',
  });

  const formik = useFormik<AcademicSessionFormValues>({
    initialValues: academicData,
    validationSchema: AcademicSessionSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setAcademicData(values);
      setIsEditing(false);
      console.log('Form values saved locally:', values);
    },
  });

  const termOptions = [
    { value: 'First Term', label: 'First Term' },
    { value: 'Second Term', label: 'Second Term' },
    { value: 'Third Term', label: 'Third Term' },
  ];

  return (
    <div className="academic-session-container">
      <div className="academic-session-header">
        <div className="header-title-group">
          <h2 className="academic-session-title">
            {isEditing ? 'Configure Academic Framework' : 'Current Academic Session'}
          </h2>
          <p className="academic-session-subtitle">
            {isEditing
              ? 'Update current active session, term settings, and academic timeline.'
              : 'View the active session and term configuration for your institution.'}
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            className="le-button le-button-primary edit-toggle-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Session
          </button>
        )}
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="form-section-label">Session & Term Details</div>
        <div className="form-grid-2-col">
          {isEditing ? (
            <LeInput
              id="sessionName"
              label="Academic Session Name"
              {...formik.getFieldProps('sessionName')}
              error={formik.errors.sessionName}
              touched={formik.touched.sessionName}
              placeholder="e.g. 2024/2025"
            />
          ) : (
            <DataDisplay label="Academic Session" value={academicData.sessionName} />
          )}

          {isEditing ? (
            <LeDropdown
              id="term"
              label="Current Term"
              options={termOptions}
              {...formik.getFieldProps('term')}
              error={formik.errors.term}
              touched={formik.touched.term}
              placeholder="Select term..."
            />
          ) : (
            <DataDisplay label="Current Term" value={academicData.term} />
          )}
        </div>

        <div className="form-grid-2-col">
          {isEditing ? (
            <LeInput
              id="weeks"
              label="Number of Weeks"
              type="number"
              {...formik.getFieldProps('weeks')}
              error={formik.errors.weeks}
              touched={formik.touched.weeks}
              placeholder="e.g. 14"
            />
          ) : (
            <DataDisplay label="Number of Weeks" value={academicData.weeks} />
          )}

          {isEditing ? (
            <LeInput
              id="startDate"
              label="Term Start Date"
              type="date"
              {...formik.getFieldProps('startDate')}
              error={formik.errors.startDate}
              touched={formik.touched.startDate}
            />
          ) : (
            <DataDisplay
              label="Term Start Date"
              value={new Date(academicData.startDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            />
          )}
        </div>

        {isEditing && (
          <div className="form-actions-right">
            <button
              type="button"
              className="le-button le-button-secondary"
              style={{ marginRight: '1rem', background: '#f1f5f9', color: '#475569', boxShadow: 'none' }}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="le-button le-button-primary"
              disabled={!formik.isValid}
            >
              Save Configuration
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AcademicSession;