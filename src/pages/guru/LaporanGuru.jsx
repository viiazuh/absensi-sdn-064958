import { useState } from 'react';
import { MdPrint } from 'react-icons/md';
import { mockLaporan } from '../../data/mockData';

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Data personal guru (Budi Santoso)
const myData = mockLaporan[1];

// Riwayat bulanan (dummy)
const riwayat = [
  { bulan: 'Juli 2024', hadir: 21, sakit: 0, izin: 1, alpha: 0, total: 22 },
  { bulan: 'Agustus 2024', hadir: 20, sakit: 1, izin: 1, alpha: 0, total: 22 },
  { bulan: 'September 2024', hadir: 17, sakit: 0, izin: 2, alpha: 0, total: 19 },
];

export default function LaporanGuru() {
  const [bulan, setBulan] = useState(8);
  const [tahun, setTahun] = useState(2024);

  const pct = Math.round((myData.hadir / myData.total) * 100);

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
              {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Personal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div className="stat-card green">
          <div className="stat-card-icon">✅</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{myData.hadir}</div>
            <div className="stat-card-label">Hadir</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-card-icon">🤒</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{myData.sakit}</div>
            <div className="stat-card-label">Sakit</div>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-icon">📄</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{myData.izin}</div>
            <div className="stat-card-label">Izin</div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-icon">📅</div>
          <div className="stat-card-info">
            <div className="stat-card-value">{myData.total}</div>
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
            background: pct >= 90 ? 'var(--gradient-main)' : 'linear-gradient(135deg, #FB923C, #F87171)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>{pct}%</span>
        </div>
        <div className="progress-bar" style={{ height: '8px' }}>
          <div className="progress-fill" style={{
            width: `${pct}%`,
            background: pct >= 90 ? 'var(--gradient-main)' : 'linear-gradient(135deg, #FB923C, #F87171)',
          }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          {pct >= 90
            ? '🎉 Kehadiran sangat baik! Pertahankan.'
            : '⚠️ Kehadiran perlu ditingkatkan.'}
        </p>
      </div>

      {/* Riwayat Bulanan */}
      <div className="card">
        <div className="section-header">
          <h3>📋 Riwayat Kehadiran</h3>
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
              {riwayat.map((r, i) => {
                const p = Math.round((r.hadir / r.total) * 100);
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
