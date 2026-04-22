import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './styles.css';

interface SheetProps {
  /** Controls whether the sheet is visible */
  isOpen: boolean;
  /** Called when the user requests to close the sheet (overlay click or close button) */
  onClose: () => void;
  /** Content to render inside the slide-in panel */
  children: React.ReactNode;
  /**
   * When true the close button is visually disabled and the overlay click is ignored.
   * Use this while an async operation (e.g. form submission) is in progress.
   */
  isSubmitting?: boolean;
  style?: React.CSSProperties;
}

const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  children,
  isSubmitting = false,
  style,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleOverlayClick = () => {
    if (!isSubmitting) onClose();
  };

  const handleCloseClick = () => {
    if (!isSubmitting) onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal-content"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={handleCloseClick}
          disabled={isSubmitting}
          aria-label="Close"
          style={{
            opacity: isSubmitting ? 0.5 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Sheet;
