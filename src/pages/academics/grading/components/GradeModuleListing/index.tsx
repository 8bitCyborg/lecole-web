import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Edit3,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Info
} from 'lucide-react';
import {
  useGetGradingModulesQuery,
  useDeleteGradingModuleMutation,
  useToggleLockModulesMutation
} from '@/services/leApi/gradingApi';
import type { GradingModule } from '@/services/leApi/gradingApi';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './styles.css';

interface GradeModuleListingProps {
  onEdit: (module: GradingModule) => void;
  onAdd: () => void;
  totalPercentage: number;
}

const GradeModuleListing: React.FC<GradeModuleListingProps> = ({ onEdit, onAdd, totalPercentage }) => {
  const { data: modules = [], isLoading, error } = useGetGradingModulesQuery();
  const [deleteModule] = useDeleteGradingModuleMutation();
  const [toggleLock, { isLoading: isLocking }] = useToggleLockModulesMutation();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<GradingModule | null>(null);

  const isAtMaxAllocation = totalPercentage >= 100;

  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.length === modules.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(modules.map(m => m.id));
    }
  };

  const handleDeleteClick = (module: GradingModule, e: React.MouseEvent) => {
    e.stopPropagation();
    if (module.isLocked) return;
    setModuleToDelete(module);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (moduleToDelete) {
      try {
        await deleteModule(moduleToDelete.id).unwrap();
        setShowDeleteModal(false);
        setModuleToDelete(null);
      } catch (err) {
        console.error('Failed to delete module:', err);
      }
    }
  };

  const handleToggleLock = async (ids: string[], lock: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleLock({ ids, lock }).unwrap();
      if (ids.length > 1) setSelectedIds([]);
    } catch (err) {
      console.error('Failed to update lock status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="grading-compact-listing">
        <div className="loading-dense">Synchronizing modules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="academics-empty-state">
        <div className="empty-state-icon">❌</div>
        <h3 className="empty-state-title">Data Retrieval Unsuccessful</h3>
        <p className="empty-state-description">An error occurred while fetching your grading modules. Please refresh and try again.</p>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="academics-empty-state">
        <div className="empty-state-icon">📊</div>
        <h3 className="empty-state-title">No Active Modules</h3>
        <p className="empty-state-description">Your school's grading structure is currently empty. Define your first module to begin tracking student performance.</p>
      </div>
    );
  }

  return (
    <div className="grading-compact-listing">
      <div className="compact-listing-header">
        <div className="compact-listing-header-left">
          <div
            className={`custom-checkbox-listing ${selectedIds.length === modules.length && modules.length > 0 ? 'checked' : ''}`}
            onClick={handleSelectAll}
          >
            {selectedIds.length === modules.length && modules.length > 0 && <CheckCircle2 size={12} />}
          </div>

          {selectedIds.length > 0 && (
            <div className="mass-actions-bar">
              <span className="selected-count" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                {selectedIds.length} Selected
              </span>
              <button
                className="btn-mass-lock primary"
                onClick={(e) => handleToggleLock(selectedIds, true, e)}
                disabled={isLocking}
              >
                <Lock size={14} /> Lock All
              </button>
              <button
                className="btn-mass-lock outline"
                onClick={(e) => handleToggleLock(selectedIds, false, e)}
                disabled={isLocking}
              >
                <Unlock size={14} /> Unlock
              </button>
            </div>
          )}

          {selectedIds.length === 0 && (
            <div className="contribution-summary">
              <div className="summary-content">
                <p className="summary-title">
                  Grading Structure Overview
                </p>
                <div className="summary-stats">
                  <div className="stat-group">
                    <span className="stat-label-mini">Allocated</span>
                    <span className="stat-value-mini success">{totalPercentage}%</span>
                  </div>
                  <div className="stat-group">
                    <span className="stat-label-mini">Remaining</span>
                    <span className={`stat-value-mini ${totalPercentage > 100 && 'error'}`} style={{ color: 'white' }}>
                      {Math.max(0, 100 - totalPercentage)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="summary-actions">
          {isAtMaxAllocation && (
            <div className="max-allocation-warning">
              <Info size={12} />
              Max Capacity Reached
            </div>
          )}
          <button
            className="le-button le-button-primary btn-add-module-compact"
            onClick={onAdd}
            disabled={isAtMaxAllocation}
          >
            <Plus size={16} />
            Add Grade Module
          </button>
        </div>
      </div>

      <table className="compact-table">
        <thead className="compact-table-head">
          <tr>
            <th className="table-head-label"></th>
            <th className="table-head-label">Module Name</th>
            <th className="table-head-label">Contribution</th>
            <th className="table-head-label">Category</th>
            <th className="table-head-label">Security</th>
            <th className="table-head-label" style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody className="compact-table-body">
          {modules.slice().sort((a, b) => (a.sequence || 0) - (b.sequence || 0)).map((module) => {
            const isSelected = selectedIds.includes(module.id);
            return (
              <tr
                key={module.id}
                className={`compact-table-row ${isSelected ? 'selected' : ''} ${module.isLocked ? 'locked' : ''}`}
              // onClick={(e) => handleSelect(module.id, e)}
              >
                <td className="card-selection-overlay">
                  <div
                    className={`custom-checkbox-listing ${isSelected ? 'checked' : ''}`}
                    onClick={(e) => handleSelect(module.id, e)}
                  >
                    {isSelected && <CheckCircle2 size={12} />}
                  </div>
                </td>

                <td className="row-cell cell-name" data-label="Module Name">
                  <div className="cell-content">{module.name}</div>
                </td>

                <td className="row-cell cell-percentage" data-label="Contribution">
                  <div className="cell-content">
                    <span className="percentage-val" style={{ fontSize: '0.9rem' }}>{module.percentage}%</span>
                  </div>
                </td>

                <td className="row-cell" data-label="Category">
                  <div className="cell-content">
                    <span className={`mini-pill pill-${module.category.toLowerCase()}`}>
                      {module.category}
                    </span>
                  </div>
                </td>

                <td className="row-cell" data-label="Security">
                  <div className="cell-content">
                    <div className={`status-lock-pill ${module.isLocked ? 'locked' : 'open'}`}>
                      {module.isLocked ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                      {module.isLocked ? (
                        <span className="status-text">Locked</span>
                      ) : (
                        <span className="status-text">Open</span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="compact-actions" data-label="Actions">
                  <div className="actions-wrapper">
                    <button
                      className="mini-action-btn btn-edit"
                      onClick={(e) => { e.stopPropagation(); onEdit(module); }}
                      title="Edit Module"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="mini-action-btn btn-lock"
                      onClick={(e) => handleToggleLock([module.id], !module.isLocked, e)}
                      title={module.isLocked ? "Unlock Module" : "Lock Module"}
                    >
                      {module.isLocked ? <Unlock size={15} /> : <Lock size={15} />}
                    </button>
                    <button
                      className="mini-action-btn btn-delete"
                      onClick={(e) => handleDeleteClick(module, e)}
                      disabled={module.isLocked}
                      title="Delete Module"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title={`Delete Grading Module: ${moduleToDelete?.name}`}
        message={
          <>
            <p>Are you sure you want to absolute delete this grading module? This will remove it from all academic calculations for the current term.</p>
            <div className="delete-impact-notice" style={{ marginTop: '1rem', padding: '1rem', background: '#fff1f2', borderRadius: '0.75rem', border: '1px solid #ffe4e6' }}>
              <p style={{ color: '#e11d48', fontSize: '0.85rem', fontWeight: 800 }}>Impact Warning:</p>
              <ul style={{ color: '#991b1b', fontSize: '0.8rem', margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                <li>Associated student grades for this module will be hidden.</li>
                <li>Term total calculations will be updated immediately.</li>
              </ul>
            </div>
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default GradeModuleListing;
