import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LeInput from '../../../components/ui/LeInput/LeInput';
import { useCreateTeacherMutation } from '../../../services/leApi/teacherApi';
import './AddTeacherForm.css';

interface AddTeacherFormProps {
  onSuccess?: (values: any) => void;
  onCancel?: () => void;
}

const TeacherSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required').min(2, 'Name is too short'),
  last_name: Yup.string().required('Last name is required').min(2, 'Name is too short'),
  email: Yup.string().email('Invalid email address'),
  phone: Yup.string().required('Phone number is required').matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Invalid phone number'),
  staffId: Yup.string().min(3, 'Staff ID is too short'),
  bio: Yup.string().max(500, 'Bio should be less than 500 characters'),
  password: Yup.string().min(8, 'Password must be at least 8 characters'),
});


const AddTeacherForm: React.FC<AddTeacherFormProps> = ({ onSuccess, onCancel }) => {
  const [createTeacher, { isLoading }] = useCreateTeacherMutation();

  const handleAddTeacher = async (values: any) => {
    try {
      await createTeacher(values).unwrap();
      onSuccess?.(values);
    } catch (err: any) {
      console.error('Failed to create teacher:', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      staffId: '',
      bio: '',
      password: '',
    },
    validationSchema: TeacherSchema,
    onSubmit: handleAddTeacher,
  });

  return (
    <div className="add-teacher-form-container">
      <div className="form-header">
        <h2 className="form-title">Add New Teacher</h2>
        <p className="form-subtitle">Enlist a new member to your school's faculty.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-teacher-form">
        <div className="form-row">
          <LeInput
            id="first_name"
            label="First Name"
            {...formik.getFieldProps('first_name')}
            error={formik.errors.first_name as string}
            touched={formik.touched.first_name}
            placeholder="John"
            autoFocus
          />
          <LeInput
            id="last_name"
            label="Last Name"
            {...formik.getFieldProps('last_name')}
            error={formik.errors.last_name as string}
            touched={formik.touched.last_name}
            placeholder="Doe"
          />
        </div>

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

        <div className="form-row">
          <LeInput
            id="staffId"
            label="Staff ID"
            {...formik.getFieldProps('staffId')}
            error={formik.errors.staffId as string}
            touched={formik.touched.staffId}
            placeholder="TCH-001"
          />
          <LeInput
            id="password"
            label="Default Password"
            type="password"
            {...formik.getFieldProps('password')}
            error={formik.errors.password as string}
            touched={formik.touched.password}
            placeholder="Lecole@123"
          />
        </div>

        <LeInput
          id="bio"
          label="Bio (Short Profile)"
          {...formik.getFieldProps('bio')}
          error={formik.errors.bio as string}
          touched={formik.touched.bio}
          placeholder="A brief description of the teacher's expertise..."
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
            disabled={!formik.isValid || formik.isSubmitting || isLoading}
          >
            {formik.isSubmitting ? 'Adding...' : 'Add Teacher'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeacherForm;
