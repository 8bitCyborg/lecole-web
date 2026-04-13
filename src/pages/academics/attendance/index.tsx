import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Users, ClipboardCheck } from 'lucide-react';
import '../Academics.css';

const Attendance = () => {
  const navigate = useNavigate();

  return (
    <div className="academics-page-container">
      <button className="back-navigator-btn" onClick={() => navigate('/academics')}>
        <ArrowLeft size={18} />
        Back to Academics
      </button>

      {/* ── Header Banner ── */}
      <div className="academics-header-banner" style={{ background: 'linear-gradient(135deg, #0f172a, #1e40af)' }}>
        <div className="academics-header-content" style={{ maxWidth: '800px' }}>
          <h1 className="academics-title">Attendance Tracking</h1>
          <p className="academics-subtitle">
            Efficiently manage and monitor student presence across all class arms. 
            Track daily check-ins, analyze attendance patterns, and ensure comprehensive safety and reporting compliance.
          </p>

          <div className="academics-header-stats">
            <div className="acad-stat-pill">
              <Calendar size={16} className="acad-stat-pill-icon" />
              <div className="acad-stat-pill-labels">
                <span className="acad-pill-label">Today</span>
                <span className="acad-pill-value">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="acad-stat-pill">
              <Users size={16} className="acad-stat-pill-icon" />
              <div className="acad-stat-pill-labels">
                <span className="acad-pill-label">Avg Rate</span>
                <span className="acad-pill-value">94.8%</span>
              </div>
            </div>
            <div className="acad-stat-pill">
              <ClipboardCheck size={16} className="acad-stat-pill-icon" />
              <div className="acad-stat-pill-labels">
                <span className="acad-pill-label">Status</span>
                <span className="acad-pill-value">Term Active</span>
              </div>
            </div>
          </div>
        </div>

        <button
          className="le-button le-button-primary academics-header-cta"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          Mark Attendance
        </button>
      </div>

      <div style={{ paddingBottom: '4rem' }} />
    </div>
  );
};

export default Attendance;