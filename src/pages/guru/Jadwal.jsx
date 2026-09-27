import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

// Warna default jika key hari tidak ditemukan
const HARI_COLORS = {
  'Senin': { bg: 'rgba(79,142,247,0.15)', color: '#4F8EF7' },
  'Selasa': { bg: 'rgba(67,232,154,0.15)', color: '#43E89A' },
  'Rabu': { bg: 'rgba(247,185,85,0.15)', color: '#F7B955' },
  'Kamis': { bg: 'rgba(168,85,247,0.15)', color: '#A855F7' },
  'Jumat': { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
  'Sabtu': { bg: 'rgba(56,189,248,0.15)', color: '#38BDF8' }
};

export default function Jadwal() {
  const { user } = useAuth();
  const [jadwalList, setJadwalList] = useState([]);
  const [loading, setLoading] = useState(true);

  const guruId = user?.uid || user?.id;

  useEffect(() => {
    const fetchJadwal = async () => {
      if (!guruId) return;

      try {
        setLoading(true);
        // Ambil data jadwal dari koleksi 'jadwal' berdasarkan ID guru yang login
        const q = query(collection(db, 'jadwal'), where('guru_id', '==', guruId));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setJadwalList(data);
      } catch (error) {
        console.error("Gagal memuat data jadwal mengajar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJadwal();
  }, [guruId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        Memuat jadwal mengajar...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>📅 Jadwal Mengajar Saya</h2>
          <p>{jadwalList.length} sesi terjadwal minggu ini</p>
        </div>
      </div>

      {/* Jadwal Grid per Hari */}
      {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(hari => {
        const jadwalHari = jadwalList.filter(j => j.hari === hari);
        if (jadwalHari.length === 0) return null;
        const hc = HARI_COLORS[hari] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' };

        return (
          <div key={hari} style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px',
              borderRadius: '99px',
              background: hc.bg,
              color: hc.color,
              fontWeight: '700',
              fontSize: '0.85rem',
              marginBottom: '10px',
            }}>
              {hari}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {jadwalHari.map(j => (
                <div key={j.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' }}>
                  {/* Waktu */}
                  <div style={{
                    minWidth: '90px', textAlign: 'center',
                    padding: '10px',
                    background: hc.bg,
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <p style={{ fontSize: '0.7rem', color: hc.color, fontWeight: '600' }}>{j.jam_mulai}</p>
                    <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>↓</p>
                    <p style={{ fontSize: '0.7rem', color: hc.color, fontWeight: '600' }}>{j.jam_selesai}</p>
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '4px' }}>{j.mata_pelajaran}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {j.kelas}
                    </p>
                  </div>
                  {/* Durasi */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      padding: '4px 10px',
                      borderRadius: '99px',
                      color: 'var(--text-muted)',
                    }}>
                      ⏱ 60 menit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {jadwalList.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h4>Belum ada jadwal</h4>
          <p>Hubungi admin untuk pengaturan jadwal</p>
        </div>
      )}

      {/* Tabel Ringkas */}
      {jadwalList.length > 0 && (
        <div className="card" style={{ marginTop: '8px' }}>
          <div className="section-header">
            <h3>Ringkasan Jadwal Mingguan</h3>
            <span className="section-header-badge">{jadwalList.length} total sesi</span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Hari</th>
                  <th>Mata Pelajaran</th>
                  <th>Kelas</th>
                  <th>Jam Mulai</th>
                  <th>Jam Selesai</th>
                </tr>
              </thead>
              <tbody>
                {jadwalList.map((j, i) => {
                  const hc = HARI_COLORS[j.hari] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
                  return (
                    <tr key={j.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td>
                        <span className="hari-badge" style={{ background: hc.bg, color: hc.color, fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
                          {j.hari}
                        </span>
                      </td>
                      <td>{j.mata_pelajaran}</td>
                      <td>{j.kelas}</td>
                      <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{j.jam_mulai}</td>
                      <td style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{j.jam_selesai}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}