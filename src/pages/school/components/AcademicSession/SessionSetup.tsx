import React, { useState } from 'react';
import { useCreateSessionMutation } from '@/services/leApi/sessionApi';
import { Button } from '@/components/ui/button';
import LeInput from '@/components/ui/LeInput/LeInput';
import {
  Layers,
  ArrowRight,
  CheckCircle2,
  Loader2,
  GraduationCap,
  BookOpen,
  Users,
  BarChart3,
} from 'lucide-react';

/**
 * SessionSetup
 *
 * Shown when no academic session exists yet.
 * Two-column card: form on the left, live preview + feature list on the right.
 */
const SessionSetup: React.FC = () => {
  const [createSession, { isLoading }] = useCreateSessionMutation();

  const [identifier, setIdentifier] = useState('');
  const [termsPerSession, setTermsPerSession] = useState(3);

  const isValid = identifier.trim().length > 0;
  const termSlots = Array.from({ length: termsPerSession }, (_, i) => i + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    try {
      await createSession({ identifier, termsPerSession }).unwrap();
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  return (
    <div className="as-root as-setup-root">
      <div className="as-setup-layout">

        {/* ── Left: Form ── */}
        <div className="as-setup-form-panel">
          <div className="as-setup-brand">
            <div className="as-setup-icon-wrap">
              <Layers className="as-setup-icon" />
            </div>
            <div>
              <p className="as-setup-eyebrow">Step 1 of 1</p>
              <h1 className="as-setup-title">Initialize Academic Session</h1>
            </div>
          </div>

          <p className="as-setup-subtitle">
            Define the current academic year. This creates the foundation for
            terms, grades, and attendance tracking across your school.
          </p>

          <form onSubmit={handleSubmit} className="as-setup-form">
            <div className="as-field-group">
              <LeInput
                label="Session Identifier"
                placeholder="e.g. 2025 / 2026"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <p className="as-field-hint">
                Typically the start and end year of the academic year.
              </p>
            </div>

            <div className="as-field-group">
              <label className="as-field-label">Terms per Session</label>
              <div className="as-pill-selector">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`as-pill ${termsPerSession === n ? 'as-pill--active' : ''}`}
                    onClick={() => setTermsPerSession(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isValid}
              className="as-primary-btn as-setup-submit"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Initializing…</>
              ) : (
                <>Initialize Session <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>
        </div>

        {/* ── Right: Live Preview ── */}
        <div className="as-setup-preview-panel">
          <p className="as-preview-eyebrow">Preview</p>

          <div className="as-preview-card">
            <div className="as-preview-header">
              <div className="as-preview-session-name">
                {identifier || <span className="as-preview-placeholder">2025 / 2026</span>}
              </div>
              <span className="as-active-badge">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>

            <div className="as-preview-terms-label">
              {termsPerSession} academic {termsPerSession === 1 ? 'term' : 'terms'}
            </div>

            <div className="as-preview-slots">
              {termSlots.map((n) => (
                <div key={n} className="as-preview-slot">
                  <span className="as-preview-slot-num">{n}</span>
                  <div className="as-preview-slot-bar" />
                </div>
              ))}
            </div>
          </div>

          <div className="as-unlocks">
            <p className="as-unlocks-title">Setting this up unlocks</p>
            <ul className="as-unlocks-list">
              <li>
                <GraduationCap className="as-unlock-icon" />
                <span>Grades &amp; broadsheets per term</span>
              </li>
              <li>
                <Users className="as-unlock-icon" />
                <span>Attendance tracking</span>
              </li>
              <li>
                <BookOpen className="as-unlock-icon" />
                <span>Subject &amp; module assignment</span>
              </li>
              <li>
                <BarChart3 className="as-unlock-icon" />
                <span>Academic performance reports</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SessionSetup;
