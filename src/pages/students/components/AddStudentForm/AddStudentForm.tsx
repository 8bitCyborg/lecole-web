import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import LeInput from '../../../../components/ui/LeInput/LeInput';
import LeDropdown from '../../../../components/ui/LeDropdown/LeDropdown';
import { useCreateStudentMutation } from '../../../../services/leApi/studentApi';
import { useGetClassesQuery, useGetArmsQuery } from '../../../../services/leApi/classApi';
import type { RootState } from '@/store';
import './AddStudentForm.css';

interface AddStudentFormProps {
  onSuccess?: (values: any) => void;
  onCancel?: () => void;
  initialValues?: {
    classId?: string;
    armId?: string;
  };
}

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

const StudentSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required').min(2, 'Name is too short'),
  lastName: Yup.string().required('Last name is required').min(2, 'Name is too short'),
  email: Yup.string().email('Invalid email address'),
  gender: Yup.string().oneOf(['MALE', 'FEMALE'], 'Invalid gender').required('Gender is required'),
  admissionNumber: Yup.string().required('Admission number is required').min(3, 'Admission number is too short'),
  dateOfBirth: Yup.date(),
  guardianPhone: Yup.string().matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Invalid phone number'),
  guardianEmail: Yup.string().email('Invalid email address'),
  classId: Yup.string(),
  armId: Yup.string(),
  password: Yup.string().min(8, 'Password must be at least 8 characters'),
});

const AddStudentForm: React.FC<AddStudentFormProps> = ({ onSuccess, onCancel, initialValues }) => {
  const school = useSelector((state: RootState) => state.school.school);
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const { data: classes = [] } = useGetClassesQuery();

  const [selectedClassId, setSelectedClassId] = useState<string>(initialValues?.classId || '');
  const { data: arms = [] } = useGetArmsQuery(selectedClassId, { skip: !selectedClassId });

  const handleAddStudent = async (values: any) => {
    if (!school?.id) {
      console.error('No school ID found');
      return;
    }

    try {
      await createStudent({
        ...values,
        schoolId: school.id,
      }).unwrap();
      onSuccess?.(values);
    } catch (err: any) {
      console.error('Failed to create student:', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      admissionNumber: '',
      dateOfBirth: '',
      guardianPhone: '',
      guardianEmail: '',
      classId: initialValues?.classId || '',
      armId: initialValues?.armId || '',
      password: 'LecoleStudent@123',
    },
    validationSchema: StudentSchema,
    onSubmit: handleAddStudent,
  });

  // Update selected class for fetching arms
  useEffect(() => {
    setSelectedClassId(formik.values.classId);
    if (formik.values.classId !== selectedClassId) {
      formik.setFieldValue('armId', '');
    }
  }, [formik.values.classId]);

  return (
    <div className="add-student-form-container">
      <div className="form-header">
        <h2 className="form-title">Enroll New Student</h2>
        <p className="form-subtitle">Add a new student to your school's enrollment.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-student-form">
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
            id="gender"
            label="Gender"
            options={GENDER_OPTIONS}
            {...formik.getFieldProps('gender')}
            error={formik.errors.gender as string}
            touched={formik.touched.gender}
          />
          <LeInput
            id="admissionNumber"
            label="Admission Number"
            {...formik.getFieldProps('admissionNumber')}
            error={formik.errors.admissionNumber as string}
            touched={formik.touched.admissionNumber}
            placeholder="ADM-2024-001"
          />
        </div>

        <div className="form-row">
          <LeInput
            id="email"
            label="Student Email"
            type="email"
            {...formik.getFieldProps('email')}
            error={formik.errors.email as string}
            touched={formik.touched.email}
            placeholder="john.doe@student.lecole.app"
          />
          <LeInput
            id="dateOfBirth"
            label="Date of Birth"
            type="date"
            {...formik.getFieldProps('dateOfBirth')}
            error={formik.errors.dateOfBirth as string}
            touched={formik.touched.dateOfBirth}
          />
        </div>

        <div className="form-row">
          <LeDropdown
            id="classId"
            label="Class"
            options={classes.map((c: any) => ({ value: c.id, label: c.name }))}
            {...formik.getFieldProps('classId')}
            error={formik.errors.classId as string}
            touched={formik.touched.classId}
            disabled={!!initialValues?.classId}
          />
          <LeDropdown
            id="armId"
            label="Class Arm"
            options={arms.map((a: any) => ({ value: a.id, label: a.name }))}
            {...formik.getFieldProps('armId')}
            error={formik.errors.armId as string}
            touched={formik.touched.armId}
            disabled={!formik.values.classId || !!initialValues?.armId}
          />
        </div>

        <div className="form-section-divider">
          <span>Guardian Information</span>
        </div>

        <div className="form-row">
          <LeInput
            id="guardianPhone"
            label="Guardian Phone Number"
            {...formik.getFieldProps('guardianPhone')}
            error={formik.errors.guardianPhone as string}
            touched={formik.touched.guardianPhone}
            placeholder="+234 800 000 0000"
          />
          <LeInput
            id="guardianEmail"
            label="Guardian Email"
            type="email"
            {...formik.getFieldProps('guardianEmail')}
            error={formik.errors.guardianEmail as string}
            touched={formik.touched.guardianEmail}
            placeholder="guardian@example.com"
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
            {formik.isSubmitting ? 'Enrolling...' : 'Enroll Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;
