import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout as logoutLocal } from '../../store/slices/authSlice';
import { useLogoutMutation } from '../../services/leApi/authApi';
import './style.css';

const Dashboard: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [logoutApi] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch(logoutLocal());
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo text-gradient">lecole</div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">Overview</a>
          <a href="#" className="nav-item">My Courses</a>
          <a href="#" className="nav-item">Assignments</a>
          <a href="#" className="nav-item">Messages</a>
          <a href="#" className="nav-item">Settings</a>
        </nav>
        <button onClick={handleLogout} className="nav-item logout-btn">
          <span>Logout</span>
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back, {user?.first_name}!</h1>
          <p>Here's what's happening in your learning journey.</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">12</span>
            <span className="stat-label">Courses Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">85%</span>
            <span className="stat-label">Average Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">4</span>
            <span className="stat-label">Active Enrollments</span>
          </div>
        </div>

        <section className="recent-activity">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-details">
                <p>Started <strong>Advanced React Patterns</strong></p>
                <span>2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-details">
                <p>Completed <strong>Introduction to UI Design</strong></p>
                <span>Yesterday</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
