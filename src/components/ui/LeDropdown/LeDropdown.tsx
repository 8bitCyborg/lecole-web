import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import './ledropdown.css';

interface LeDropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  direction?: 'up' | 'down' | 'left' | 'right';
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
  direction = 'down',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const isError = touched && error;

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideTrigger = triggerRef.current && !triggerRef.current.contains(target);
      const isOutsidePortal = portalRef.current && !portalRef.current.contains(target);

      if (isOutsideTrigger && isOutsidePortal) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string, e: React.MouseEvent, disabledOption?: boolean) => {
    e.stopPropagation();
    if (disabledOption) return;
    if (onChange) {
      const event = {
        target: { name: props.name, value: optionValue },
        currentTarget: { name: props.name, value: optionValue }
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  const ChevronIcon = ({
    up: ChevronUp,
    left: ChevronLeft,
    right: ChevronRight,
    down: ChevronDown,
  } as const)[direction];

  const dropdownContent = isOpen && !disabled && (
    <div
      ref={portalRef}
      className={`le-select-dropdown ${direction}`}
      style={{
        position: 'fixed',
        left: direction === 'left' ? coords.left - 4 : direction === 'right' ? coords.left + coords.width + 4 : coords.left,
        top: direction === 'up' ? coords.top - 4 : direction === 'down' ? coords.top + 52 + 4 : coords.top, // 52 is standard height (3.25rem * 16)
        width: direction === 'left' || direction === 'right' ? 'max-content' : coords.width,
        transform: direction === 'up' ? 'translateY(-100%)' : direction === 'left' ? 'translateX(-100%)' : 'none',
        zIndex: 10000,
      }}
    >
      <div
        className={`le-select-option ${value === '' ? 'active' : ''}`}
        onClick={(e) => handleSelect('', e)}
      >
        {placeholder ? placeholder : `Select ${label && label}`}
      </div>
      {options.map((option) => (
        <div
          key={option.value}
          className={`le-select-option ${value === option.value ? 'active' : ''} ${option.disabled ? 'disabled' : ''}`}
          onClick={(e) => handleSelect(option.value, e, option.disabled)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`le-select-container ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
      {label && <label htmlFor={id} className="le-select-label">{label}</label>}

      <div
        ref={triggerRef}
        className={`le-select-trigger ${isError ? 'le-select-error' : ''} ${isOpen ? 'open' : ''} ${className}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        id={id}
      >
        <span className={selectedOption ? 'selected-text' : 'placeholder-text'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronIcon size={18} className={`select-chevron ${isOpen ? 'open' : ''}`} />
      </div>

      {createPortal(dropdownContent, document.body)}

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
        {options.map(opt => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>)}
      </select>

      {isError && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LeDropdown;
