import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import '../Academics.css';

/* ── Dummy Data ──────────────────────────────────────────────────────── */

const CLASSES = ['All Classes', 'JSS 1A', 'JSS 1B', 'JSS 1C', 'JSS 2A', 'JSS 2B', 'JSS 3A'];
const SUBJECTS = ['All Subjects', 'Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Civic Education', 'French'];
const TERMS = ['First Term 2025/26', 'Second Term 2024/25', 'Third Term 2024/25'];

interface GradeRow {
  id: string;
  student: string;
  initials: string;
  admission: string;
  class: string;
  subject: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  grade: string;
  trend: 'up' | 'down' | 'flat';
}

const gradesData: GradeRow[] = [
  { id: '1', student: 'Amara Okafor', initials: 'AO', admission: 'ADM-2023-001', class: 'JSS 1A', subject: 'Mathematics', ca1: 18, ca2: 17, exam: 55, total: 90, grade: 'A', trend: 'up' },
  { id: '2', student: 'Blessing Adeyemi', initials: 'BA', admission: 'ADM-2023-002', class: 'JSS 1A', subject: 'Mathematics', ca1: 14, ca2: 15, exam: 48, total: 77, grade: 'B', trend: 'up' },
  { id: '3', student: 'Chukwuemeka Eze', initials: 'CE', admission: 'ADM-2023-003', class: 'JSS 2B', subject: 'English Language', ca1: 12, ca2: 13, exam: 40, total: 65, grade: 'C', trend: 'flat' },
  { id: '4', student: 'Damilola Fashola', initials: 'DF', admission: 'ADM-2023-004', class: 'JSS 2B', subject: 'English Language', ca1: 10, ca2: 9, exam: 32, total: 51, grade: 'D', trend: 'down' },
  { id: '5', student: 'Emmanuel Nwosu', initials: 'EN', admission: 'ADM-2023-005', class: 'JSS 3A', subject: 'Basic Science', ca1: 19, ca2: 18, exam: 58, total: 95, grade: 'A', trend: 'up' },
  { id: '6', student: 'Fatima Abdullahi', initials: 'FA', admission: 'ADM-2023-006', class: 'JSS 3A', subject: 'Basic Science', ca1: 15, ca2: 14, exam: 47, total: 76, grade: 'B', trend: 'flat' },
  { id: '7', student: 'Grace Ekunola', initials: 'GE', admission: 'ADM-2023-007', class: 'JSS 1C', subject: 'Social Studies', ca1: 11, ca2: 10, exam: 35, total: 56, grade: 'C', trend: 'down' },
  { id: '8', student: 'Henry Okonkwo', initials: 'HO', admission: 'ADM-2023-008', class: 'JSS 1C', subject: 'Social Studies', ca1: 8, ca2: 7, exam: 22, total: 37, grade: 'F', trend: 'down' },
  { id: '9', student: 'Ifunanya Mbah', initials: 'IM', admission: 'ADM-2023-009', class: 'JSS 2A', subject: 'Civic Education', ca1: 16, ca2: 15, exam: 50, total: 81, grade: 'A', trend: 'up' },
  { id: '10', student: 'James Olawale', initials: 'JO', admission: 'ADM-2023-010', class: 'JSS 2A', subject: 'Civic Education', ca1: 13, ca2: 12, exam: 43, total: 68, grade: 'B', trend: 'flat' },
];

const summaryStats = [
  { label: 'A (75–100%)', count: 3, color: '#16a34a', bg: '#f0fdf4' },
  { label: 'B (60–74%)', count: 3, color: '#2563eb', bg: '#eff6ff' },
  { label: 'C (50–59%)', count: 2, color: '#d97706', bg: '#fffbeb' },
  { label: 'D (45–49%)', count: 1, color: '#ea580c', bg: '#fff7ed' },
  { label: 'F (0–44%)', count: 1, color: '#e11d48', bg: '#fff1f2' },
];

function gradeClass(g: string) {
  return `grade-badge grade-${g.toLowerCase()}`;
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up') return <TrendingUp size={14} style={{ color: '#16a34a' }} />;
  if (trend === 'down') return <TrendingDown size={14} style={{ color: '#e11d48' }} />;
  return <Minus size={14} style={{ color: '#94a3b8' }} />;
}

/* ── Component ───────────────────────────────────────────────────────── */

