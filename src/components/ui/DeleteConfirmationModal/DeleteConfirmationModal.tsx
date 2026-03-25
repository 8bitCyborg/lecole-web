import React from 'react';
import './DeleteConfirmationModal.css';

interface DeleteConfirmationModalProps {
  title?: string;
  message?: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onConfirm,
  onCancel,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <div className="delete-warning-icon">⚠️</div>
          <h2 className="delete-modal-title">{title}</h2>
        </div>
        <div className="delete-modal-body">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>
        <div className="delete-modal-footer">
          <button
            className="le-button le-button-outline"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="le-button delete-confirm-btn"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
