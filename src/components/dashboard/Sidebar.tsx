import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useFindMySchoolQuery } from '@/services/leApi/schoolApi';
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
  BookOpen,
  ChevronDown,
  GraduationCap,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  Lock,
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
  const { data: school } = useFindMySchoolQuery();
  const isSchoolSetup = !!school;

  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(['staff', 'academics']);
  const [showTooltipId, setShowTooltipId] = useState<string | null>(null);

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: University, label: 'School', path: '/school' },
    { icon: BookOpen, label: 'Subjects', path: '/subjects', requiresSchool: true },
    { icon: Presentation, label: 'Classes', path: '/classes', requiresSchool: true },
    { icon: UsersRound, label: 'Staff', path: '/staff', requiresSchool: true },
    { icon: Users, label: 'Students', path: '/students', requiresSchool: true },
    {
      icon: GraduationCap,
      label: 'Academics',
      path: '/academics',
      id: 'academics',
      requiresSchool: true,
      children: [
        { icon: LayoutDashboard, label: 'Overview', path: '/academics' },
        { icon: CalendarCheck, label: 'Attendance', path: '/academics/attendance' },
        { icon: ClipboardList, label: 'Assessments', path: '/academics/assessments' },
        { icon: BarChart3, label: 'Grading', path: '/academics/grading' },
      ],
    },
    { icon: UserCircle, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const renderNavItem = (item: any) => {
    const isSubmenuOpen = openSubmenus.includes(item.id || '');
    const hasChildren = item.children && item.children.length > 0;
    const isDisabled = item.requiresSchool && !isSchoolSetup;
    const itemId = item.id || item.path;
    const showTip = showTooltipId === itemId && !isCollapsed;

    const isParentActive = hasChildren && (
      location.pathname === item.path ||
      item.children.some((child: any) => location.pathname === child.path)
    );

    const tooltipText = isDisabled
      ? `Setup your school first to access ${item.label}`
      : (isCollapsed ? item.label : '');

    const renderTooltipContent = () => showTip && (
      <div className="nav-disabled-tip">
        <span>Setup your school to unlock</span>
      </div>
    );

    const renderLockBadge = () => isCollapsed && isDisabled && (
      <div style={{
        position: 'absolute',
        top: '4px',
        right: '4px',
        background: '#1e293b',
        borderRadius: '50%',
        padding: '2px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Lock size={8} />
      </div>
    );

    if (hasChildren) {
      return (
        <div key={item.id} className="nav-group">
          <div
            className={`nav-item nav-parent ${isParentActive ? 'active' : ''} ${isSubmenuOpen ? 'expanded' : ''} ${isDisabled ? 'nav-item-disabled' : ''}`}
            onClick={() => {
              if (isDisabled) {
                setShowTooltipId(showTooltipId === itemId ? null : itemId);
                return;
              }
              if (!isCollapsed) toggleSubmenu(item.id);
            }}
            title={tooltipText}
            style={{ position: 'relative' }}
          >
            <item.icon size={20} />
            {!isCollapsed && (
              <>
                <span className="nav-label">{item.label}</span>
                {isDisabled ? (
                  <Lock size={12} style={{ marginLeft: 'auto', opacity: 0.6 }} />
                ) : (
                  <ChevronDown
                    size={14}
                    className={`submenu-arrow ${isSubmenuOpen ? 'rotated' : ''}`}
                  />
                )}
              </>
            )}
            {renderLockBadge()}
          </div>

          {renderTooltipContent()}

          {!isCollapsed && isSubmenuOpen && !isDisabled && (
            <div className="nav-submenu">
              {item.children.map((child: any) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  end={child.path === item.path}
                  className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                >
                  {child.icon ? <child.icon size={16} /> : <div className="subitem-dot" />}
                  <span>{child.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (isDisabled) {
      return (
        <div key={item.path} className="nav-group">
          <div
            className="nav-item nav-item-disabled"
            onClick={() => setShowTooltipId(showTooltipId === itemId ? null : itemId)}
            style={{ position: 'relative' }}
          >
            <item.icon size={20} />
            {!isCollapsed && (
              <>
                <span>{item.label}</span>
                <Lock size={12} style={{ marginLeft: 'auto', opacity: 0.6 }} />
              </>
            )}
            {renderLockBadge()}
          </div>
          {renderTooltipContent()}
        </div>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        title={isCollapsed ? item.label : ''}
      >
        <item.icon size={20} />
        {!isCollapsed && <span>{item.label}</span>}
      </NavLink>
    );
  };

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
        {navItems.map(renderNavItem)}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--sidebar-border)' }}>
        <button
          onClick={onLogout}
          disabled={logoutLoading}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
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
