import React from 'react';
import './ledropdown.css';

interface LeDropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  touched?: boolean;
  options: { value: string; label: string }[];
}

const LeDropdown: React.FC<LeDropdownProps> = ({
  label,
  error,
  touched,
  options,
  id,
  className = '',
  ...props
}) => {
  const isError = touched && error;

  return (
    <div className="le-select-container">
      <label htmlFor={id} className="le-select-label">{label}</label>
      <select
        id={id}
        className={`le-select ${isError ? 'le-select-error' : ''} ${className}`}
        {...props}
      >
        <option value="">Select {label}...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isError && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LeDropdown;
