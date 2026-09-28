import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { HARI_COLORS } from '../../data/mockData';

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function JadwalGuruDashboard() {
  const [jadwalSaya, setJadwalSaya] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterHari, setFilterHari] = useState('');

  // Ambil jadwal khusus untuk guru yang sedang login
  const fetchJadwalGuru = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        console.warn("Belum ada user yang login!");
        setLoading(false);
        return;
      }

      // Query ke koleksi 'jadwal' di mana guru_id sama dengan UID user yang login
      const q = query(
        collection(db, 'jadwal'),
        where('guru_id', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const dataJadwal = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setJadwalSaya(dataJadwal);
    } catch (error) {
      console.error("Gagal memuat jadwal guru:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Pastikan auth sudah siap atau gunakan onAuthStateChanged jika diperlukan
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchJadwalGuru();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter berdasarkan hari yang dipilih
  const filteredJadwal = jadwalSaya.filter(j => !filterHari || j.hari === filterHari);

  return (
    <div style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2>📚 Jadwal Mengajar Saya</h2>
        <p>Daftar jadwal mengajar yang diberikan oleh Admin</p>
      </div>

      {/* Filter Hari */}
      <div className="card" style={{ marginBottom: '16px', padding: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Filter Hari:</span>
          <button
            className={`btn btn-sm ${filterHari === '' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterHari('')}
            style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Semua
          </button>
          {HARI.map(h => (
            <button
              key={h}
              className={`btn btn-sm ${filterHari === h ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterHari(h)}
              style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel Jadwal */}
      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Memuat jadwal kamu...</p>
        ) : filteredJadwal.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📭</div>
            <h4>Belum ada jadwal</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Belum ada jadwal mengajar yang diatur oleh admin untukmu.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Hari</th>
                  <th style={{ padding: '10px' }}>Mata Pelajaran</th>
                  <th style={{ padding: '10px' }}>Kelas</th>
                  <th style={{ padding: '10px' }}>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {filteredJadwal.map(j => {
                  const hc = HARI_COLORS?.[j.hari] || { bg: '#e2e8f0', color: '#1e293b' };
                  return (
                    <tr key={j.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          background: hc.bg,
                          color: hc.color,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}>
                          {j.hari}
                        </span>
                      </td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{j.mata_pelajaran}</td>
                      <td style={{ padding: '10px' }}>{j.kelas}</td>
                      <td style={{ padding: '10px', color: 'var(--accent-green, #10b981)', fontWeight: '600' }}>
                        {j.jam_mulai} - {j.jam_selesai}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}