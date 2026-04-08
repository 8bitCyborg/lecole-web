import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ClipboardList,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  BookOpen,
  Award,
  Target,
} from 'lucide-react';
import './Academics.css';

/* ── Dummy Data ──────────────────────────────────────────────────────── */

const kpiData = [
  {
    label: 'Avg. Class Score',
    value: '74%',
    sub: '+3.2% this term',
    iconClass: 'acad-kpi-icon-blue',
    icon: TrendingUp,
  },
  {
    label: 'Assessments Due',
    value: '12',
    sub: '4 overdue',
    iconClass: 'acad-kpi-icon-amber',
    icon: ClipboardList,
  },
  {
    label: 'Students Graded',
    value: '384',
    sub: 'of 412 enrolled',
    iconClass: 'acad-kpi-icon-green',
    icon: CheckCircle2,
  },
  {
    label: 'Pending Reviews',
    value: '28',
    sub: 'Requires action',
    iconClass: 'acad-kpi-icon-rose',
    icon: AlertCircle,
  },
];

const recentGrades = [
  { subject: 'Mathematics', class: 'JSS 1A', avg: 81, grade: 'A' },
  { subject: 'English Language', class: 'JSS 2B', avg: 68, grade: 'B' },
  { subject: 'Basic Science', class: 'JSS 3A', avg: 74, grade: 'B' },
  { subject: 'Social Studies', class: 'JSS 1C', avg: 55, grade: 'C' },
  { subject: 'Civic Education', class: 'JSS 2A', avg: 42, grade: 'D' },
];

const recentAssessments = [
  {
    title: 'Mid-Term Mathematics Exam',
    class: 'JSS 1 — All Arms',
    date: 'Apr 12, 2026',
    status: 'upcoming',
    participants: 124,
    progress: 0,
  },
  {
    title: 'English Language CAT',
    class: 'JSS 2B',
    date: 'Apr 08, 2026',
    status: 'ongoing',
    participants: 42,
    progress: 60,
  },
  {
    title: 'Basic Science Quiz',
    class: 'JSS 3A',
    date: 'Apr 05, 2026',
    status: 'completed',
    participants: 38,
    progress: 100,
  },
  {
    title: 'Social Studies Essay',
    class: 'JSS 1C',
    date: 'Apr 01, 2026',
    status: 'overdue',
    participants: 40,
    progress: 45,
  },
];

const perfBars = [
  { label: 'Maths', pct: 81, colorClass: 'blue' },
  { label: 'English', pct: 68, colorClass: 'green' },
  { label: 'Science', pct: 74, colorClass: 'amber' },
  { label: 'Social', pct: 55, colorClass: 'rose' },
  { label: 'Civic', pct: 62, colorClass: 'blue' },
  { label: 'French', pct: 77, colorClass: 'green' },
];

const recentActivity = [
  {
    icon: Award,
    bg: '#eff6ff',
    color: '#2563eb',
    main: 'Math scores published for JSS 1A',
    sub: 'Avg score: 81% · 38 students',
    time: '2h ago',
  },
  {
    icon: ClipboardList,
    bg: '#f0fdf4',
    color: '#16a34a',
    main: 'English CAT assessment started',
    sub: 'JSS 2B · 42 participants',
    time: '5h ago',
  },
  {
    icon: AlertCircle,
    bg: '#fff1f2',
    color: '#e11d48',
    main: 'Social Studies Essay overdue',
    sub: 'JSS 1C · 45% submitted',
    time: '1d ago',
  },
  {
    icon: Target,
    bg: '#fffbeb',
    color: '#d97706',
    main: 'Mid-Term exam schedule released',
    sub: 'JSS 1 All Arms · 124 students',
    time: '2d ago',
  },
];

/* ── Grade helpers ───────────────────────────────────────────────────── */

function gradeClass(g: string) {
  return `grade-badge grade-${g.toLowerCase()}`;
}

function barColor(pct: number) {
  if (pct >= 75) return 'high';
  if (pct >= 60) return 'mid';
  if (pct >= 45) return 'low';
  return 'fail';
}

/* ── Component ───────────────────────────────────────────────────────── */

