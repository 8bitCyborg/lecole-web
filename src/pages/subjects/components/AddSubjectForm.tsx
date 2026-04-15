import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateSubjectMutation } from '../../../services/leApi/subjectApi';
import { useFindMySchoolQuery } from '@/services/leApi/schoolApi';
import LeInput from '../../../components/ui/LeInput/LeInput';
import './AddSubjectForm.css';

interface AddSubjectFormProps {
  onSuccess?: (values: { name: string; code?: string }) => void;
  onCancel?: () => void;
}

const SubjectSchema = Yup.object().shape({
  name: Yup.string().required('Subject name is required').min(2, 'Subject name is too short'),
  code: Yup.string().optional(),
});

const AddSubjectForm: React.FC<AddSubjectFormProps> = ({ onSuccess, onCancel }) => {
  const school = useFindMySchoolQuery();
  const schoolData = school?.currentData
  const [createSubject, { isLoading }] = useCreateSubjectMutation();

  const handleAddSubject = async (values: { name: string; code?: string }) => {
    if (!schoolData?.id) {
      console.error('No school ID found');
      return;
    };

    try {
      await createSubject({
        name: values.name,
        code: values.code,
        schoolId: schoolData?.id,
      }).unwrap();

      onSuccess?.(values);
    } catch (err: any) {
      console.error('Failed to create subject:', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
    },
    validationSchema: SubjectSchema,
    onSubmit: handleAddSubject,
  });

  return (
    <div className="add-subject-form-container">
      <div className="form-header">
        <h2 className="form-title">Create New Subject</h2>
        <p className="form-subtitle">Add a new subject to your school's curriculum.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-subject-form">
        <LeInput
          id="name"
          label="Subject Name"
          {...formik.getFieldProps('name')}
          error={formik.errors.name as string}
          touched={formik.touched.name}
          placeholder="e.g. Mathematics, English Language, Physics"
          autoFocus
        />

        <LeInput
          id="code"
          label="Subject Code (Optional)"
          {...formik.getFieldProps('code')}
          error={formik.errors.code as string}
          touched={formik.touched.code}
          placeholder="e.g. MTH 101, ENG"
        />

        <div className="form-actions">
          <button
            type="button"
            className="le-button le-button-outline cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="le-button le-button-primary submit-btn"
            disabled={!formik.isValid || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Subject'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubjectForm;
