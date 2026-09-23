import { useState } from 'react';
import { MdFilterList, MdEdit, MdSearch } from 'react-icons/md';
import { mockKehadiran, mockGuru, formatTanggalShort, getInitials } from '../../data/mockData';

const statusBadge = (status) => {
  const map = { Hadir: 'hadir', Sakit: 'sakit', Izin: 'izin', Alpha: 'alpha' };
  return <span className={`badge ${map[status] || ''}`}>● {status}</span>;
};

export default function DataKehadiran() {
  const [tanggal, setTanggal] = useState('2024-09-23');
  const [search, setSearch] = useState('');
  const [kehadiran, setKehadiran] = useState(mockKehadiran);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = kehadiran
    .filter(k => !tanggal || k.tanggal === tanggal)
    .filter(k =>
      !search || k.guru_nama.toLowerCase().includes(search.toLowerCase())
    );

  // Stats
  const hadir = filtered.filter(k => k.status === 'Hadir').length;
  const sakit = filtered.filter(k => k.status === 'Sakit').length;
  const izin = filtered.filter(k => k.status === 'Izin').length;
  const alpha = filtered.filter(k => k.status === 'Alpha').length;

  const handleStatusChange = (id, newStatus) => {
    setKehadiran(prev => prev.map(k => k.id === id ? { ...k, status: newStatus } : k));
    showToast('Status kehadiran diperbarui ✅');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>📋 Data Kehadiran</h2>
          <p>Rekap kehadiran guru harian</p>
        </div>
      </div>

      {/* Filter */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: '0 0 200px' }}>
            <label className="form-label"><MdFilterList style={{ verticalAlign: 'middle' }} /> Tanggal</label>
            <input type="date" className="form-control" value={tanggal}
              onChange={e => setTanggal(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
            <label className="form-label"><MdSearch style={{ verticalAlign: 'middle' }} /> Cari Guru</label>
            <input type="text" className="form-control" placeholder="Nama guru..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Hadir', val: hadir, color: 'green' },
          { label: 'Sakit', val: sakit, color: 'orange' },
          { label: 'Izin', val: izin, color: 'purple' },
          { label: 'Alpha', val: alpha, color: 'blue' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`} style={{ padding: '14px 18px' }}>
            <div className="stat-card-icon" style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>
              {s.label === 'Hadir' ? '✅' : s.label === 'Sakit' ? '🤒' : s.label === 'Izin' ? '📄' : '❌'}
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value" style={{ fontSize: '1.5rem' }}>{s.val}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel */}
      <div className="card">
        <div className="section-header">
          <h3>📅 Data tanggal {tanggal ? formatTanggalShort(tanggal) : 'Semua'}</h3>
          <span className="section-header-badge">{filtered.length} record</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Guru</th>
                <th>Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Keluar</th>
                <th>Status</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h4>Tidak ada data</h4>
                    <p>Pilih tanggal yang berbeda</p>
                  </div>
                </td></tr>
              ) : filtered.map((k, i) => (
                <tr key={k.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td>
                    <div className="guru-cell">
                      <div className="guru-avatar-sm">{getInitials(k.guru_nama)}</div>
                      <div className="guru-cell-info"><h5>{k.guru_nama}</h5></div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{formatTanggalShort(k.tanggal)}</td>
                  <td style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{k.jam_masuk || '—'}</td>
                  <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{k.jam_keluar || '—'}</td>
                  <td>{statusBadge(k.status)}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{k.keterangan || '—'}</td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', width: '90px' }}
                      value={k.status}
                      onChange={e => handleStatusChange(k.id, e.target.value)}
                    >
                      {['Hadir', 'Sakit', 'Izin', 'Alpha'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="toast success">
          <span className="toast-icon">✅</span>
          {toast}
        </div>
      )}
    </div>
  );
}
