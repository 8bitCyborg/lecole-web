import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useCreateArmMutation } from '../../../services/leApi/classApi';
import type { RootState } from '../../../store';
import LeInput from '../../../components/ui/LeInput/LeInput';
import './AddArmForm.css';

interface AddArmFormProps {
  classId: string;
  onSuccess?: (values: { name: string; capacity?: number }) => void;
  onCancel?: () => void;
}

const ArmSchema = Yup.object().shape({
  name: Yup.string().required('Arm name is required').min(1, 'Name is too short'),
  capacity: Yup.number().positive('Capacity must be positive').optional(),
});

const AddArmForm: React.FC<AddArmFormProps> = ({ classId, onSuccess, onCancel }) => {
  const school = useSelector((state: RootState) => state.school.school);
  const [createArm, { isLoading }] = useCreateArmMutation();

  const handleAddArm = async (values: { name: string; capacity?: number }) => {
    if (!school?.id || !classId) {
      console.error('Missing schoolId or classId');
      return;
    }

    try {
      await createArm({
        name: values.name,
        capacity: values.capacity,
        classId: classId,
        schoolId: school.id,
      }).unwrap();

      onSuccess?.(values);
    } catch (err: any) {
      console.error('Failed to create arm:', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      capacity: undefined as number | undefined,
    },
    validationSchema: ArmSchema,
    onSubmit: handleAddArm,
  });

  return (
    <div className="add-arm-form-container">
      <div className="form-header">
        <h2 className="form-title">Create Class Arm</h2>
        <p className="form-subtitle">Define a new arm or section for this class level.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-arm-form">
        <div className="form-row">
          <LeInput
            id="name"
            label="Arm Name"
            {...formik.getFieldProps('name')}
            error={formik.errors.name as string}
            touched={formik.touched.name}
            placeholder="e.g. A, Blue, Gold"
            autoFocus
          />

          <LeInput
            id="capacity"
            label="Maximum Capacity (Optional)"
            type="number"
            {...formik.getFieldProps('capacity')}
            error={formik.errors.capacity as string}
            touched={formik.touched.capacity}
            placeholder="e.g. 40"
          />
        </div>

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
            {isLoading ? 'Creating...' : 'Create Arm'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArmForm;
