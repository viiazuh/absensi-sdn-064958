import { useState, useEffect, useMemo } from 'react';
import { MdPrint } from 'react-icons/md';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function LaporanGuru() {
  const { user } = useAuth();
  const [bulan, setBulan] = useState(new Date().getMonth()); // Default bulan saat ini
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [kehadiranList, setKehadiranList] = useState([]);
  const [loading, setLoading] = useState(true);

  const guruId = user?.uid || user?.id;
  const guruNama = user?.nama;

  // Ambil data kehadiran guru dari Firestore
  useEffect(() => {
    const fetchKehadiranPersonal = async () => {
      if (!guruId && !guruNama) return;

      try {
        setLoading(true);
        const q = query(collection(db, 'kehadiran'), where('guru_id', '==', guruId));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setKehadiranList(data);
      } catch (error) {
        console.error("Gagal memuat riwayat kehadiran personal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKehadiranPersonal();
  }, [guruId, guruNama]);

  // Filter dan hitung rekap berdasarkan bulan & tahun yang dipilih
  const statsBulanIni = useMemo(() => {
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpha = 0;

    kehadiranList.forEach(item => {
      let tanggalObj;
      if (item.tanggal?.toDate) {
        tanggalObj = item.tanggal.toDate();
      } else if (typeof item.tanggal === 'string') {
        tanggalObj = new Date(item.tanggal);
      } else {
        return;
      }

      if (tanggalObj.getMonth() === bulan && tanggalObj.getFullYear() === tahun) {
        const status = (item.status || '').toLowerCase();
        if (status === 'hadir') hadir++;
        else if (status === 'sakit') sakit++;
        else if (status === 'izin') izin++;
        else if (status === 'alpha' || status === 'alfa') alpha++;
      }
    });

    const total = hadir + sakit + izin + alpha;
    return {
      hadir,
      sakit,
      izin,
      alpha,
      total: total === 0 ? 0 : total
    };
  }, [kehadiranList, bulan, tahun]);

  // Hitung riwayat 3 bulan terakhir secara dinamis murni dari data absensi
  const riwayat3Bulan = useMemo(() => {
    const hasil = [];
    const currentDate = new Date(tahun, bulan, 1);

    for (let i = 2; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const tBulan = targetDate.getMonth();
      const tTahun = targetDate.getFullYear();

      let hadir = 0;
      let sakit = 0;
      let izin = 0;
      let alpha = 0;

      kehadiranList.forEach(item => {
        let tanggalObj;
        if (item.tanggal?.toDate) {
          tanggalObj = item.tanggal.toDate();
        } else if (typeof item.tanggal === 'string') {
          tanggalObj = new Date(item.tanggal);
        } else {
          return;
        }

        if (tanggalObj.getMonth() === tBulan && tanggalObj.getFullYear() === tTahun) {
          const status = (item.status || '').toLowerCase();
          if (status === 'hadir') hadir++;
          else if (status === 'sakit') sakit++;
          else if (status === 'izin') izin++;
          else if (status === 'alpha' || status === 'alfa') alpha++;
        }
      });

      const total = hadir + sakit + izin + alpha;
      hasil.push({
        bulan: `${BULAN[tBulan]} ${tTahun}`,
        hadir,
        sakit,
        izin,
        alpha,
        total: total === 0 ? 0 : total
      });
    }

    return hasil;
  }, [kehadiranList, bulan, tahun]);

  const pct = statsBulanIni.total > 0 ? Math.round((statsBulanIni.hadir / statsBulanIni.total) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>📊 Laporan Kehadiran Saya</h2>
          <p>Rekap personal kehadiran per bulan</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.print()} id="btn-cetak-laporan-guru">
          <MdPrint /> Cetak
        </button>
      </div>

      {/* Filter Bulan */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: '0 0 180px' }}>
            <label className="form-label">Bulan</label>
            <select className="form-control" value={bulan} onChange={e => setBulan(+e.target.value)}>
              {BULAN.map((b, i) => <option key={b} value={i}>{b}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: '0 0 120px' }}>
            <label className="form-label">Tahun</label>
            <select className="form-control" value={tahun} onChange={e => setTahun(+e.target.value)}>
              {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Personal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div className="stat-card green">
          <div className="stat-card-icon">✅</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{loading ? '...' : statsBulanIni.hadir}</div>
            <div className="stat-card-label">Hadir</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-card-icon">🤒</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{loading ? '...' : statsBulanIni.sakit}</div>
            <div className="stat-card-label">Sakit</div>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-icon">📄</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{loading ? '...' : statsBulanIni.izin}</div>
            <div className="stat-card-label">Izin</div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-icon">📅</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{loading ? '...' : statsBulanIni.total}</div>
            <div className="stat-card-label">Hari Kerja</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.95rem' }}>📈 Persentase Kehadiran {BULAN[bulan]} {tahun}</h3>
          <span style={{
            fontSize: '1.75rem', fontWeight: '800',
            color: pct >= 90 ? 'var(--accent-green)' : 'var(--accent-orange)',
            background: 'transparent'
          }}>{loading ? '...' : `${pct}%`}</span>
        </div>
        <div className="progress-bar" style={{ height: '8px', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div className="progress-fill" style={{
            width: `${pct}%`,
            background: pct >= 90 ? 'var(--gradient-main)' : 'linear-gradient(135deg, #FB923C, #F87171)',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          {pct >= 90
            ? '🎉 Kehadiran sangat baik! Pertahankan.'
            : '⚠️ Kehadiran perlu ditingkatkan.'}
        </p>
      </div>

      {/* Riwayat Bulanan (Ditarik otomatis dari data absensi) */}
      <div className="card">
        <div className="section-header">
          <h3>Riwayat Kehadiran</h3>
          <span className="section-header-badge">3 bulan terakhir</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Periode</th>
                <th style={{ textAlign: 'center', color: 'var(--accent-green)' }}>Hadir</th>
                <th style={{ textAlign: 'center', color: 'var(--accent-orange)' }}>Sakit</th>
                <th style={{ textAlign: 'center', color: 'var(--accent-purple)' }}>Izin</th>
                <th style={{ textAlign: 'center' }}>Total Hari</th>
                <th style={{ textAlign: 'center' }}>% Hadir</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>Memuat riwayat kehadiran...</td>
                </tr>
              ) : riwayat3Bulan.every(r => r.total === 0) ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    Belum ada riwayat absensi tercatat pada periode ini.
                  </td>
                </tr>
              ) : (
                riwayat3Bulan.map((r, i) => {
                  const p = r.total > 0 ? Math.round((r.hadir / r.total) * 100) : 0;
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{r.bulan}</td>
                      <td style={{ textAlign: 'center', color: 'var(--accent-green)', fontWeight: 700 }}>{r.hadir}</td>
                      <td style={{ textAlign: 'center', color: r.sakit ? 'var(--accent-orange)' : 'var(--text-muted)', fontWeight: 600 }}>{r.sakit}</td>
                      <td style={{ textAlign: 'center', color: r.izin ? 'var(--accent-purple)' : 'var(--text-muted)', fontWeight: 600 }}>{r.izin}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.total}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          fontWeight: 700,
                          color: p >= 90 ? 'var(--accent-green)' : 'var(--accent-orange)'
                        }}>{p}%</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}