import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { RootState } from '../../../../store';
import { useCreateSchoolMutation, useUpdateSchoolMutation } from '../../../../services/leApi/schoolApi';
import LeInput from '../../../../components/ui/LeInput';
import '../SchoolForm.css';
import type { School } from '../../../../store/slices/schoolSlice';

interface StepOneProps {
  onSuccess: (school: School) => void;
  initialData?: School | null;
  isEditMode?: boolean;
}

const SchoolSchema = Yup.object().shape({
  name: Yup.string().required('School Name is required'),
  email: Yup.string().email('Invalid email address').required('School Email is required'),
  phone: Yup.string().required('Phone Number is required'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  lga: Yup.string().optional(),
});

const StepOne: React.FC<StepOneProps> = ({ onSuccess, initialData, isEditMode = false }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [createSchool, { isLoading: isCreating, error: createError }] = useCreateSchoolMutation();
  const [updateSchool, { isLoading: isUpdating, error: updateError }] = useUpdateSchoolMutation();

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
      state: '',
      lga: '',
      phone: '',
      email: '',
    },
    validationSchema: SchoolSchema,
    onSubmit: async (values) => {
      try {
        let savedSchool: School;

        if (isEditMode && initialData) {
          savedSchool = await updateSchool({
            id: initialData.id,
            ...values,
            lga: values.lga || undefined,
          }).unwrap();
        } else {
          if (!user?.id) return;
          savedSchool = await createSchool({
            user_id: user.id,
            ...values,
            lga: values.lga || undefined,
          }).unwrap();
        }

        onSuccess(savedSchool);
      } catch (err) {
        console.error('Failed to save school:', err);
      }
    },
  });

  useEffect(() => {
    if (initialData && isEditMode) {
      formik.setValues({
        name: initialData.name || '',
        address: initialData.address || '',
        state: initialData.state || '',
        lga: initialData.lga || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isEditMode]);

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  return (
    <div className="school-form-container">
      <div className="school-form-card">
        <div className="school-form-header">
          <h2 className="school-form-title">{isEditMode ? 'Edit School Details' : 'Create Your School'}</h2>
          <p className="school-form-subtitle">
            {isEditMode ? 'Update the required information for your institution' : 'Enter the details of your institution to get started'}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="school-form">
          <LeInput
            id="name"
            label="School Name"
            {...formik.getFieldProps('name')}
            error={formik.errors.name as string}
            touched={formik.touched.name}
            placeholder="e.g. Lecole High School"
          />

          <LeInput
            id="email"
            label="School Email"
            type="email"
            {...formik.getFieldProps('email')}
            error={formik.errors.email as string}
            touched={formik.touched.email}
            placeholder="contact@school.edu"
          />

          <div className="form-row">
            <LeInput
              id="phone"
              label="School Phone Number"
              {...formik.getFieldProps('phone')}
              error={formik.errors.phone as string}
              touched={formik.touched.phone}
              placeholder="e.g. 08012345678"
            />

            <LeInput
              id="address"
              label="Address"
              {...formik.getFieldProps('address')}
              error={formik.errors.address as string}
              touched={formik.touched.address}
              placeholder="Full physical address"
            />
          </div>

          <div className="form-row">
            <LeInput
              id="state"
              label="State"
              {...formik.getFieldProps('state')}
              error={formik.errors.state as string}
              touched={formik.touched.state}
              placeholder="e.g. Lagos"
            />
            <LeInput
              id="lga"
              label="LGA (Optional)"
              {...formik.getFieldProps('lga')}
              error={formik.errors.lga as string}
              touched={formik.touched.lga}
              placeholder="e.g. Ikeja"
            />
          </div>

          {error && <div className="form-error">An error occurred while saving. Please try again.</div>}

          <div className="form-actions right">
            <button
              type="submit"
              className="le-button le-button-primary form-btn-small"
              disabled={isLoading || !formik.isValid}
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepOne;
