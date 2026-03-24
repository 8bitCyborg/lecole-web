import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useCreateClassMutation } from '../../../services/leApi/classApi';
import type { RootState } from '../../../store';
import LeInput from '../../../components/ui/LeInput/LeInput';
import './AddClassForm.css';

interface AddClassFormProps {
  onSuccess?: (values: { name: string }) => void;
  onCancel?: () => void;
}

const ClassSchema = Yup.object().shape({
  name: Yup.string().required('Class name is required').min(2, 'Class name is too short'),
});

const AddClassForm: React.FC<AddClassFormProps> = ({ onSuccess, onCancel }) => {
  const school = useSelector((state: RootState) => state.school.school);
  const [createClass, { isLoading }] = useCreateClassMutation();

  const handleAddClass = async (values: { name: string }) => {
    if (!school?.id) {
      console.error('No school ID found');
      return;
    }

    try {
      await createClass({
        name: values.name,
        schoolId: school.id,
      }).unwrap();

      onSuccess?.(values);
    } catch (err: any) {
      console.error('Failed to create class:', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: ClassSchema,
    onSubmit: handleAddClass,
  });

  return (
    <div className="add-class-form-container">
      <div className="form-header">
        <h2 className="form-title">Create New Class</h2>
        <p className="form-subtitle">Add a new class to your school's academic structure.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-class-form">
        <LeInput
          id="name"
          label="Class Name"
          {...formik.getFieldProps('name')}
          error={formik.errors.name as string}
          touched={formik.touched.name}
          placeholder="e.g. Primary 1, Grade 10, JSS 1"
          autoFocus
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
            {isLoading ? 'Creating...' : 'Create Class'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClassForm;
