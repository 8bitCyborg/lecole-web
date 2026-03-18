import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
  UsersRound,
  Presentation,
  University,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isOpenMobile: boolean;
  onLogout: () => void;
  logoutLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isOpenMobile,
  onLogout,
  logoutLoading
}) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: University, label: 'School', path: '/schools' },
    { icon: Presentation, label: 'Classes', path: '/classes' },
    { icon: UsersRound, label: 'Teachers', path: '/teachers' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: UserCircle, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} ${isOpenMobile ? 'open' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="sidebar-logo">
        <div style={{
          width: '32px',
          height: '32px',
          background: 'var(--primary)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          L
        </div>
        {!isCollapsed && <span>lecole</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onLogout}
          disabled={logoutLoading}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>{logoutLoading ? 'Logging out...' : 'Logout'}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

