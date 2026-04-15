import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LeInput from '@/components/ui/LeInput/LeInput';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';
import LeDatePicker from '@/components/ui/LeDatePicker/LeDatePicker';
import TermStatus from './TermStatus';
import {
  useFindMySchoolQuery,
  useGetAcademicSessionByIdQuery,
  useCreateAcademicSessionMutation,
} from '@/services/leApi/schoolApi';
import './style.css';

interface AcademicSessionFormValues {
  sessionName: string;
  term: string;
  weeks: string;
  startDate: string;
  endDate: string;
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
  endDate: Yup.string().required('End date is required'),
});

const AcademicSession: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: school, isLoading: isSchoolLoading } = useFindMySchoolQuery();
  const { data: currentSession, isLoading: isSessionLoading } = useGetAcademicSessionByIdQuery(
    school?.currentSessionId || '',
    { skip: !school?.currentSessionId }
  );

  const [createAcademicSession, { isLoading: isCreating }] = useCreateAcademicSessionMutation();

  const currentTerm = currentSession?.terms?.find(t => t.id === school?.currentTermId) || currentSession?.terms?.[0];

  const formik = useFormik<AcademicSessionFormValues>({
    initialValues: {
      sessionName: currentSession?.identifier || '',
      term: currentTerm?.identifier || '',
      weeks: currentTerm?.numberOfWeeks?.toString() || '',
      startDate: currentTerm?.startDate ? new Date(currentTerm.startDate).toISOString().split('T')[0] : '',
      endDate: currentTerm?.endDate ? new Date(currentTerm.endDate).toISOString().split('T')[0] : '',
    },
    validationSchema: AcademicSessionSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await createAcademicSession({
          identifier: values.sessionName,
          term: {
            identifier: values.term,
            numberOfWeeks: parseInt(values.weeks),
            startDate: values.startDate,
            endDate: values.endDate,
          }
        }).unwrap();
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save academic session:', error);
      }
    },
  });

  // Calculate End Date whenever Start Date or Number of Weeks changes
  useEffect(() => {
    if (formik.values.startDate && formik.values.weeks && isEditing) {
      const start = new Date(formik.values.startDate);
      const weeks = parseInt(formik.values.weeks);
      if (!isNaN(start.getTime()) && !isNaN(weeks)) {
        const end = new Date(start);
        end.setDate(start.getDate() + (weeks * 7));
        const formattedEnd = end.toISOString().split('T')[0];
        // Only update if it's different to avoid infinite loops, though setFieldValue handles this
        if (formattedEnd !== formik.values.endDate) {
          formik.setFieldValue('endDate', formattedEnd);
        }
      }
    }
  }, [formik.values.startDate, formik.values.weeks, isEditing]);

  const termOptions = [
    { value: 'First Term', label: 'First Term' },
    { value: 'Second Term', label: 'Second Term' },
    { value: 'Third Term', label: 'Third Term' },
  ];

  if (isSchoolLoading || (school?.currentSessionId && isSessionLoading)) {
    return <div className="academic-session-container">Loading academic data...</div>;
  }

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
            {currentSession ? 'Edit Session' : 'Set Up Session'}
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
            <DataDisplay label="Academic Session" value={currentSession?.identifier || 'Not Configured'} />
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
            <DataDisplay label="Current Term" value={currentTerm?.identifier || 'Not Configured'} />
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
            <DataDisplay label="Number of Weeks" value={currentTerm?.numberOfWeeks} />
          )}

          {isEditing ? (
            <LeDatePicker
              id="startDate"
              label="Term Start Date"
              {...formik.getFieldProps('startDate')}
              error={formik.errors.startDate}
              touched={formik.touched.startDate}
            />
          ) : (

            <DataDisplay
              label="Term Start Date"
              value={currentTerm?.startDate ? new Date(currentTerm.startDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            />
          )}
        </div>

        <div className="form-grid-2-col">
          {isEditing ? (
            <LeDatePicker
              id="endDate"
              label="Estimated End Date"
              {...formik.getFieldProps('endDate')}
              error={formik.errors.endDate}
              touched={formik.touched.endDate}
            />
          ) : (

            <DataDisplay
              label="Estimated End Date"
              value={currentTerm?.endDate ? new Date(currentTerm.endDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            />
          )}

          {!isEditing && school && (
            <TermStatus school={school} term={currentTerm} />
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
              disabled={!formik.isValid || isCreating}
            >
              {isCreating ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </form>

    </div>
  );
};

export default AcademicSession;