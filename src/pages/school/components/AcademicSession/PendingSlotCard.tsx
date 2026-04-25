import React from 'react';
import { Plus, Lock } from 'lucide-react';

interface PendingSlotCardProps {
  slotNumber: number;
  totalTerms: number;
  getSingular: (n: number) => string;
  /** If true, an active term is blocking new term creation. */
  blocked: boolean;
  onAdd: () => void;
}

const PendingSlotCard: React.FC<PendingSlotCardProps> = ({
  slotNumber,
  totalTerms,
  getSingular,
  blocked,
  onAdd,
}) => {
  const termName = getSingular(totalTerms);

  if (blocked) {
    return (
      <div className="as-pending-slot as-pending-slot--locked" title={`End the active ${termName.toLowerCase()} before adding a new one`}>
        <Lock className="as-pending-icon" />
        <span className="as-pending-label">{termName} {slotNumber}</span>
        <span className="as-pending-hint">End active {termName.toLowerCase()} first</span>
      </div>
    );
  }

  return (
    <button
      className="as-pending-slot"
      onClick={onAdd}
      type="button"
      aria-label={`Add ${termName} ${slotNumber}`}
    >
      <Plus className="as-pending-icon" />
      <span className="as-pending-label">{termName} {slotNumber}</span>
      <span className="as-pending-hint">Click to add</span>
    </button>
  );
};

export default PendingSlotCard;
