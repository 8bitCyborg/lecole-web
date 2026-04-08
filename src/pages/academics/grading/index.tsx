import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  Settings
} from 'lucide-react';
import GradeListing from './components/gradelisting';
import GradeModuleForm from './components/GradingModule/gradeModuleForm';
import '../Academics.css';

/* ── Dummy Data ──────────────────────────────────────────────────────── */

const CLASSES = ['All Classes', 'JSS 1A', 'JSS 1B', 'JSS 1C', 'JSS 2A', 'JSS 2B', 'JSS 3A'];
const SUBJECTS = ['All Subjects', 'Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Civic Education', 'French'];
const TERMS = ['First Term 2025/26', 'Second Term 2024/25', 'Third Term 2024/25'];

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



/* ── Component ───────────────────────────────────────────────────────── */

const GradingPage = () => {
  const navigate = useNavigate();
  const [showGradeForm, setShowGradeForm] = useState(false);

  return (
    <div className="academics-page-container">
      <button className="back-navigator-btn" onClick={() => navigate('/academics')}>
        <ArrowLeft size={18} />
        Back to Academics
      </button>

      {/* ── Sliding Header Wrapper ── */}
      <div className="grading-header-wrapper">
        <div className={`grading-header-slider ${showGradeForm ? 'is-editing' : ''}`}>
          {/* Slide 1: Main Banner */}
          <div className="grading-header-slide">
            <div className="academics-header-banner">
              <button
                className="settings-trigger-btn"
                title="Grading Configuration"
                onClick={() => setShowGradeForm(true)}
              >
                <Settings size={20} />
              </button>

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
          </div>

          {/* Slide 2: Grading Form */}
          <div className="grading-header-slide">
            <GradeModuleForm onClose={() => setShowGradeForm(false)} />
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      {/* <div className="academics-kpi-row">
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
      </div> */}

      <GradeListing
        gradesData={gradesData}
        terms={TERMS}
        classes={CLASSES}
        subjects={SUBJECTS}
      />
    </div>
  );
};

export default GradingPage;
