import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store/hooks';
import { Outlet } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from './Sidebar';
import { Menu, Search, Bell } from 'lucide-react';
import { useLogoutMutation } from '../../services/leApi/authApi';
import { logout } from '../../store/slices/authSlice';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logoutApi, { isLoading: logoutLoading }] = useLogoutMutation();

  const initials = `${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`.toUpperCase() || '??';

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
    } catch (error: any) {
      console.error('Logout failed:', error);
      dispatch(logout());
    }
  };

  const error = null;

  return (
    <div className="dashboard-layout">

      {/* Overlay for mobile sidebar */}
      {isOpenMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 45,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpenMobile={isOpenMobile}
        onLogout={handleLogout}
        logoutLoading={logoutLoading}
      />

      <main className="dashboard-main">
        <header className="content-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsOpenMobile(true)}
            >
              <Menu size={24} />
            </button>

            <div className="header-search-container">
              <Search
                size={18}
                style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search..."
                className="le-input"
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  background: 'white'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {error && <span style={{ color: 'var(--error, #ef4444)', fontSize: '0.875rem' }}>{error}</span>}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Bell size={20} />
            </button>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              {initials}
            </div>
          </div>
        </header>

        <div style={{ padding: '1rem', flex: 1, minHeight: 0 }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-main);
          padding: 0.5rem;
        }

        .header-search-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 300px;
        }

        .header-search-container input {
          width: 100%;
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle { 
            display: flex; 
            align-items: center;
            justify-content: center;
          }
          .header-search-container {
            width: 100%;
          }
          .content-header {
            padding: 0 1rem;
          }
        }
      `}</style>

    </div>
  );
};

export default DashboardLayout;

