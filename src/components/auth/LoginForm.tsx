import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import LeInput from '../ui/LeInput';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

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
    onSubmit: (values) => {
      console.log('Login values:', values);
    },
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

        <button type="submit" className="le-button le-button-primary auth-submit-btn">
          Sign In
        </button>
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

