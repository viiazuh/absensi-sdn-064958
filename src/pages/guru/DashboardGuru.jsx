import { MdCheckCircle, MdCalendarToday, MdBarChart, MdAccessTime } from 'react-icons/md';
import { mockJadwal, mockLaporan, formatTanggal, getTodayString, getInitials } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const myJadwal = mockJadwal.filter(j => j.guru_id === 'g2').slice(0, 3);
const myLaporan = mockLaporan.find(l => l.guru_nama === 'Budi Santoso') || mockLaporan[1];

export default function DashboardGuru() {
  const { user } = useAuth();
  const today = getTodayString();

  return (
    <div>
      {/* Greeting Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(79,142,247,0.15) 0%, rgba(67,232,154,0.08) 100%)',
        border: '1px solid rgba(79,142,247,0.2)',
        marginBottom: '20px',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'var(--gradient-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', fontWeight: '700', color: '#fff', flexShrink: 0
          }}>
            {getInitials(user?.nama)}
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Selamat datang kembali 👋</p>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '2px' }}>{user?.nama}</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--accent-blue)' }}>
              📅 {formatTanggal(today)}
            </p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kehadiran Bulan Ini</p>
            <p style={{
              fontSize: '2rem', fontWeight: '800',
              background: 'var(--gradient-main)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {Math.round((myLaporan.hadir / myLaporan.total) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div className="stat-card green">
          <div className="stat-card-icon"><MdCheckCircle /></div>
          <div className="stat-card-info">
            <div className="stat-card-value">{myLaporan.hadir}</div>
            <div className="stat-card-label">Hadir</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-card-icon">🤒</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{myLaporan.sakit}</div>
            <div className="stat-card-label">Sakit</div>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-icon">📄</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{myLaporan.izin}</div>
            <div className="stat-card-label">Izin</div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-icon"><MdBarChart /></div>
          <div className="stat-card-info">
            <div className="stat-card-value">{myLaporan.total}</div>
            <div className="stat-card-label">Total Hari</div>
          </div>
        </div>
      </div>

      {/* Jadwal Hari Ini */}
      <div className="card">
        <div className="section-header">
          <h3><MdCalendarToday style={{ verticalAlign: 'middle' }} /> Jadwal Mengajar Saya</h3>
          <span className="section-header-badge">{myJadwal.length} sesi</span>
        </div>
        {myJadwal.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎉</div>
            <h4>Tidak ada jadwal hari ini</h4>
            <p>Selamat beristirahat!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myJadwal.map(j => (
              <div key={j.id} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(79,142,247,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-blue)', fontSize: '1.25rem', flexShrink: 0,
                }}>
                  📚
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '2px' }}>{j.mata_pelajaran}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{j.kelas} • {j.hari}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: '700',
                    color: 'var(--accent-blue)',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <MdAccessTime /> {j.jam_mulai}–{j.jam_selesai}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