const GradingPage = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedTerm, setSelectedTerm] = useState(TERMS[0]);
  const [search, setSearch] = useState('');

  const filtered = gradesData.filter((row) => {
    const matchClass = selectedClass === 'All Classes' || row.class === selectedClass;
    const matchSubject = selectedSubject === 'All Subjects' || row.subject === selectedSubject;
    const matchSearch =
      search === '' ||
      row.student.toLowerCase().includes(search.toLowerCase()) ||
      row.admission.toLowerCase().includes(search.toLowerCase());
    return matchClass && matchSubject && matchSearch;
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
          <h1 className="academics-title">Grading</h1>
          <p className="academics-subtitle">
            Review, manage, and publish student grades across all subjects and class arms.
            Filter by class, subject, or term to get a focused view of academic performance.
          </p>

          <div className="academics-header-stats">
            {summaryStats.map((s) => (
              <div className="acad-stat-pill" key={s.label}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: s.color,
                    flexShrink: 0,
                  }}
                />
                <div className="acad-stat-pill-labels">
                  <span className="acad-pill-label">{s.label}</span>
                  <span className="acad-pill-value">{s.count} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="le-button le-button-primary academics-header-cta"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="academics-kpi-row">
        <div className="acad-kpi-card">
          <div className="acad-kpi-icon-wrap acad-kpi-icon-blue">
            <BarChart3 size={22} />
          </div>
          <div className="acad-kpi-info">
            <span className="acad-kpi-label">Class Average</span>
            <span className="acad-kpi-value">74%</span>
            <span className="acad-kpi-sub">All subjects combined</span>
          </div>
        </div>
        <div className="acad-kpi-card">
          <div className="acad-kpi-icon-wrap acad-kpi-icon-green">
            <TrendingUp size={22} />
          </div>
          <div className="acad-kpi-info">
            <span className="acad-kpi-label">Highest Score</span>
            <span className="acad-kpi-value">95%</span>
            <span className="acad-kpi-sub">Emmanuel Nwosu · JSS 3A</span>
          </div>
        </div>
        <div className="acad-kpi-card">
          <div className="acad-kpi-icon-wrap acad-kpi-icon-rose">
            <TrendingDown size={22} />
          </div>
          <div className="acad-kpi-info">
            <span className="acad-kpi-label">Lowest Score</span>
            <span className="acad-kpi-value">37%</span>
            <span className="acad-kpi-sub">Henry Okonkwo · JSS 1C</span>
          </div>
        </div>
        <div className="acad-kpi-card">
          <div className="acad-kpi-icon-wrap acad-kpi-icon-amber">
            <BarChart3 size={22} />
          </div>
          <div className="acad-kpi-info">
            <span className="acad-kpi-label">Pass Rate</span>
            <span className="acad-kpi-value">90%</span>
            <span className="acad-kpi-sub">9 of 10 above 45%</span>
          </div>
        </div>
      </div>

      <div className="grading-controls">
        <select
          className="grading-select"
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
        >
          {TERMS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <select
          className="grading-select"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {CLASSES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="grading-select"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
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
            placeholder="Search student or admission no…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grading-table-container">
        <table className="grading-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Admission No.</th>
              <th>Class</th>
              <th>Subject</th>
              <th style={{ textAlign: 'center' }}>CA 1</th>
              <th style={{ textAlign: 'center' }}>CA 2</th>
              <th style={{ textAlign: 'center' }}>Exam</th>
              <th style={{ textAlign: 'center' }}>Total</th>
              <th style={{ textAlign: 'center' }}>Grade</th>
              <th style={{ textAlign: 'center' }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No results match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} onClick={() => navigate(`/students/${row.id}`)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {row.initials}
                      </div>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{row.student}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        background: '#f1f5f9',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.4rem',
                        color: '#475569',
                      }}
                    >
                      {row.admission}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontWeight: 600 }}>{row.class}</td>
                  <td>{row.subject}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{row.ca1}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{row.ca2}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{row.exam}</td>
                  <td style={{ textAlign: 'center' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{row.total}</strong>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>/100</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={gradeClass(row.grade)}>{row.grade}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <TrendIcon trend={row.trend} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '1rem',
          fontSize: '0.8rem',
          color: '#94a3b8',
          textAlign: 'right',
          paddingBottom: '3rem',
        }}
      >
        Showing {filtered.length} of {gradesData.length} records
      </div>
    </div>
  );
};

export default GradingPage;
