import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CalendarCheck, Edit2, Loader2, X } from 'lucide-react';
import { useUpdateTermMutation, useEndTermMutation, type Term } from '@/services/leApi/sessionApi';
import LeInput from '@/components/ui/LeInput/LeInput';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';
import LeDatePicker from '@/components/ui/LeDatePicker/LeDatePicker';
import { Button } from '@/components/ui/button';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal/DeleteConfirmationModal';

const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];

interface TermCardProps {
  term: Term;
  index: number;
  totalTerms: number;
}

/**
 * TermCard
 *
 * Displays a single, fully-configured academic term.
 * Shows name, status badge, start date, and duration.
 */
const TermCard: React.FC<TermCardProps> = ({ term, index, totalTerms }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [updateTerm, { isLoading }] = useUpdateTermMutation();
  const [endTerm, { isLoading: isEnding }] = useEndTermMutation();

  const [identifier, setIdentifier] = useState(term.identifier);
  const [startDateStr, setStartDateStr] = useState(new Date(term.startDate).toISOString().split('T')[0]);
  const [weeks, setWeeks] = useState(term.numberOfWeeks);
  const [estimatedEndDateEdit, setEstimatedEndDateEdit] = useState('');

  const termOptions = Array.from({ length: totalTerms }, (_, i) => ({
    value: `${ordinals[i] || i + 1} Term`,
    label: `${ordinals[i] || i + 1} Term`
  }));

  useEffect(() => {
    if (startDateStr && weeks) {
      const start = new Date(startDateStr);
      if (!isNaN(start.getTime())) {
        const end = new Date(start.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
        setEstimatedEndDateEdit(end.toISOString().split('T')[0]);
      }
    } else {
      setEstimatedEndDateEdit('');
    }
  }, [startDateStr, weeks]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTerm({
        id: term.id,
        identifier: identifier,
        startDate: startDateStr,
        numberOfWeeks: weeks,
      }).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update term:', err);
    }
  };

  const handleCancelEdit = () => {
    setIdentifier(term.identifier);
    setStartDateStr(new Date(term.startDate).toISOString().split('T')[0]);
    setWeeks(term.numberOfWeeks);
    setIsEditing(false);
  };

  const handleEndTerm = async () => {
    try {
      await endTerm(term.id).unwrap();
      setIsEndModalOpen(false);
    } catch (err) {
      console.error('Failed to end term:', err);
    }
  };

  const startDate = new Date(term.startDate);

  // Calculate estimated end date if not explicitly set
  const estimatedEndDate = new Date(startDate.getTime() + term.numberOfWeeks * 7 * 24 * 60 * 60 * 1000);
  const endDate = term.endDate ? new Date(term.endDate) : estimatedEndDate;

  const formatDate = (date: Date) => date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (isEditing) {
    return (
      <div className="as-add-term-card">
        <div className="as-add-term-header">
          <span className="as-term-index">Term {index + 1} - Edit</span>
          <button className="as-cancel-btn" onClick={handleCancelEdit} type="button" aria-label="Cancel">
            <X className="w-4 h-4" />
          </button>
        </div>
        <hr className="as-term-divider" />
        <form onSubmit={handleSaveEdit} className="as-add-term-form">
          <LeDropdown
            label="Term Name"
            options={termOptions}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <LeDatePicker
            label="Start Date"
            value={startDateStr}
            onChange={(e) => setStartDateStr(e.target.value)}
            required
          />
          <LeInput
            label="Duration (weeks)"
            type="number"
            value={weeks.toString()}
            onChange={(e) => setWeeks(parseInt(e.target.value, 10))}
            min="1"
            max="52"
            required
          />
          <LeDatePicker
            label="Estimated End Date"
            value={estimatedEndDateEdit}
            disabled
            readOnly
          />
          <div className="as-add-term-actions">
            <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="as-primary-btn"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="as-term-card" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="as-term-card-top">
        <div className="flex items-center gap-2">
          <span className="as-term-index">Term {index + 1}</span>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-indigo-400 hover:text-indigo-600 transition-colors bg-indigo-50 hover:bg-indigo-100 p-1 rounded-md"
            title="Edit Term Details"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className={`as-term-badge as-term-badge--${term.status}`}>
          {term.status}
        </span>
      </div>
      <hr className="as-term-divider" />
      <h3 className="as-term-name">{term.identifier}</h3>
      <div className="as-term-meta">
        <div className="as-term-meta-item" title="Start Date">
          <Calendar className="as-meta-icon" />
          <span className="as-meta-label">Starting Date:</span>
          <span className="as-meta-val">{formatDate(startDate)}</span>
        </div>
        <div className="as-term-meta-item" title="Estimated End Date">
          <CalendarCheck className="as-meta-icon" />
          <span className="as-meta-label">Ending Date:</span>
          <span className="as-meta-val">{formatDate(endDate)}</span>
        </div>
        <div className="as-term-meta-item" title="Duration">
          <Clock className="as-meta-icon" />
          <span className="as-meta-label">Duration:</span>
          <span className="as-meta-val">{term.numberOfWeeks} wks</span>
        </div>
      </div>

      {term.status === 'active' && (
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
          <Button
            onClick={() => setIsEndModalOpen(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            disabled={isEnding}
          >
            End Term
          </Button>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isEndModalOpen}
        title="End Term"
        message={
          <>
            You are about to end <span className="font-semibold">{term.identifier}</span>.<br /><br />
            This action finalizes all student scores and attendance registers.<br />
            Once closed, these records can be viewed but not edited.
          </>
        }
        confirmText={isEnding ? 'Ending...' : 'Yes, End Term'}
        cancelText="Cancel"
        onConfirm={handleEndTerm}
        onCancel={() => setIsEndModalOpen(false)}
      />
    </div>
  )
};

export default TermCard;
