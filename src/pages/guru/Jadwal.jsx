import { mockJadwal, HARI_COLORS } from '../../data/mockData';

// Filter jadwal guru ini (Budi Santoso = g2)
const myJadwal = mockJadwal.filter(j => j.guru_id === 'g2');

export default function Jadwal() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>📅 Jadwal Mengajar Saya</h2>
          <p>{myJadwal.length} sesi terjadwal minggu ini</p>
        </div>
      </div>

      {/* Jadwal Grid per Hari */}
      {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(hari => {
        const jadwalHari = myJadwal.filter(j => j.hari === hari);
        if (jadwalHari.length === 0) return null;
        const hc = HARI_COLORS[hari] || {};
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
              📆 {hari}
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
                      🏫 {j.kelas}
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

      {myJadwal.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h4>Belum ada jadwal</h4>
          <p>Hubungi admin untuk pengaturan jadwal</p>
        </div>
      )}

      {/* Tabel Ringkas */}
      <div className="card" style={{ marginTop: '8px' }}>
        <div className="section-header">
          <h3>📋 Ringkasan Jadwal Mingguan</h3>
          <span className="section-header-badge">{myJadwal.length} total sesi</span>
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
              {myJadwal.map((j, i) => {
                const hc = HARI_COLORS[j.hari] || {};
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
                    <td style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{j.jam_mulai}</td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{j.jam_selesai}</td>
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
