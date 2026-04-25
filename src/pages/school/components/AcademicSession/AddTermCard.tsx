import React, { useState, useEffect } from 'react';
import { useCreateTermMutation } from '@/services/leApi/sessionApi';
import { Button } from '@/components/ui/button';
import LeInput from '@/components/ui/LeInput/LeInput';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';
import LeDatePicker from '@/components/ui/LeDatePicker/LeDatePicker';
import { Loader2, X } from 'lucide-react';

const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];

interface AddTermCardProps {
  slotNumber: number;
  sessionId: string;
  totalTerms: number;
  getSingular: (n: number) => string;
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * AddTermCard
 *
 * Inline form card that replaces a PendingSlotCard when the admin
 * clicks to configure a new term. Submits directly to the API and
 * calls onSuccess / onCancel to hand control back to the parent.
 */

const AddTermCard: React.FC<AddTermCardProps> = ({
  sessionId,
  totalTerms,
  getSingular,
  onCancel,
  onSuccess,
}) => {
  const [createTerm, { isLoading }] = useCreateTermMutation();
  const termName = getSingular(totalTerms);

  const [identifier, setIdentifier] = useState('');
  const [customIdentifier, setCustomIdentifier] = useState('');
  const [startDate, setStartDate] = useState('');
  const [weeks, setWeeks] = useState(12);
  const [estimatedEndDate, setEstimatedEndDate] = useState('');

  const termOptions = [
    ...Array.from({ length: totalTerms }, (_, i) => ({
      value: `${ordinals[i] || i + 1} ${termName}`,
      label: `${ordinals[i] || i + 1} ${termName}`
    })),
    { value: 'custom', label: 'Custom...' }
  ];

  useEffect(() => {
    if (startDate && weeks) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        const end = new Date(start.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
        setEstimatedEndDate(end.toISOString().split('T')[0]);
      }
    } else {
      setEstimatedEndDate('');
    }
  }, [startDate, weeks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalIdentifier = identifier === 'custom' ? customIdentifier : identifier;
      await createTerm({
        academicSessionId: sessionId,
        identifier: finalIdentifier,
        startDate,
        numberOfWeeks: weeks,
      }).unwrap();
      onSuccess();
    } catch (err) {
      console.error(`Failed to create ${termName.toLowerCase()}:`, err);
    }
  };

  return (
    <div className="as-add-term-card">
      <div className="as-add-term-header">
        <span className="as-term-index">Configure {termName}</span>
        <button className="as-cancel-btn" onClick={onCancel} type="button" aria-label="Cancel">
          <X className="w-4 h-4" />
        </button>
      </div>
      <hr className="as-term-divider" />
      <form onSubmit={handleSubmit} className="as-add-term-form">
        <LeDropdown
          label={`${termName} Name`}
          options={termOptions}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        {identifier === 'custom' && (
          <LeInput
            label="Custom Name"
            placeholder="e.g. Summer Intensive"
            value={customIdentifier}
            onChange={(e) => setCustomIdentifier(e.target.value)}
            required
            autoFocus
          />
        )}
        <LeDatePicker
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
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
          value={estimatedEndDate}
          disabled
          readOnly
        />
        <div className="as-add-term-actions">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isLoading}
            className="as-primary-btn"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Adding…</>
            ) : (
              `Add ${termName}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTermCard;
