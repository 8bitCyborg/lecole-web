import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUpdateSchoolMutation } from '../../../../services/leApi/schoolApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import LeInput from '../../../../components/ui/LeInput/LeInput';
import LeDropdown from '../../../../components/ui/LeDropdown/LeDropdown';
import '../SchoolForm.css';
import type { School } from '../../../../store/slices/schoolSlice';

interface StepTwoProps {
  onSuccess: () => void;
  schoolData: School;
}

const StepTwoSchema = Yup.object().shape({
  type: Yup.string().required('School type is required'),
  curriculum: Yup.string().required('Curriculum is required'),
  gradingSystem: Yup.string().required('Grading system is required'),
  currentTerm: Yup.string().required('Current term is required'),
  currentSession: Yup.string().required('Current session is required'),
  ownershipType: Yup.string().required('Ownership type is required'),
  proprietor: Yup.string().optional(),
  website: Yup.string().url('Must be a valid URL').optional(),
  logo: Yup.string().optional(),
  motto: Yup.string().optional(),
  dateOfInception: Yup.string().optional(),
});

const StepTwo: React.FC<StepTwoProps> = ({ onSuccess, schoolData }) => {
  const [updateSchool, { isLoading, error }] = useUpdateSchoolMutation();
  const reduxSchool = useSelector((state: RootState) => state.school.school);


  const updateSchoolData = async (values: Record<string, string>) => {
    try {
      const payload: Record<string, string> = {};

      Object.entries(values).forEach(([key, value]) => {
        if (value !== '') {
          payload[key] = value;
        }
      });

      if (values.date_of_inception) {
        payload.date_of_inception = new Date(values.date_of_inception).toISOString();
      }

      await updateSchool({
        id: reduxSchool?.id || schoolData.id,
        ...payload
      }).unwrap();

      onSuccess();
    } catch (err) {
      console.error('Failed to update school details:', err);
    }
  }

  const formik = useFormik({
    initialValues: {
      type: schoolData.type || '',
      curriculum: schoolData.curriculum || '',
      gradingSystem: schoolData.gradingSystem || '',
      currentTerm: schoolData.currentTerm || '',
      currentSession: schoolData.currentSession || '',
      ownershipType: schoolData.ownershipType || '',
      proprietor: schoolData.proprietor || '',
      website: schoolData.website || '',
      logo: schoolData.logo || '',
      motto: schoolData.motto || '',
      dateOfInception: schoolData.dateOfInception ? new Date(schoolData.dateOfInception).toISOString().split('T')[0] : '',
    },
    validationSchema: StepTwoSchema,
    onSubmit: async (values) => {
      await updateSchoolData(values);
    },
  });

  return (
    <div className="school-form-container">
      <div className="school-form-card form-card-wide">
        <div className="school-form-header">
          <h2 className="school-form-title">Additional Information</h2>
          <p className="school-form-subtitle">
            Provide extra details about your institution
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="school-form">
          <div className="form-row-3">
            <LeDropdown
              id="type"
              label="School Type"
              options={[
                { value: 'nursery', label: 'Nursery' },
                { value: 'primary', label: 'Primary' },
                { value: 'secondary', label: 'Secondary' },
                { value: 'K12', label: 'K12' },
              ]}
              {...formik.getFieldProps('type')}
              error={formik.errors.type as string}
              touched={formik.touched.type}
            />

            <LeDropdown
              id="curriculum"
              label="Curriculum"
              options={[
                { value: 'nigerian', label: 'Nigerian' },
                { value: 'british', label: 'British' },
                { value: 'montessori', label: 'Montessori' },
                { value: 'other', label: 'Other' },
              ]}
              {...formik.getFieldProps('curriculum')}
              error={formik.errors.curriculum as string}
              touched={formik.touched.curriculum}
            />

            <LeDropdown
              id="grading_system"
              label="Grading System"
              options={[
                { value: 'waec', label: 'WAEC' },
                { value: 'percentage', label: 'Percentage' },
                { value: 'gpa', label: 'GPA' },
                { value: 'other', label: 'Other' },
              ]}
              {...formik.getFieldProps('gradingSystem')}
              error={formik.errors.gradingSystem as string}
              touched={formik.touched.gradingSystem}
            />
          </div>

          <div className="form-row-3">
            <LeDropdown
              id="current_term"
              label="Current Term"
              options={[
                { value: 'first_term', label: 'First Term' },
                { value: 'second_term', label: 'Second Term' },
                { value: 'third_term', label: 'Third Term' },
              ]}
              {...formik.getFieldProps('currentTerm')}
              error={formik.errors.currentTerm as string}
              touched={formik.touched.currentTerm}
            />

            <LeInput
              id="current_session"
              label="Current Session"
              {...formik.getFieldProps('currentSession')}
              error={formik.errors.currentSession as string}
              touched={formik.touched.currentSession}
              placeholder="e.g. 2025/2026"
            />

            <LeDropdown
              id="ownership_type"
              label="Ownership Type"
              options={[
                { value: 'private', label: 'Private' },
                { value: 'mission', label: 'Mission' },
                { value: 'public', label: 'Public' },
              ]}
              {...formik.getFieldProps('ownershipType')}
              error={formik.errors.ownershipType as string}
              touched={formik.touched.ownershipType}
            />
          </div>

          <div className="form-row-3">
            <LeInput
              id="proprietor"
              label="Proprietor / Owner"
              {...formik.getFieldProps('proprietor')}
              error={formik.errors.proprietor as string}
              touched={formik.touched.proprietor}
              placeholder=""
            />

            <LeInput
              id="website"
              label="Website"
              {...formik.getFieldProps('website')}
              error={formik.errors.website as string}
              touched={formik.touched.website}
              placeholder="https://example.com"
            />

            <LeInput
              id="date_of_inception"
              label="Date of Inception"
              type="date"
              {...formik.getFieldProps('dateOfInception')}
              error={formik.errors.dateOfInception as string}
              touched={formik.touched.dateOfInception}
            />
          </div>

          <div className="form-row">
            <LeInput
              id="motto"
              label="School Motto"
              {...formik.getFieldProps('motto')}
              error={formik.errors.motto as string}
              touched={formik.touched.motto}
              placeholder="e.g. Excellence in Education"
            />

            <LeInput
              id="logo"
              label="Logo URL"
              {...formik.getFieldProps('logo')}
              error={formik.errors.logo as string}
              touched={formik.touched.logo}
              placeholder="https://..."
            />
          </div>

          {error && <div className="form-error">An error occurred while saving. Please try again.</div>}

          <div className="form-actions between">
            <button
              type="button"
              className="le-button btn-continue-later"
              onClick={() => onSuccess()}
              disabled={isLoading}
            >
              Continue later
            </button>
            <button
              type="submit"
              className="le-button le-button-primary form-btn-small"
              disabled={isLoading || !formik.isValid}
            >
              {isLoading ? 'Saving...' : 'Finish setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepTwo;
