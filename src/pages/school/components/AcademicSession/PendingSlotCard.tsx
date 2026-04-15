import React from 'react';
import { Plus, Lock } from 'lucide-react';

interface PendingSlotCardProps {
  slotNumber: number;
  /** If true, an active term is blocking new term creation. */
  blocked: boolean;
  onAdd: () => void;
}

/**
 * PendingSlotCard
 *
 * Dashed placeholder shown for each un-configured term slot.
 *
 * If `blocked` is true (an active term exists), the slot is rendered in a
 * locked state with a clear explanation — the admin must end the current
 * active term before a new one can be added.
 */
const PendingSlotCard: React.FC<PendingSlotCardProps> = ({
  slotNumber,
  blocked,
  onAdd,
}) => {
  if (blocked) {
    return (
      <div className="as-pending-slot as-pending-slot--locked" title="End the active term before adding a new one">
        <Lock className="as-pending-icon" />
        <span className="as-pending-label">Term {slotNumber}</span>
        <span className="as-pending-hint">End active term first</span>
      </div>
    );
  }

  return (
    <button
      className="as-pending-slot"
      onClick={onAdd}
      type="button"
      aria-label={`Add Term ${slotNumber}`}
    >
      <Plus className="as-pending-icon" />
      <span className="as-pending-label">Term {slotNumber}</span>
      <span className="as-pending-hint">Click to add</span>
    </button>
  );
};

export default PendingSlotCard;
