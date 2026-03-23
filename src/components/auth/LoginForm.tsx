import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import LeInput from '../ui/LeInput/LeInput';

import { useLoginMutation } from '../../services/leApi/authApi';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: any) => {
    try {
      const result: any = await login(values).unwrap();
      dispatch(setCredentials({ user: result }));
    } catch (error: any) {
      console.error('Login failed:', error?.data?.message);
      setError(error?.data?.message || 'Unable to login. Please try again later.')
    };
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values) => handleLogin(values)
  });

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Enter your details to access your account</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="auth-form">
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
          id="password"
          label="Password"
          placeholder="••••••••"
          showPasswordToggle
          touched={formik.touched.password}
          error={formik.errors.password}
          {...formik.getFieldProps('password')}
        />

        <button
          type="submit"
          className={`le-button le-button-primary auth-submit-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="auth-error">{error && error}</p>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/signup')}>
            Create one for free
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

