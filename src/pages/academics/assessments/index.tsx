import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ClipboardList,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Plus,
  Search,
  BookOpen,
} from 'lucide-react';
import '../Academics.css';

/* ── Dummy Data ──────────────────────────────────────────────────────── */

type AssessStatus = 'upcoming' | 'ongoing' | 'completed' | 'overdue';
type AssessType = 'Exam' | 'CAT' | 'Quiz' | 'Assignment' | 'Essay';

interface Assessment {
  id: string;
  title: string;
  type: AssessType;
  subject: string;
  class: string;
  date: string;
  dueDate: string;
  status: AssessStatus;
  participants: number;
  submitted: number;
  maxScore: number;
  avgScore: number | null;
  createdBy: string;
}

const assessmentsData: Assessment[] = [
  {
    id: 'a1',
    title: 'Mid-Term Mathematics Examination',
    type: 'Exam',
    subject: 'Mathematics',
    class: 'JSS 1 — All Arms',
    date: 'Apr 12, 2026',
    dueDate: 'Apr 12, 2026',
    status: 'upcoming',
    participants: 124,
    submitted: 0,
    maxScore: 100,
    avgScore: null,
    createdBy: 'Mr. Adeyemi',
  },
  {
    id: 'a2',
    title: 'English Language Continuous Assessment Test',
    type: 'CAT',
    subject: 'English Language',
    class: 'JSS 2B',
    date: 'Apr 08, 2026',
    dueDate: 'Apr 10, 2026',
    status: 'ongoing',
    participants: 42,
    submitted: 25,
    maxScore: 30,
    avgScore: null,
    createdBy: 'Mrs. Okonkwo',
  },
  {
    id: 'a3',
    title: 'Basic Science Chapter 4 Quiz',
    type: 'Quiz',
    subject: 'Basic Science',
    class: 'JSS 3A',
    date: 'Apr 05, 2026',
    dueDate: 'Apr 05, 2026',
    status: 'completed',
    participants: 38,
    submitted: 38,
    maxScore: 20,
    avgScore: 15,
    createdBy: 'Mr. Nwosu',
  },
  {
    id: 'a4',
    title: 'Social Studies Essay — Democracy',
    type: 'Essay',
    subject: 'Social Studies',
    class: 'JSS 1C',
    date: 'Apr 01, 2026',
    dueDate: 'Apr 03, 2026',
    status: 'overdue',
    participants: 40,
    submitted: 18,
    maxScore: 30,
    avgScore: null,
    createdBy: 'Mrs. Fashola',
  },
  {
    id: 'a5',
    title: 'Civic Education Assignment — Government',
    type: 'Assignment',
    subject: 'Civic Education',
    class: 'JSS 2A',
    date: 'Mar 30, 2026',
    dueDate: 'Apr 02, 2026',
    status: 'completed',
    participants: 44,
    submitted: 44,
    maxScore: 20,
    avgScore: 17,
    createdBy: 'Mr. Okafor',
  },
  {
    id: 'a6',
    title: 'French Oral Examination',
    type: 'Exam',
    subject: 'French',
    class: 'JSS 2 — All Arms',
    date: 'Apr 18, 2026',
    dueDate: 'Apr 18, 2026',
    status: 'upcoming',
    participants: 88,
    submitted: 0,
    maxScore: 50,
    avgScore: null,
    createdBy: 'Mme. Laurent',
  },
];

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Overdue', value: 'overdue' },
];

const kpiData = [
  { label: 'Total Assessments', value: '6', sub: 'This term', iconClass: 'acad-kpi-icon-blue', icon: ClipboardList },
  { label: 'Upcoming', value: '2', sub: 'Next 14 days', iconClass: 'acad-kpi-icon-amber', icon: Calendar },
  { label: 'Completed', value: '2', sub: 'Fully graded', iconClass: 'acad-kpi-icon-green', icon: CheckCircle2 },
  { label: 'Overdue', value: '1', sub: 'Needs attention', iconClass: 'acad-kpi-icon-rose', icon: AlertCircle },
];

const statusIcon: Record<AssessStatus, React.ReactNode> = {
  upcoming:  <Calendar size={14} />,
  ongoing:   <Clock size={14} />,
  completed: <CheckCircle2 size={14} />,
  overdue:   <AlertCircle size={14} />,
};

