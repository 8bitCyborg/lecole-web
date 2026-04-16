import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './DeleteConfirmationModal.css';
import LeInput from '../LeInput/LeInput';
import { useVerifyPasswordMutation } from '../../../services/leApi/authApi';
import { Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  title?: string;
  message?: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  requiresPassword?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onConfirm,
  onCancel,
  isOpen,
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  variant = 'danger',
  requiresPassword = false
}) => {
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [verifyPassword, { isLoading: isVerifying }] = useVerifyPasswordMutation();

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setPasswordError('');
    }
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = async () => {
    if (requiresPassword) {
      if (!password) {
        setPasswordError('Password is required to proceed');
        return;
      }

      try {
        await verifyPassword({ password }).unwrap();
        onConfirm();
      } catch (err: any) {
        setPasswordError(err?.data?.message || 'Incorrect password. Access denied.');
      }
    } else {
      onConfirm();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <div className="delete-warning-icon">⚠️</div>
          <h2 className="delete-modal-title">{title}</h2>
        </div>
        <div className="delete-modal-body">
          {typeof message === 'string' ? <p>{message}</p> : message}

          {requiresPassword && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <LeInput
                label="Confirm Password"
                type="password"
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                error={passwordError}
                touched={!!passwordError}
                required
              />
              <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-tight font-medium">
                Identity verification is required for this action
              </p>
            </div>
          )}
        </div>
        <div className="delete-modal-footer">
          <button
            className="le-button le-button-outline"
            onClick={onCancel}
            disabled={isVerifying}
          >
            {cancelText}
          </button>
          <button
            className={`le-button ${variant === 'danger' ? 'delete-confirm-btn' : 'le-button-primary'} flex items-center justify-center gap-2`}
            onClick={handleConfirm}
            disabled={isVerifying}
          >
            {isVerifying && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmationModal;
