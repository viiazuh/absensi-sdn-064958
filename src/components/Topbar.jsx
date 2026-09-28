import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatTanggal, getTodayString } from '../data/mockData';
import { MdMenu } from 'react-icons/md';

const titleMap = {
  '/admin/dashboard': { title: 'Dashboard', desc: 'Ringkasan data kehadiran hari ini' },
  '/admin/data-guru': { title: 'Data Guru', desc: 'Kelola data guru SDN 064958 Medan' },
  '/admin/data-user': { title: 'Data User', desc: 'Kelola akun pengguna sistem' },
  '/admin/jadwal': { title: 'Jadwal Guru', desc: 'Manajemen jadwal mengajar' },
  '/admin/kehadiran': { title: 'Data Kehadiran', desc: 'Rekap kehadiran semua guru' },
  '/admin/laporan': { title: 'Laporan Kehadiran', desc: 'Laporan bulanan kehadiran guru' },
  '/guru/dashboard': { title: 'Dashboard', desc: 'Selamat datang di sistem absensi' },
  '/guru/absensi': { title: 'Absensi Masuk', desc: 'Lakukan absensi kehadiran hari ini' },
  '/guru/jadwal': { title: 'Jadwal Saya', desc: 'Jadwal mengajar saya' },
  '/guru/laporan': { title: 'Laporan Kehadiran', desc: 'Rekap kehadiran saya' },
};

export default function Topbar({ onToggle }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const info = titleMap[pathname] || { title: 'Halaman', desc: '' };

  return (
    <header className="topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Tombol Hamburger khusus mobile/tablet di dalam topbar */}
        <button
          onClick={onToggle}
          aria-label="Toggle Menu"
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'inherit',
            padding: '4px',
          }}
          className="mobile-hamburger-btn"
        >
          <MdMenu />
        </button>

        <div>
          <h3>{info.title}</h3>
          <p>{info.desc}</p>
        </div>
      </div>

      <div className="topbar-right">
        <span className="topbar-date">
          {formatTanggal(getTodayString())}
        </span>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .mobile-hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}