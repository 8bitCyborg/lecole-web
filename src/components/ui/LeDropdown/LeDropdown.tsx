import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './ledropdown.css';

interface LeDropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const LeDropdown: React.FC<LeDropdownProps> = ({
  label,
  placeholder,
  error,
  touched,
  options,
  id,
  className = '',
  value = '',
  onChange,
  disabled,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isError = touched && error;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      // Simulate an event object for compatibility with typical form handlers
      const event = {
        target: { name: props.name, value: optionValue },
        currentTarget: { name: props.name, value: optionValue }
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`le-select-container ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
      {label && <label htmlFor={id} className="le-select-label">{label}</label>}

      <div
        className={`le-select-trigger ${isError ? 'le-select-error' : ''} ${isOpen ? 'open' : ''} ${className}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        id={id}
      >
        <span className={selectedOption ? 'selected-text' : 'placeholder-text'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} className={`select-chevron ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && !disabled && (
        <div className="le-select-dropdown">
          <div
            className={`le-select-option ${value === '' ? 'active' : ''}`}
            onClick={(e) => handleSelect('', e)}
          >
            {placeholder ? placeholder : `Select ${label && label}`}
          </div>
          {options.map((option) => (
            <div
              key={option.value}
              className={`le-select-option ${value === option.value ? 'active' : ''}`}
              onClick={(e) => handleSelect(option.value, e)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Hidden native select for form data/accessibility compliance */}
      <select
        className="hidden-native-select"
        value={value}
        onChange={onChange}
        name={props.name}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
      >
        <option value="">Select...</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>

      {isError && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LeDropdown;
