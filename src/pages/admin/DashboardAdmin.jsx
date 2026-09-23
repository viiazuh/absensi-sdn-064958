import { MdPeople, MdCheckCircle, MdSick, MdEventBusy, MdCalendarToday } from 'react-icons/md';
import { mockKehadiran, mockJadwal, formatTanggalShort, getTodayString } from '../../data/mockData';
import { getInitials } from '../../data/mockData';

const today = getTodayString();
const todayKehadiran = mockKehadiran.filter(k => k.tanggal === '2024-09-23');
const todayJadwal = mockJadwal.slice(0, 4);

const stats = [
  { label: 'Total Guru', value: 5, icon: <MdPeople />, color: 'blue' },
  { label: 'Hadir Hari Ini', value: todayKehadiran.filter(k => k.status === 'Hadir').length, icon: <MdCheckCircle />, color: 'green' },
  { label: 'Sakit', value: todayKehadiran.filter(k => k.status === 'Sakit').length, icon: <MdSick />, color: 'orange' },
  { label: 'Izin', value: todayKehadiran.filter(k => k.status === 'Izin').length, icon: <MdEventBusy />, color: 'purple' },
];

const statusBadge = (status) => {
  const map = { Hadir: 'hadir', Sakit: 'sakit', Izin: 'izin', Alpha: 'alpha' };
  return <span className={`badge ${map[status] || ''}`}>● {status}</span>;
};

export default function DashboardAdmin() {
  const hadir = todayKehadiran.filter(k => k.status === 'Hadir').length;
  const pct = Math.round((hadir / 5) * 100);

  return (
    <div>
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div>
              <div className="stat-card-icon">{s.icon}</div>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Kehadiran */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h4 style={{ marginBottom: '2px' }}>📊 Persentase Kehadiran Hari Ini</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {formatTanggalShort('2024-09-23')}
            </p>
          </div>
          <span style={{
            fontSize: '1.5rem', fontWeight: '800',
            background: 'var(--gradient-main)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          {hadir} dari 5 guru hadir
        </p>
      </div>

      {/* Grid Tabel */}
      <div className="dashboard-grid">
        {/* Absensi Hari Ini */}
        <div className="card">
          <div className="section-header">
            <h3>📋 Absensi Hari Ini</h3>
            <span className="section-header-badge">{todayKehadiran.length} data</span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Guru</th>
                  <th>Jam Masuk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayKehadiran.map(k => (
                  <tr key={k.id}>
                    <td>
                      <div className="guru-cell">
                        <div className="guru-avatar-sm">{getInitials(k.guru_nama)}</div>
                        <div className="guru-cell-info">
                          <h5>{k.guru_nama}</h5>
                        </div>
                      </div>
                    </td>
                    <td>{k.jam_masuk || '—'}</td>
                    <td>{statusBadge(k.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jadwal Hari Ini */}
        <div className="card">
          <div className="section-header">
            <h3>📅 Jadwal Mengajar Hari Ini</h3>
            <span className="section-header-badge">Senin</span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Guru</th>
                  <th>Pelajaran</th>
                  <th>Jam</th>
                </tr>
              </thead>
              <tbody>
                {todayJadwal.map((j, i) => (
                  <tr key={j.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td>
                      <div className="guru-cell">
                        <div className="guru-avatar-sm">{getInitials(j.guru_nama)}</div>
                        <span style={{ fontSize: '0.82rem' }}>{j.guru_nama}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{j.mata_pelajaran}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--accent-blue)' }}>
                      {j.jam_mulai}–{j.jam_selesai}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
