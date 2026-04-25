import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Term } from '@/services/leApi/sessionApi';

interface SessionProgressProps {
  terms: Term[];
  total: number;
  termNames: Record<number, string>;
  getSingular: (n: number) => string;
}

/**
 * SessionProgress
 *
 * Thin horizontal tracker showing how many of the planned terms
 * have been configured, with a progress bar and per-step indicators.
 */
const SessionProgress: React.FC<SessionProgressProps> = ({ terms, total, termNames, getSingular }) => {
  const filled = terms.length;
  const progressPct = total > 0 ? Math.round((filled / total) * 100) : 0;
  const termNamePlural = termNames[total]?.toLowerCase() || 'terms';
  const termNameSingular = getSingular(total);

  const steps = Array.from({ length: total }, (_, i) => ({
    slotNumber: i + 1,
    term: terms[i] ?? null,
  }));

  return (
    <section className="as-progress-section">
      <div className="as-progress-meta">
        <span className="as-progress-label">
          Setup Progress —{' '}
          <strong>
            {filled} of {total}
          </strong>{' '}
          {termNamePlural} completed
        </span>
        <span className="as-progress-pct">{progressPct}%</span>
      </div>

      <div className="as-progress-track">
        <div className="as-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="as-progress-steps">
        {steps.map(({ slotNumber, term }) => (
          <div
            key={slotNumber}
            className={`as-step ${term ? 'as-step--done' : 'as-step--pending'}`}
          >
            {term ? (
              <CheckCircle2 className="as-step-icon" />
            ) : (
              <span className="as-step-num">{slotNumber}</span>
            )}
            <span className="as-step-label">
              {term ? term.identifier : `${termNameSingular} ${slotNumber}`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SessionProgress;
