import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LeInput from '../../../components/ui/LeInput/LeInput';
import LeDropdown from '../../../components/ui/LeDropdown/LeDropdown';
import LeFormError from '../../../components/ui/LeFormError/LeFormError';
import { useCreateStaffMutation } from '../../../services/leApi/staffApi';
import './AddStaffForm.css';

interface AddStaffFormProps {
  onSuccess?: (values: any) => void;
  onCancel?: () => void;
}

const TITLE_OPTIONS = [
  { value: 'MR', label: 'Mr.' },
  { value: 'MRS', label: 'Mrs.' },
  { value: 'MS', label: 'Ms.' },
  { value: 'DR', label: 'Dr.' },
  { value: 'PASTOR', label: 'Pastor' },
  { value: 'REVEREND', label: 'Rev.' },
  { value: 'OTHER', label: 'Other' },
];

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

const STAFF_TYPE_OPTIONS = [
  { value: 'true', label: 'Teaching Staff' },
  { value: 'false', label: 'Non-Teaching Staff' },
];

const StaffSchema = Yup.object().shape({
  title: Yup.string().oneOf(['MR', 'MRS', 'MS', 'DR', 'PASTOR', 'REVEREND', 'OTHER'], 'Invalid title'),
  gender: Yup.string().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Invalid gender').required('Gender is required'),
  firstName: Yup.string().required('First name is required').min(2, 'Name is too short'),
  lastName: Yup.string().required('Last name is required').min(2, 'Name is too short'),
  email: Yup.string().email('Invalid email address'),
  phone: Yup.string().required('Phone number is required').matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Invalid phone number'),
  staffId: Yup.string().min(3, 'Staff ID is too short'),
  designation: Yup.string().required('Designation is required'),
  isTeachingStaff: Yup.boolean().required("Staff category is required"),
  bio: Yup.string().max(500, 'Bio should be less than 500 characters'),
  password: Yup.string().min(8, 'Password must be at least 8 characters'),
});


const AddStaffForm: React.FC<AddStaffFormProps> = ({ onSuccess, onCancel }) => {
  const [createStaff, { isLoading }] = useCreateStaffMutation();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleAddStaff = async (values: any) => {
    try {
      await createStaff(values).unwrap();
      onSuccess?.(values);
    } catch (err: any) {
      console.error('Failed to create staff member:', err);
      const msg = err?.data?.message || err?.message || 'An unexpected error occurred.';
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      gender: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      staffId: '',
      designation: '',
      isTeachingStaff: true,
      bio: '',
      password: 'Lecole@123',
    },
    validationSchema: StaffSchema,
    onSubmit: handleAddStaff,
  });

  React.useEffect(() => {
    if (errorMessage) setErrorMessage(null);
  }, [formik.values]);

  return (
    <div className="add-staff-form-container">
      <div className="form-header">
        <h2 className="form-title">Add New Staff Member</h2>
        <p className="form-subtitle">Enlist a new member to your school's faculty.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-staff-form">
        <div className="form-row">
          <LeInput
            id="firstName"
            label="First Name"
            {...formik.getFieldProps('firstName')}
            error={formik.errors.firstName as string}
            touched={formik.touched.firstName}
            placeholder="John"
          />
          <LeInput
            id="lastName"
            label="Last Name"
            {...formik.getFieldProps('lastName')}
            error={formik.errors.lastName as string}
            touched={formik.touched.lastName}
            placeholder="Doe"
          />
        </div>

        <div className="form-row">
          <LeDropdown
            id="title"
            label="Title"
            options={TITLE_OPTIONS}
            {...formik.getFieldProps('title')}
            error={formik.errors.title as string}
            touched={formik.touched.title}
          />
          <LeDropdown
            id="gender"
            label="Gender"
            options={GENDER_OPTIONS}
            {...formik.getFieldProps('gender')}
            error={formik.errors.gender as string}
            touched={formik.touched.gender}
          />
        </div>


        <div className='form-row'>
          <LeInput
            id="email"
            label="Email Address"
            type="email"
            {...formik.getFieldProps('email')}
            error={formik.errors.email as string}
            touched={formik.touched.email}
            placeholder="john.doe@lecole.app"
          />

          <LeInput
            id="phone"
            label="Phone Number"
            {...formik.getFieldProps('phone')}
            error={formik.errors.phone as string}
            touched={formik.touched.phone}
            placeholder="+234 800 000 0000"
          />
        </div>

        <div className="form-row">
          <LeDropdown
            id="isTeachingStaff"
            label="Staff Category"
            options={STAFF_TYPE_OPTIONS}
            value={formik.values.isTeachingStaff.toString()}
            onChange={(e) => formik.setFieldValue('isTeachingStaff', e.target.value === 'true')}
            error={formik.errors.isTeachingStaff as string}
            touched={formik.touched.isTeachingStaff}
          />

          <LeInput
            id="designation"
            label="Designation"
            {...formik.getFieldProps('designation')}
            error={formik.errors.designation as string}
            touched={formik.touched.designation}
            placeholder="Eg. Bursar, Teacher, HOD"
          />
        </div>

        <div className="form-row" style={{ alignItems: 'center' }}>

          <LeInput
            id="staffId"
            label="Staff ID"
            {...formik.getFieldProps('staffId')}
            error={formik.errors.staffId as string}
            touched={formik.touched.staffId}
            placeholder="STF-001"
          />

          <LeInput
            id="bio"
            label="Bio (Short Profile)"
            {...formik.getFieldProps('bio')}
            error={formik.errors.bio as string}
            touched={formik.touched.bio}
            placeholder="A brief description of the staff member's expertise..."
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
            disabled={!formik.isValid || formik.isSubmitting || isLoading}
          >
            {formik.isSubmitting ? 'Adding...' : 'Add Staff Member'}
          </button>
        </div>
        <LeFormError message={errorMessage || ''} onClose={() => setErrorMessage(null)} />
      </form>
    </div>
  );
};

export default AddStaffForm;
