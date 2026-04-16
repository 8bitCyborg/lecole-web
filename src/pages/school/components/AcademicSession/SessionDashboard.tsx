import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Edit2, Loader2, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeInput from '@/components/ui/LeInput/LeInput';
import { useUpdateSessionMutation, useEndSessionMutation, type AcademicSession } from '@/services/leApi/sessionApi';
import SessionProgress from './SessionProgress';
import TermCard from './TermCard';
import PendingSlotCard from './PendingSlotCard';
import AddTermCard from './AddTermCard';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal/DeleteConfirmationModal';

interface SessionDashboardProps {
  session: AcademicSession;
}

/**
 * SessionDashboard
 *
 * The "Focus View" rendered when an active academic session exists.
 *
 * Business rules enforced:
 * - If any term has status === 'active', no new term may be added.
 *   Pending slots render as locked and the "Add Term" button is replaced
 *   with a contextual notice.
 * - Only the next un-filled slot can be opened for editing at a time.
 */
const SessionDashboard: React.FC<SessionDashboardProps> = ({ session }) => {
  const terms = session.terms ?? [];
  const total = session.termsPerSession;
  const filled = terms.length;

  /** The slot number currently open for input (null = none) */
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  /** Edit Session State */
  const [isEditing, setIsEditing] = useState(false);
  const [editIdentifier, setEditIdentifier] = useState(session.identifier);
  const [editTermsPerSession, setEditTermsPerSession] = useState(session.termsPerSession);

  const [updateSession, { isLoading: isUpdating }] = useUpdateSessionMutation();
  const [endSession, { isLoading: isEndingSession }] = useEndSessionMutation();

  const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false);

  const handleEndSession = async () => {
    try {
      await endSession(session.id).unwrap();
      setIsEndSessionModalOpen(false);
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editIdentifier.trim()) return;
    try {
      await updateSession({
        id: session.id,
        identifier: editIdentifier,
        termsPerSession: editTermsPerSession,
      }).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update session:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditIdentifier(session.identifier);
    setEditTermsPerSession(session.termsPerSession);
    setIsEditing(false);
  };

  /**
   * An active term blocks new-term creation.
   * A term must be concluded before the next one can begin.
   */
  const hasActiveTerm = terms.some((t) => t.status === 'active');

  // Build the unified slot list
  // Only show existing terms, plus a maximum of ONE pending slot to keep the UI focused.
  const slotsCount = Math.min(filled + 1, total);
  const slots = Array.from({ length: slotsCount }, (_, i) => {
    if (i < filled) return { type: 'term' as const, term: terms[i], slotNumber: i + 1 };
    return { type: 'pending' as const, slotNumber: i + 1 };
  });


  return (
    <div className="as-root as-dashboard-enter">
      <div className="as-focus-wrap">

        {/* ── Page Header ── */}
        <header className="as-header">
          {isEditing ? (
            <div className="as-header-edit-mode w-full border border-indigo-100 bg-indigo-50/30 p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-start md:items-center justify-between shadow-sm">
              <div className="flex-1 flex flex-col md:flex-row gap-5 items-start md:items-center w-full">
                <div className="flex-1 w-full max-w-sm">
                  <LeInput
                    label="Session Identifier"
                    value={editIdentifier}
                    onChange={(e) => setEditIdentifier(e.target.value)}
                    required
                    placeholder="e.g. 2025 / 2026"
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-full max-w-[14rem]">
                  <label className="text-xs font-semibold text-slate-600">Terms per Session</label>
                  <div className="as-pill-selector">
                    {[1, 2, 3, 4].map((n) => {
                      const isDisabled = n < filled;
                      return (
                        <button
                          key={n}
                          type="button"
                          className={`as-pill ${editTermsPerSession === n ? 'as-pill--active' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => !isDisabled && setEditTermsPerSession(n)}
                          disabled={isDisabled}
                          title={isDisabled ? `Cannot reduce below ${filled} existing terms` : ''}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 md:mt-0 pt-2 md:pt-0 w-full md:w-auto justify-end border-t border-indigo-100 md:border-none">
                <Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={isUpdating} className="text-slate-600">
                  <X className="w-4 h-4 mr-1.5" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit} disabled={isUpdating || !editIdentifier.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                  {isUpdating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving</> : <><Save className="w-4 h-4 mr-1.5" /> Save Changes</>}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="as-header-left">
                <div className="as-header-eyebrow flex items-center gap-2">
                  <span className="as-eyebrow-dot" />
                  Current Academic Session
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-indigo-400 hover:text-indigo-600 transition-colors bg-indigo-50 hover:bg-indigo-100 p-1 rounded-md"
                    title="Edit Session Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h1 className="as-session-title">{session.identifier}</h1>
              </div>
              <span className="as-active-badge">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            </>
          )}
        </header>

        {/* ── Progress Tracker ── */}
        <SessionProgress terms={terms} total={total} />

        {/* ── Terms Section ── */}
        <section className="as-terms-section">
          <div className="as-terms-header">
            <h2 className="as-section-title">Academic Terms</h2>

            {filled < total && (
              hasActiveTerm && (
                <div className="as-blocked-notice">
                  <AlertCircle className="as-blocked-icon" />
                  <span>End the active term to add the next one</span>
                </div>
              )
            )}
          </div>

          <div className="as-terms-grid">
            {slots.map((slot) => {
              // ── Configured term ──
              if (slot.type === 'term') {
                return (
                  <TermCard
                    key={slot.term.id}
                    term={slot.term}
                    index={slot.slotNumber - 1}
                    totalTerms={total}
                  />
                );
              }

              // ── Pending slot — open for editing ──
              if (activeSlot === slot.slotNumber) {
                return (
                  <AddTermCard
                    key={`add-${slot.slotNumber}`}
                    slotNumber={slot.slotNumber}
                    sessionId={session.id}
                    totalTerms={total}
                    onCancel={() => setActiveSlot(null)}
                    onSuccess={() => setActiveSlot(null)}
                  />
                );
              }

              // ── Pending slot — idle or locked ──
              return (
                <PendingSlotCard
                  key={`pending-${slot.slotNumber}`}
                  slotNumber={slot.slotNumber}
                  blocked={hasActiveTerm}
                  onAdd={() => !hasActiveTerm && setActiveSlot(slot.slotNumber)}
                />
              );
            })}
          </div>

          <div className="mt-5 flex flex-col items-center border-t border-slate-100 pb-10">
            <div className="max-w-xl text-center mb-6">
              <h3 className="text-slate-900 font-bold text-lg">End Academic Session</h3>
              <p className="text-slate-500 text-sm mt-2">
                Concluding this session will finalize all academic records for <span className="font-semibold text-slate-700">{session.identifier}</span>.
                This action will clear your current academic context and allow you to configure a new session.
              </p>
            </div>
            <Button
              onClick={() => setIsEndSessionModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-10 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              disabled={isEndingSession}
            >
              {isEndingSession ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Concluding Session...</>
              ) : (
                `Conclude ${session.identifier} Session`
              )}
            </Button>
          </div>

          <DeleteConfirmationModal
            isOpen={isEndSessionModalOpen}
            title="End Academic Session"
            message={
              <>
                You are about to end the <span className="font-semibold">{session.identifier}</span> academic session.<br /><br />
                This will conclude all terms within this session and reset the school's active academic context.<br />
                This action <span className="text-red-600 font-bold">cannot be undone</span>.
              </>
            }
            confirmText={isEndingSession ? 'Concluding...' : 'Yes, Conclude Session'}
            cancelText="Cancel"
            onConfirm={handleEndSession}
            onCancel={() => setIsEndSessionModalOpen(false)}
            requiresPassword={true}
          />
        </section>

      </div>
    </div>
  );
};

export default SessionDashboard;
