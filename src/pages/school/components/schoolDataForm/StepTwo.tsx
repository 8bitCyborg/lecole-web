import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUpdateSchoolMutation } from '../../../../services/leApi/schoolApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import LeInput from '../../../../components/ui/LeInput';
import '../SchoolForm.css';
import type { School } from '../../../../store/slices/schoolSlice';

interface StepTwoProps {
  onSuccess: () => void;
  schoolData: School;
}

const StepTwoSchema = Yup.object().shape({
  type: Yup.string().required('School type is required'),
  curriculum: Yup.string().required('Curriculum is required'),
  grading_system: Yup.string().required('Grading system is required'),
  current_term: Yup.string().required('Current term is required'),
  current_session: Yup.string().required('Current session is required'),
  ownership_type: Yup.string().required('Ownership type is required'),
  proprietor: Yup.string().optional(),
  website: Yup.string().url('Must be a valid URL').optional(),
  logo: Yup.string().optional(),
  motto: Yup.string().optional(),
  date_of_inception: Yup.string().optional(),
});

const StepTwo: React.FC<StepTwoProps> = ({ onSuccess, schoolData }) => {
  const [updateSchool, { isLoading, error }] = useUpdateSchoolMutation();
  const reduxSchool = useSelector((state: RootState) => state.school.school);

  const formik = useFormik({
    initialValues: {
      type: schoolData.type || '',
      curriculum: schoolData.curriculum || '',
      grading_system: schoolData.grading_system || '',
      current_term: schoolData.current_term || '',
      current_session: schoolData.current_session || '',
      ownership_type: schoolData.ownership_type || '',
      proprietor: schoolData.proprietor || '',
      website: schoolData.website || '',
      logo: schoolData.logo || '',
      motto: schoolData.motto || '',
      date_of_inception: schoolData.date_of_inception ? new Date(schoolData.date_of_inception).toISOString().split('T')[0] : '',
    },
    validationSchema: StepTwoSchema,
    onSubmit: async (values) => {
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
            <div className="le-select-container">
              <label htmlFor="type" className="le-select-label">School Type</label>
              <select
                id="type"
                className={`le-select ${formik.touched.type && formik.errors.type ? 'le-select-error' : ''}`}
                {...formik.getFieldProps('type')}
              >
                <option value="">Select School Type...</option>
                <option value="nursery">Nursery</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="K12">K12</option>
              </select>
            </div>

            <div className="le-select-container">
              <label htmlFor="curriculum" className="le-select-label">Curriculum</label>
              <select
                id="curriculum"
                className={`le-select ${formik.touched.curriculum && formik.errors.curriculum ? 'le-select-error' : ''}`}
                {...formik.getFieldProps('curriculum')}
              >
                <option value="">Select Curriculum...</option>
                <option value="nigerian">Nigerian</option>
                <option value="british">British</option>
                <option value="montessori">Montessori</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="le-select-container">
              <label htmlFor="grading_system" className="le-select-label">Grading System</label>
              <select
                id="grading_system"
                className={`le-select ${formik.touched.grading_system && formik.errors.grading_system ? 'le-select-error' : ''}`}
                {...formik.getFieldProps('grading_system')}
              >
                <option value="">Select Grading System...</option>
                <option value="waec">WAEC</option>
                <option value="percentage">Percentage</option>
                <option value="gpa">GPA</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row-3">
            <div className="le-select-container">
              <label htmlFor="current_term" className="le-select-label">Current Term</label>
              <select
                id="current_term"
                className={`le-select ${formik.touched.current_term && formik.errors.current_term ? 'le-select-error' : ''}`}
                {...formik.getFieldProps('current_term')}
              >
                <option value="">Select Current Term...</option>
                <option value="first_term">First Term</option>
                <option value="second_term">Second Term</option>
                <option value="third_term">Third Term</option>
              </select>
            </div>

            <LeInput
              id="current_session"
              label="Current Session"
              {...formik.getFieldProps('current_session')}
              error={formik.errors.current_session as string}
              touched={formik.touched.current_session}
              placeholder="e.g. 2025/2026"
            />

            <div className="le-select-container">
              <label htmlFor="ownership_type" className="le-select-label">Ownership Type</label>
              <select
                id="ownership_type"
                className={`le-select ${formik.touched.ownership_type && formik.errors.ownership_type ? 'le-select-error' : ''}`}
                {...formik.getFieldProps('ownership_type')}
              >
                <option value="">Select Ownership Type...</option>
                <option value="private">Private</option>
                <option value="mission">Mission</option>
                <option value="public">Public</option>
              </select>
            </div>
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
              {...formik.getFieldProps('date_of_inception')}
              error={formik.errors.date_of_inception as string}
              touched={formik.touched.date_of_inception}
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