const AcademicsDashboard = () => {
  return (
    <div className="academics-page-container">
      {/* ── Header Banner ── */}
      <div className="academics-header-banner">
        <div className="academics-header-content">
          <h1 className="academics-title">Academics Overview</h1>
          <p className="academics-subtitle">
            Monitor academic performance, manage assessments, and track grading
            progress across all classes and arms in one place.
          </p>

          <div className="academics-header-stats">
            <div className="acad-stat-pill">
              <GraduationCap size={16} className="acad-stat-pill-icon" />
              <div className="acad-stat-pill-labels">
                <span className="acad-pill-label">Academic Term</span>
                <span className="acad-pill-value">First Term 2025/26</span>
              </div>
            </div>
            <div className="acad-stat-pill">
              <Users size={16} className="acad-stat-pill-icon" />
              <div className="acad-stat-pill-labels">
                <span className="acad-pill-label">Total Students</span>
                <span className="acad-pill-value">412</span>
              </div>
            </div>
            <div className="acad-stat-pill">
              <BookOpen size={16} className="acad-stat-pill-icon" />
              <div className="acad-stat-pill-labels">
                <span className="acad-pill-label">Subjects Tracked</span>
                <span className="acad-pill-value">14</span>
              </div>
            </div>
          </div>
        </div>
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

      {/* ── Performance Bar Chart ── */}
      <div className="perf-chart-card">
        <div className="perf-chart-header">
          <span className="perf-chart-title">Subject Performance Overview</span>
          <div className="perf-legend">
            <div className="perf-legend-item">
              <div className="perf-legend-dot" style={{ background: '#3b82f6' }} />
              Average Score (%)
            </div>
            <div className="perf-legend-item">
              <div className="perf-legend-dot" style={{ background: '#e2e8f0' }} />
              Full Mark
            </div>
          </div>
        </div>
        <div className="perf-bars">
          {perfBars.map((b) => (
            <div className="perf-bar-col" key={b.label} style={{ height: '100%' }}>
              <div className="perf-bar-outer">
                <div
                  className={`perf-bar-inner ${b.colorClass}`}
                  style={{ height: `${b.pct}%` }}
                />
              </div>
              <span className="perf-bar-label">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Grading & Assessments summaries ── */}
      <div className="academics-grid-2">
        {/* Grading summary */}
        <div className="acad-summary-card">
          <div className="acad-summary-card-header">
            <span className="acad-summary-card-title">
              <BarChart3 size={16} />
              Recent Grades
            </span>
            <Link to="/academics/grading" className="acad-summary-card-link">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="acad-summary-card-body">
            <table className="acad-mini-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {recentGrades.map((g) => (
                  <tr key={g.subject + g.class}>
                    <td>{g.subject}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{g.class}</td>
                    <td>
                      <div className="score-bar-wrap">
                        <div className="score-bar-bg">
                          <div
                            className={`score-bar-fill ${barColor(g.avg)}`}
                            style={{ width: `${g.avg}%` }}
                          />
                        </div>
                        <span className="score-bar-text">{g.avg}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={gradeClass(g.grade)}>{g.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assessments summary */}
        <div className="acad-summary-card">
          <div className="acad-summary-card-header">
            <span className="acad-summary-card-title">
              <ClipboardList size={16} />
              Recent Assessments
            </span>
            <Link to="/academics/assessments" className="acad-summary-card-link">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="acad-summary-card-body">
            <table className="acad-mini-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAssessments.map((a) => (
                  <tr key={a.title}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.83rem' }}>{a.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{a.class}</div>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      {a.date}
                    </td>
                    <td>
                      <span className={`assess-status ${a.status}`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <p className="academics-section-title">Recent Activity</p>
      <div className="acad-activity-list">
        {recentActivity.map((act) => (
          <div className="acad-activity-item" key={act.main}>
            <div
              className="acad-activity-icon"
              style={{ background: act.bg, color: act.color }}
            >
              <act.icon size={18} />
            </div>
            <div className="acad-activity-text">
              <div className="acad-activity-main">{act.main}</div>
              <div className="acad-activity-sub">{act.sub}</div>
            </div>
            <span className="acad-activity-time">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicsDashboard;
