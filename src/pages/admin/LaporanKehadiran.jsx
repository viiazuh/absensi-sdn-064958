import { useState, useEffect, useMemo } from 'react';
import { MdPrint, MdFilterList } from 'react-icons/md';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function LaporanKehadiran() {
  const [bulan, setBulan] = useState(new Date().getMonth()); // Bulan saat ini (0-indexed)
  const [tahun, setTahun] = useState(new Date().getFullYear()); // Tahun saat ini (2026)
  const [guruList, setGuruList] = useState([]);
  const [kehadiranList, setKehadiranList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data Guru dari koleksi 'users' (role 'guru') dan Kehadiran dari Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Ambil daftar master guru dari koleksi 'users' (filter role 'guru')
        const userSnapshot = await getDocs(collection(db, 'users'));
        const listGuru = userSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => u.role === 'guru');
        setGuruList(listGuru);

        // 2. Ambil data kehadiran dari Firestore
        const kehadiranSnapshot = await getDocs(collection(db, 'kehadiran'));
        const kehadiranData = kehadiranSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setKehadiranList(kehadiranData);

      } catch (error) {
        console.error("Gagal memuat data laporan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Proses rekapitulasi data berdasarkan guru dan filter bulan/tahun yang dipilih
  const laporanRekap = useMemo(() => {
    return guruList.map(guru => {
      // Filter data kehadiran berdasarkan guru ini serta bulan dan tahun yang dipilih
      const filterPresensi = kehadiranList.filter(k => {
        // Cocokkan berdasarkan guru_id atau nama guru
        const matchGuru = (k.guru_id === guru.id) || (k.guru_nama === guru.nama);
        if (!matchGuru) return false;

        // Asumsi format tanggal tersimpan di k.tanggal (bisa string "YYYY-MM-DD", Timestamp, dll)
        let tanggalObj;
        if (k.tanggal?.toDate) {
          tanggalObj = k.tanggal.toDate();
        } else if (typeof k.tanggal === 'string' || typeof k.tanggal === 'number') {
          tanggalObj = new Date(k.tanggal);
        } else {
          return false;
        }

        if (isNaN(tanggalObj.getTime())) return false;

        return (
          tanggalObj.getMonth() === bulan &&
          tanggalObj.getFullYear() === tahun
        );
      });

      // Hitung akumulasi status kehadiran
      let hadir = 0;
      let sakit = 0;
      let izin = 0;
      let alpha = 0;

      filterPresensi.forEach(item => {
        const status = (item.status || '').toLowerCase();
        if (status === 'hadir') hadir++;
        else if (status === 'sakit') sakit++;
        else if (status === 'izin') izin++;
        else if (status === 'alpha' || status === 'alfa') alpha++;
      });

      const total = hadir + sakit + izin + alpha;

      return {
        guru_nama: guru.nama || 'Tanpa Nama',
        nip: guru.nip || guru.email || '-',
        hadir,
        sakit,
        izin,
        alpha,
        total: total === 0 ? 0 : total
      };
    });
  }, [guruList, kehadiranList, bulan, tahun]);

  const total_hadir = laporanRekap.reduce((a, r) => a + r.hadir, 0);
  const total_sakit = laporanRekap.reduce((a, r) => a + r.sakit, 0);
  const total_izin = laporanRekap.reduce((a, r) => a + r.izin, 0);

  const handlePrint = () => window.print();

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>📊 Laporan Kehadiran Guru</h2>
          <p>Rekap bulanan kehadiran seluruh guru</p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint} id="btn-cetak-laporan">
          <MdPrint /> Cetak Laporan
        </button>
      </div>

      {/* Filter */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: '0 0 180px' }}>
            <label className="form-label"><MdFilterList style={{ verticalAlign: 'middle' }} /> Bulan</label>
            <select className="form-control" value={bulan} onChange={e => setBulan(+e.target.value)}>
              {BULAN.map((b, i) => <option key={b} value={i}>{b}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: '0 0 120px' }}>
            <label className="form-label">Tahun</label>
            <select className="form-control" value={tahun} onChange={e => setTahun(+e.target.value)}>
              {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ paddingBottom: '2px' }}>
            <span style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              display: 'inline-block',
            }}>
              Periode: <strong>{BULAN[bulan]} {tahun}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='laporan-stats-grid'>
        <div className="stat-card green">
          <div className="stat-card-icon">✅</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{total_hadir}</div>
            <div className="stat-card-label">Total Hari Hadir</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-card-icon">🤒</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{total_sakit}</div>
            <div className="stat-card-label">Total Hari Sakit</div>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-icon">📄</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{total_izin}</div>
            <div className="stat-card-label">Total Hari Izin</div>
          </div>
        </div>
      </div>

      {/* Tabel Laporan */}
      <div className="card">
        <div className="section-header">
          <h3>Rekap Kehadiran — {BULAN[bulan]} {tahun}</h3>
          <span className="section-header-badge">{laporanRekap.length} guru</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Guru</th>
                <th>NIP / Email</th>
                <th style={{ textAlign: 'center', color: 'var(--accent-green)' }}>Hadir</th>
                <th style={{ textAlign: 'center', color: 'var(--accent-orange)' }}>Sakit</th>
                <th style={{ textAlign: 'center', color: 'var(--accent-purple)' }}>Izin</th>
                <th style={{ textAlign: 'center', color: 'var(--accent-red)' }}>Alpha</th>
                <th style={{ textAlign: 'center' }}>Total Hari</th>
                <th style={{ textAlign: 'center' }}>% Hadir</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '24px' }}>Memuat rekap laporan dari database...</td>
                </tr>
              ) : laporanRekap.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '24px' }}>Tidak ada data guru yang terdaftar di sistem.</td>
                </tr>
              ) : (
                laporanRekap.map((r, i) => {
                  const pct = r.total > 0 ? Math.round((r.hadir / r.total) * 100) : 0;
                  return (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.guru_nama}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {r.nip}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{r.hadir}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ color: r.sakit > 0 ? 'var(--accent-orange)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {r.sakit}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ color: r.izin > 0 ? 'var(--accent-purple)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {r.izin}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ color: r.alpha > 0 ? 'var(--accent-red)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {r.alpha}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.total}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '4px' }}>
                          <span style={{
                            fontWeight: 700,
                            color: pct >= 90 ? 'var(--accent-green)' : pct >= 75 ? 'var(--accent-orange)' : 'var(--accent-red)'
                          }}>
                            {pct}%
                          </span>
                          <div className="progress-bar" style={{ width: '60px', margin: '0 auto' }}>
                            <div className="progress-fill" style={{
                              width: `${pct}%`,
                              background: pct >= 90 ? 'var(--accent-green)' : pct >= 75 ? 'var(--accent-orange)' : 'var(--accent-red)',
                            }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Footer Total */}
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--border-subtle)', background: 'rgba(255,255,255,0.03)' }}>
                <td colSpan={3} style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  TOTAL KESELURUHAN
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-green)', padding: '12px 16px' }}>
                  {total_hadir}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-orange)', padding: '12px 16px' }}>
                  {total_sakit}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-purple)', padding: '12px 16px' }}>
                  {total_izin}
                </td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}