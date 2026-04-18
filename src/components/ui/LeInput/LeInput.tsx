import React, { useState } from 'react';
import './leinput.css';


interface LeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'label'> {
  label?: React.ReactNode;
  error?: string;
  touched?: boolean;
  showPasswordToggle?: boolean;
  phonePrefix?: string;
}

const LeInput: React.FC<LeInputProps> = ({
  label,
  error,
  touched,
  showPasswordToggle,
  phonePrefix,
  id,
  type = 'text',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isError = touched && error;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}

      <div className={`input-outer-wrapper ${phonePrefix ? 'phone-input-wrapper' : ''} ${showPasswordToggle ? 'password-input-wrapper' : ''}`}>
        {phonePrefix && <span className="phone-prefix">{phonePrefix}</span>}

        <input
          id={id}
          type={inputType}
          pattern={type === 'tel' ? '[0-9]{10}' : undefined}
          className={`form-input ${isError ? 'error' : ''} ${className}`}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {isError && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LeInput;