/* ── Component ───────────────────────────────────────────────────────── */

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = assessmentsData.filter((a) => {
    const matchFilter = activeFilter === 'all' || a.status === activeFilter;
    const matchSearch =
      search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.class.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="academics-page-container">
      <button className="back-navigator-btn" onClick={() => navigate('/academics')}>
        <ArrowLeft size={18} />
        Back to Academics
      </button>

      {/* ── Header Banner ── */}
      <div className="academics-header-banner">
        <div className="academics-header-content">
          <h1 className="academics-title">Assessments</h1>
          <p className="academics-subtitle">
            Create and track examinations, continuous assessment tests, quizzes,
            and assignments. Monitor submission progress and publish scores for
            all students across every class arm.
          </p>

          <div className="academics-header-stats">
            <div className="acad-stat-pill">
              <ClipboardList size={16} className="acad-stat-pill-icon" />
              <div className="acad-stat-pill-labels">
                <span className="acad-pill-label">Active Term</span>
                <span className="acad-pill-value">First Term 2025/26</span>
              </div>
            </div>
            <div className="acad-stat-pill">
              <Users size={16} className="acad-stat-pill-icon" />
              <div className="acad-stat-pill-labels">
                <span className="acad-pill-label">Students Covered</span>
                <span className="acad-pill-value">376</span>
              </div>
            </div>
            <div className="acad-stat-pill">
              <BookOpen size={16} className="acad-stat-pill-icon" />
              <div className="acad-stat-pill-labels">
                <span className="acad-pill-label">Subjects</span>
                <span className="acad-pill-value">6</span>
              </div>
            </div>
          </div>
        </div>

        <button
          className="le-button le-button-primary academics-header-cta"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          New Assessment
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="academics-kpi-row">
        {kpiData.map((kpi) => (
          <div className="acad-kpi-card" key={kpi.label}>
            <div className={`acad-kpi-icon-wrap ${kpi.iconClass}`}>
              <kpi.icon size={22} />
            </div>
            <div className="acad-kpi-info">
              <span className="acad-kpi-label">{kpi.label}</span>
              <span className="acad-kpi-value">{kpi.value}</span>
              <span className="acad-kpi-sub">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters + Search ── */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="assessments-filters" style={{ marginBottom: 0 }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`assess-filter-btn ${activeFilter === f.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: 240 }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          />
          <input
            className="grading-search"
            style={{ paddingLeft: '2.25rem', width: '100%', boxSizing: 'border-box' }}
            placeholder="Search assessments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Assessment Cards Grid ── */}
      {filtered.length === 0 ? (
        <div
          className="academics-empty-state"
          style={{ background: 'white', border: '2px dashed #e2e8f0', padding: '5rem 2rem' }}
        >
          <div className="empty-state-icon">📋</div>
          <h2 className="empty-state-title">No Assessments Found</h2>
          <p className="empty-state-description">
            Try adjusting your filters or search term.
          </p>
        </div>
      ) : (
        <div className="assessments-grid">
          {filtered.map((a) => {
            const submissionPct = a.participants > 0
              ? Math.round((a.submitted / a.participants) * 100)
              : 0;

            return (
              <div
                className="assessment-card"
                key={a.id}
                onClick={() => {}}
              >
                <div className="assessment-card-header">
                  <span className="assessment-card-type">{a.type}</span>
                  <span className={`assess-status ${a.status}`}>
                    {statusIcon[a.status]}
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </div>

                <div className="assessment-card-title">{a.title}</div>

                <div className="assessment-card-meta">
                  <BookOpen size={13} />
                  {a.subject}
                  <span style={{ color: '#e2e8f0' }}>·</span>
                  {a.class}
                </div>

                <div className="assessment-card-meta">
                  <Clock size={13} />
                  Due: {a.dueDate}
                  <span style={{ color: '#e2e8f0' }}>·</span>
                  Max: {a.maxScore} marks
                </div>

                {a.avgScore !== null && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#f0fdf4',
                      color: '#16a34a',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                    }}
                  >
                    <CheckCircle2 size={12} />
                    Avg Score: {a.avgScore}/{a.maxScore}
                  </div>
                )}

                <div className="assessment-card-footer">
                  <div className="assessment-participants">
                    <Users size={14} />
                    {a.submitted}/{a.participants} submitted
                  </div>

                  <div className="assess-progress-wrap">
                    <div className="assess-progress-bar">
                      <div
                        className="assess-progress-fill"
                        style={{ width: `${submissionPct}%` }}
                      />
                    </div>
                    <span className="assess-progress-pct">{submissionPct}%</span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '0.85rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid #f1f5f9',
                    fontSize: '0.75rem',
                    color: '#cbd5e1',
                    fontWeight: 600,
                  }}
                >
                  Created by {a.createdBy}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ paddingBottom: '4rem' }} />
    </div>
  );
};

export default AssessmentsPage;
