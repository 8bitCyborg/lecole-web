import React from 'react';
import './DatePicker.css';

interface LeDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
}

const LeDatePicker: React.FC<LeDatePickerProps> = ({
  label,
  error,
  touched,
  id,
  className = '',
  ...props
}) => {
  const isError = touched && error;

  return (
    <div className="le-datepicker-group">
      <label htmlFor={id} className="le-datepicker-label">{label}</label>
      <div className="le-datepicker-wrapper">
        <input
          id={id}
          type="date"
          className={`le-datepicker-input ${isError ? 'error' : ''} ${className}`}
          {...props}
        />
        <div className="le-datepicker-icon-wrapper">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>
      {isError && <div className="le-datepicker-error-message">{error}</div>}
    </div>
  );
};

export default LeDatePicker;
