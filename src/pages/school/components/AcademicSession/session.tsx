import React from 'react';
import { useGetCurrentSessionQuery } from '@/services/leApi/sessionApi';
import { Loader2 } from 'lucide-react';
import SessionSetup from './SessionSetup';
import SessionDashboard from './SessionDashboard';
import './style.css';

/**
 * AcademicSession
 *
 * Top-level orchestrator. Responsible only for:
 *  1. Fetching the current session.
 *  2. Routing to the correct view based on data state.
 *
 * All UI and business logic lives in the child components:
 *  - SessionSetup      → shown when no session exists
 *  - SessionDashboard  → shown when an active session exists
 *  - SessionProgress   → progress tracker (used inside Dashboard)
 *  - TermCard          → configured term display
 *  - PendingSlotCard   → unconfigured term slot (with locked state)
 *  - AddTermCard       → inline term creation form
 */
const AcademicSession: React.FC = () => {
  const { data: session, isLoading } = useGetCurrentSessionQuery();

  if (isLoading) {
    return (
      <div className="as-root as-center">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        <p className="as-loading-text">Loading academic session…</p>
      </div>
    );
  }

  if (!session) {
    return <SessionSetup />;
  }

  return <SessionDashboard session={session} />;
};

export default AcademicSession;