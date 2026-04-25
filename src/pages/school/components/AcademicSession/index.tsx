import React from 'react';
import { useGetCurrentSessionQuery } from '@/services/leApi/sessionApi';
import { Loader2, School } from 'lucide-react';
import SessionSetup from './SessionSetup';
import SessionDashboard from './SessionDashboard';
import { useFindMySchoolQuery } from '@/services/leApi/schoolApi';
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
const TERM_NAMES: Record<number, string> = {
  1: 'Year',
  2: 'Semesters',
  3: 'Terms',
  4: 'Quarters',
};

const getSingular = (n: number) => {
  switch (n) {
    case 1: return 'Year';
    case 2: return 'Semester';
    case 3: return 'Term';
    case 4: return 'Quarter';
    default: return 'Term';
  }
};

const AcademicSession: React.FC = () => {
  const { data: school, isLoading: schoolLoading } = useFindMySchoolQuery();
  const { data: session, isLoading } = useGetCurrentSessionQuery(undefined, {
    skip: !school
  });

  if (isLoading || schoolLoading) {
    return (
      <div className="as-root as-center">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        <p className="as-loading-text">Loading academic session…</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="as-root as-center as-empty-state">
        <div className="as-empty-icon-wrap">
          <School className="as-empty-icon" />
        </div>
        <div className="as-empty-content">
          <h2 className="as-empty-title">Please, setup your school first</h2>
          <p className="as-empty-description">
            Before you can manage academic sessions, you need to first setup your school in the profile tab
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <SessionSetup termNames={TERM_NAMES} getSingular={getSingular} />;
  }

  return (
    <SessionDashboard
      session={session}
      termNames={TERM_NAMES}
      getSingular={getSingular}
    />
  );
};

export default AcademicSession;