import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../../services/leApi/authApi';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';
import LeInput from '../ui/LeInput';

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (values: SignUpFormValues) => {
    try {
      const result: any = await signup({
        email: values.email,
        password: values.password,
        phone: values.phone,
        first_name: values.firstName,
        last_name: values.lastName,
      }).unwrap();

      dispatch(setCredentials({ user: result }));
    } catch (error: any) {
      setError(error?.data?.message || "Unable to signup. Please try again later.");
    }
  }

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string().required('Phone number is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values) => handleSignup(values),
  });

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join lecole to elevate your learning experience</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="auth-form">
        <LeInput
          id="firstName"
          label="First Name"
          placeholder="John"
          touched={formik.touched.firstName}
          error={formik.errors.firstName}
          {...formik.getFieldProps('firstName')}
        />

        <LeInput
          id="lastName"
          label="Last Name"
          placeholder="Doe"
          touched={formik.touched.lastName}
          error={formik.errors.lastName}
          {...formik.getFieldProps('lastName')}
        />

        <LeInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          touched={formik.touched.email}
          error={formik.errors.email}
          {...formik.getFieldProps('email')}
        />

        <LeInput
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="800 000 0000"
          phonePrefix="+234"
          touched={formik.touched.phone}
          error={formik.errors.phone}
          {...formik.getFieldProps('phone')}
        />

        <LeInput
          id="password"
          label="Password"
          placeholder="••••••••"
          showPasswordToggle
          touched={formik.touched.password}
          error={formik.errors.password}
          {...formik.getFieldProps('password')}
        />

        <LeInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          showPasswordToggle
          touched={formik.touched.confirmPassword}
          error={formik.errors.confirmPassword}
          {...formik.getFieldProps('confirmPassword')}
        />

        <button
          type="submit"
          className={`le-button le-button-primary auth-submit-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="auth-error">{error && error}</p>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/login')}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;

