import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import './LeFormError.css';

interface LeFormErrorProps {
  message: string;
  onClose?: () => void;
}

const LeFormError: React.FC<LeFormErrorProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="le-form-error-container">
      <div className="le-form-error-content">
        <div className="le-form-error-icon">
          <AlertCircle size={20} />
        </div>
        <div className="le-form-error-message">
          <span className="le-form-error-title">Submission Error</span>
          <p className="le-form-error-text">{message}</p>
        </div>
        {onClose && (
          <button type="button" className="le-form-error-close" onClick={onClose} aria-label="Close error">
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LeFormError;
