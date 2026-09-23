import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdPeople, MdManageAccounts, MdTableChart,
  MdCalendarMonth, MdAssessment, MdLogout, MdCheckCircle,
  MdSchedule, MdBarChart,
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../data/mockData';

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

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menus = user?.role === 'admin' ? adminMenus : guruMenus;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          <div className="sidebar-logo-icon">🏫</div>
          <div className="sidebar-logo-text">
            <h4>SDN 064956 MEDAN</h4>
            <span>Sistem Absensi Digital</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">
          {user?.role === 'admin' ? 'Menu Admin' : 'Menu Guru'}
        </span>

        {menus.map((menu) => (
          <NavLink
            key={menu.to}
            to={menu.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {menu.icon}
            <span>{menu.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.foto ? (
              <img src={user.foto} alt={user.nama} />
            ) : (
              getInitials(user?.nama)
            )}
          </div>
          <div className="sidebar-user-info">
            <h5>{user?.nama || 'User'}</h5>
            <span>{user?.role === 'admin' ? '⚡ Admin' : '👨‍🏫 Guru'}</span>
          </div>
        </div>
        <button className="sidebar-link btn-danger" onClick={handleLogout} style={{ width: '100%' }}>
          <MdLogout />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
