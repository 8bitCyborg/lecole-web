import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Types ───────────────────────────────────────────────────────────── */

export interface GradeRow {
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

interface GradeListingProps {
  rows: GradeRow[];
  totalCount: number;
  classes: string[];
  subjects: string[];
  terms: string[];
  selectedClass: string;
  selectedSubject: string;
  selectedTerm: string;
  search: string;
  onClassChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onTermChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function gradeClass(g: string) {
  return `grade-badge grade-${g.toLowerCase()}`;
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up') return <TrendingUp size={14} style={{ color: '#16a34a' }} />;
  if (trend === 'down') return <TrendingDown size={14} style={{ color: '#e11d48' }} />;
  return <Minus size={14} style={{ color: '#94a3b8' }} />;
}

/* ── Component ───────────────────────────────────────────────────────── */

const GradeListing = ({
  rows,
  totalCount,
  classes,
  subjects,
  terms,
  selectedClass,
  selectedSubject,
  selectedTerm,
  search,
  onClassChange,
  onSubjectChange,
  onTermChange,
  onSearchChange,
}: GradeListingProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Filters ── */}
      <div className="grading-controls">
        <select
          className="grading-select"
          value={selectedTerm}
          onChange={(e) => onTermChange(e.target.value)}
        >
          {terms.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <select
          className="grading-select"
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
        >
          {classes.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="grading-select"
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
        >
          {subjects.map((s) => (
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ── */}
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
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No results match your filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
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

      {/* ── Footer count ── */}
      <div
        style={{
          marginTop: '1rem',
          fontSize: '0.8rem',
          color: '#94a3b8',
          textAlign: 'right',
          paddingBottom: '3rem',
        }}
      >
        Showing {rows.length} of {totalCount} records
      </div>
    </>
  );
};

export default GradeListing;
