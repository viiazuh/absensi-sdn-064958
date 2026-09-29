import { useState, useEffect } from 'react';
import { MdCheckCircle, MdBarChart, MdAccessTime } from 'react-icons/md';
import { formatTanggal, getTodayString, getInitials } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function DashboardGuru() {
  const { user } = useAuth();
  const today = getTodayString();

  const [jadwalList, setJadwalList] = useState([]);
  const [statistikHadir, setStatistikHadir] = useState({ hadir: 0, sakit: 0, izin: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const guruId = user?.uid || user?.id;
  const guruNama = user?.nama;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!guruId && !guruNama) return;

      try {
        setLoading(true);

        // 1. Ambil data jadwal mengajar guru dari koleksi 'jadwal'
        const jadwalQuery = query(collection(db, 'jadwal'), where('guru_id', '==', guruId));
        const jadwalSnapshot = await getDocs(jadwalQuery);
        const dataJadwal = jadwalSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJadwalList(dataJadwal.slice(0, 3)); // Ambil maksimal 3 sesi

        // 2. Ambil data rekapitulasi kehadiran dari koleksi 'kehadiran'
        const kehadiranQuery = query(collection(db, 'kehadiran'), where('guru_id', '==', guruId));
        const kehadiranSnapshot = await getDocs(kehadiranQuery);

        let hadir = 0;
        let sakit = 0;
        let izin = 0;
        let alpha = 0;

        kehadiranSnapshot.forEach(doc => {
          const item = doc.data();
          const status = (item.status || '').toLowerCase();
          if (status === 'hadir') hadir++;
          else if (status === 'sakit') sakit++;
          else if (status === 'izin') izin++;
          else if (status === 'alpha' || status === 'alfa') alpha++;
        });

        const total = hadir + sakit + izin + alpha;
        setStatistikHadir({ hadir, sakit, izin, total: total === 0 ? 1 : total }); // Hindari division by zero

      } catch (error) {
        console.error("Gagal memuat data dashboard guru:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [guruId, guruNama]);

  const persentaseHadir = Math.round((statistikHadir.hadir / statistikHadir.total) * 100);

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
            background: '#4F8EF7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', fontWeight: '700', color: '#fff', flexShrink: 0
          }}>
            {getInitials(user?.nama)}
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Selamat datang kembali 👋</p>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '2px' }}>{user?.nama || 'Guru'}</h2>
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
              {loading ? '...' : `${persentaseHadir}%`}
            </p>
          </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div className='stats-grid'>
        <div className="stat-card green">
          <div className="stat-card-icon"><MdCheckCircle /></div>
          <div className="stat-card-info">
            <div className="stat-card-value">{loading ? '...' : statistikHadir.hadir}</div>
            <div className="stat-card-label">Hadir</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-card-icon">🤒</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{loading ? '...' : statistikHadir.sakit}</div>
            <div className="stat-card-label">Sakit</div>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-icon">📄</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{loading ? '...' : statistikHadir.izin}</div>
            <div className="stat-card-label">Izin</div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-icon"><MdBarChart /></div>
          <div className="stat-card-info">
            <div className="stat-card-value">{loading ? '...' : statistikHadir.total}</div>
            <div className="stat-card-label">Total Hari</div>
          </div>
        </div>
      </div>

      {/* Jadwal Hari Ini */}
      <div className="card">
        <div className="section-header">
          <h3>Jadwal Mengajar Saya</h3>
          <span className="section-header-badge">{jadwalList.length} sesi</span>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
            Memuat jadwal mengajar...
          </div>
        ) : jadwalList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎉</div>
            <h4>Tidak ada jadwal mengajar</h4>
            <p>Selamat beristirahat!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {jadwalList.map(j => (
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