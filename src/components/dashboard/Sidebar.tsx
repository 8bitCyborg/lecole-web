import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  GraduationCap,
  ChevronDown,
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
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(['staff']);

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: University, label: 'School', path: '/school' },
    { icon: BookOpen, label: 'Subjects', path: '/subjects' },
    { icon: Presentation, label: 'Classes', path: '/classes' },
    {
      id: 'staff',
      icon: UsersRound,
      label: 'Staff',
      path: '/staff',
      children: [
        { label: 'General Listing', path: '/staff', icon: UsersRound },
        { label: 'Teaching Staff', path: '/staff/teachers', icon: GraduationCap },
      ]
    },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: UserCircle, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const renderNavItem = (item: any) => {
    const isSubmenuOpen = openSubmenus.includes(item.id || '');
    const hasChildren = item.children && item.children.length > 0;
    const isParentActive = hasChildren && (
      location.pathname === item.path ||
      item.children.some((child: any) => location.pathname === child.path)
    );

    if (hasChildren) {
      return (
        <div key={item.id} className="nav-group">
          <div
            className={`nav-item nav-parent ${isParentActive ? 'active' : ''} ${isSubmenuOpen ? 'expanded' : ''}`}
            onClick={() => !isCollapsed && toggleSubmenu(item.id)}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={20} />
            {!isCollapsed && (
              <>
                <span className="nav-label">{item.label}</span>
                <ChevronDown
                  size={14}
                  className={`submenu-arrow ${isSubmenuOpen ? 'rotated' : ''}`}
                />
              </>
            )}
          </div>

          {!isCollapsed && isSubmenuOpen && (
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
