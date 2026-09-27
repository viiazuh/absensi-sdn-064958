import { useState, useEffect } from 'react';
import { MdPeople, MdCheckCircle, MdSick, MdEventBusy, MdCalendarToday } from 'react-icons/md';
import { getInitials } from '../../data/mockData';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const statusBadge = (status) => {
  const map = { Hadir: 'hadir', Sakit: 'sakit', Izin: 'izin', Alpha: 'alpha' };
  return <span className={`badge ${map[status] || ''}`}>● {status}</span>;
};

export default function DashboardAdmin() {
  const [totalGuru, setTotalGuru] = useState(0);
  const [todayKehadiran, setTodayKehadiran] = useState([]);
  const [todayJadwal, setTodayJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mendapatkan tanggal hari ini format YYYY-MM-DD
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayDateString();

  // Mengambil data dari Firestore saat halaman dimuat
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Hitung Total Guru (user dengan role 'guru')
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const allUsers = usersSnapshot.docs.map(doc => doc.data());
        const guruList = allUsers.filter(u => u.role === 'guru');
        setTotalGuru(guruList.length);

        // 2. Ambil Data Kehadiran hari ini dari Firestore
        // (Pastikan Anda punya koleksi 'kehadiran' dengan field 'tanggal' berformat YYYY-MM-DD)
        const kehadiranRef = collection(db, 'kehadiran');
        const qKehadiran = query(kehadiranRef, where('tanggal', '==', todayStr));
        const kehadiranSnapshot = await getDocs(qKehadiran);
        const kehadiranData = kehadiranSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTodayKehadiran(kehadiranData);

        // 3. Ambil Data Jadwal Mengajar dari Firestore
        const jadwalRef = collection(db, 'jadwal');
        const jadwalSnapshot = await getDocs(jadwalRef);
        const jadwalData = jadwalSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTodayJadwal(jadwalData.slice(0, 4)); // Ambil beberapa data untuk preview

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [todayStr]);

  // Kalkulasi statistik dari data riil Firestore
  const hadirCount = todayKehadiran.filter(k => k.status === 'Hadir').length;
  const sakitCount = todayKehadiran.filter(k => k.status === 'Sakit').length;
  const izinCount = todayKehadiran.filter(k => k.status === 'Izin').length;

  // Persentase kehadiran (dibandingkan total guru terdaftar)
  const pct = totalGuru > 0 ? Math.round((hadirCount / totalGuru) * 100) : 0;

  const stats = [
    { label: 'Total Guru', value: totalGuru, icon: <MdPeople />, color: 'blue' },
    { label: 'Hadir Hari Ini', value: hadirCount, icon: <MdCheckCircle />, color: 'green' },
    { label: 'Sakit', value: sakitCount, icon: <MdSick />, color: 'orange' },
    { label: 'Izin', value: izinCount, icon: <MdEventBusy />, color: 'purple' },
  ];

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Memuat data dashboard...</div>;
  }

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
            <h4 style={{ marginBottom: '2px' }}>📈 Persentase Kehadiran Hari Ini</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {todayStr}
            </p>
          </div>
          <span className="persentase-kehadiran" style={{
            fontSize: '1.5rem', fontWeight: '800',
            background: 'var(--gradient-main)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          {hadirCount} dari {totalGuru} guru hadir
        </p>
      </div>

      {/* Grid Tabel */}
      <div className="dashboard-grid">
        {/* Absensi Hari Ini */}
        <div className="card">
          <div className="section-header">
            <h3>Absensi Hari Ini</h3>
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
                {todayKehadiran.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                      Belum ada data absensi hari ini.
                    </td>
                  </tr>
                ) : (
                  todayKehadiran.map(k => (
                    <tr key={k.id}>
                      <td>
                        <div className="guru-cell">
                          <div className="guru-avatar-sm">{getInitials(k.guru_nama || 'Guru')}</div>
                          <div className="guru-cell-info">
                            <h5>{k.guru_nama}</h5>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--accent-green)' }}>{k.jam_masuk || '—'}</td>
                      <td>{statusBadge(k.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jadwal Mengajar Hari Ini */}
        <div className="card">
          <div className="section-header">
            <h3>Jadwal Mengajar</h3>
            <span className="section-header-badge">Aktif</span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Guru</th>
                  <th>Pelajaran</th>
                  <th>Jam Mengajar</th>
                </tr>
              </thead>
              <tbody>
                {todayJadwal.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                      Belum ada data jadwal di database.
                    </td>
                  </tr>
                ) : (
                  todayJadwal.map((j, i) => (
                    <tr key={j.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td>
                        <div className="guru-cell">
                          <div className="guru-avatar-sm">{getInitials(j.guru_nama || 'Guru')}</div>
                          <span style={{ fontSize: '0.82rem' }}>{j.guru_nama}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>{j.mata_pelajaran}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--accent-blue)' }}>
                        {j.jam_mulai}–{j.jam_selesai}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}