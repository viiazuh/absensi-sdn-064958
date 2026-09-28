import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  MdDashboard, MdPeople, MdManageAccounts, MdTableChart,
  MdCalendarMonth, MdAssessment, MdLogout, MdCheckCircle,
  MdSchedule, MdBarChart, MdMenu, MdClose
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../data/mockData';
import LogoSekolah from '../assets/LogoSekolah.jpeg';

const adminMenus = [
  { label: 'Dashboard', icon: <MdDashboard />, to: '/admin/dashboard' },
  { label: 'Data Guru', icon: <MdPeople />, to: '/admin/data-guru' },
  { label: 'Data User', icon: <MdManageAccounts />, to: '/admin/data-user' },
  { label: 'Jadwal Guru', icon: <MdSchedule />, to: '/admin/jadwal' },
  { label: 'Data Kehadiran', icon: <MdTableChart />, to: '/admin/kehadiran' },
  { label: 'Laporan', icon: <MdAssessment />, to: '/admin/laporan' },
];

const guruMenus = [
  { label: 'Dashboard', icon: <MdDashboard />, to: '/guru/dashboard' },
  { label: 'Absensi', icon: <MdCheckCircle />, to: '/guru/absensi' },
  { label: 'Jadwal Saya', icon: <MdCalendarMonth />, to: '/guru/jadwal' },
  { label: 'Laporan Saya', icon: <MdBarChart />, to: '/guru/laporan' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userRole = user?.role || 'admin';
  const menus = userRole === 'admin' ? adminMenus : guruMenus;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (setIsOpen) setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  return (
    <>
      {/* Backdrop overlay saat sidebar terbuka di mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
          }}
        />
      )}

      {/* Komponen Sidebar Utama */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: isCollapsed ? '80px' : '260px',
          background: '#0f172a',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1050,
          transition: 'transform 0.3s ease-in-out, width 0.3s ease',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: isOpen ? '5px 0 15px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        {/* Tombol Collapse Desktop di dalam Sidebar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }} className="desktop-collapse-wrapper">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title="Tutup/Buka Sidebar"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              padding: '4px',
            }}
          >
            <MdMenu />
          </button>
        </div>

        {/* Logo */}
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={LogoSekolah} alt='LogoSekolah' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ fontSize: '0.9rem', margin: 0, fontWeight: 700, whiteSpace: 'nowrap' }}>SDN 064958 MEDAN</h4>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Sistem Absensi Digital</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {!isCollapsed && (
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, padding: '0 12px 8px', letterSpacing: '0.5px' }}>
              {userRole === 'admin' ? 'Menu Admin' : 'Menu Guru'}
            </span>
          )}

          {menus.map((menu) => (
            <NavLink
              key={menu.to}
              to={menu.to}
              title={isCollapsed ? menu.label : ''}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? '#2563eb' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.9rem',
                transition: 'background 0.2s, color 0.2s',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
              })}
            >
              <span style={{ fontSize: '1.2rem', display: 'flex' }}>{menu.icon}</span>
              {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{menu.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>
              {user?.foto ? <img src={user.foto} alt={user.nama} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : getInitials(user?.nama || 'Admin')}
            </div>
            {!isCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <h5 style={{ fontSize: '0.85rem', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.nama || 'User'}</h5>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'capitalize' }}>{userRole}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: '9px 12px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            <span style={{ fontSize: '1.1rem', display: 'flex' }}><MdLogout /></span>
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      <style>{`
        @media (min-width: 769px) {
          aside {
            transform: translateX(0) !important;
          }
          .main-content {
            margin-left: ${isCollapsed ? '80px' : '260px'} !important;
            width: calc(100% - ${isCollapsed ? '80px' : '260px'}) !important;
            transition: margin-left 0.3s ease, width 0.3s ease;
          }
        }
        @media (max-width: 768px) {
          .desktop-collapse-wrapper {
            display: none !important;
          }
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}