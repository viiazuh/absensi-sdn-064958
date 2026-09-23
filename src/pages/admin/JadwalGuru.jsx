import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md';
import { mockJadwal, mockGuru, HARI_COLORS } from '../../data/mockData';

const emptyForm = { guru_id: '', mata_pelajaran: '', kelas: '', hari: 'Senin', jam_mulai: '07:30', jam_selesai: '08:30' };
const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function JadwalGuru() {
  const [jadwal, setJadwal] = useState(mockJadwal);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterHari, setFilterHari] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = jadwal.filter(j => !filterHari || j.hari === filterHari);

  const openTambah = () => { setForm(emptyForm); setModal('tambah'); };
  const openEdit = (j) => { setSelected(j); setForm({ ...j }); setModal('edit'); };
  const openHapus = (j) => { setSelected(j); setModal('hapus'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const getGuruNama = (id) => mockGuru.find(g => g.id === id)?.nama || '';

  const handleSave = () => {
    const guruNama = getGuruNama(form.guru_id);
    if (modal === 'tambah') {
      setJadwal(prev => [...prev, { ...form, id: 'j' + Date.now(), guru_nama: guruNama }]);
      showToast('Jadwal berhasil ditambahkan ✅');
    } else {
      setJadwal(prev => prev.map(j => j.id === selected.id ? { ...j, ...form, guru_nama: guruNama } : j));
      showToast('Jadwal berhasil diperbarui ✅');
    }
    closeModal();
  };

  const handleHapus = () => {
    setJadwal(prev => prev.filter(j => j.id !== selected.id));
    showToast('Jadwal dihapus 🗑️');
    closeModal();
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>📅 Jadwal Guru</h2>
          <p>Manajemen jadwal mengajar guru</p>
        </div>
        <button className="btn btn-primary" onClick={openTambah} id="btn-tambah-jadwal">
          <MdAdd /> Tambah Jadwal
        </button>
      </div>

      {/* Filter Hari */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="filter-group">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Filter Hari:</span>
          <button
            className={`btn btn-sm ${filterHari === '' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterHari('')}
          >
            Semua
          </button>
          {HARI.map(h => (
            <button
              key={h}
              className={`btn btn-sm ${filterHari === h ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterHari(h)}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Guru</th>
                <th>Mata Pelajaran</th>
                <th>Kelas</th>
                <th>Hari</th>
                <th>Jam Mulai</th>
                <th>Jam Selesai</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state-icon">📅</div>
                    <h4>Belum ada jadwal</h4>
                    <p>Tambahkan jadwal mengajar guru</p>
                  </div>
                </td></tr>
              ) : filtered.map((j, i) => {
                const hc = HARI_COLORS[j.hari] || {};
                return (
                  <tr key={j.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{j.guru_nama}</td>
                    <td>{j.mata_pelajaran}</td>
                    <td>
                      <span className="badge aktif" style={{ fontSize: '0.72rem' }}>{j.kelas}</span>
                    </td>
                    <td>
                      <span
                        className="hari-badge"
                        style={{ background: hc.bg, color: hc.color, fontWeight: 700 }}
                      >
                        {j.hari}
                      </span>
                    </td>
                    <td style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{j.jam_mulai}</td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{j.jam_selesai}</td>
                    <td>
                      <div className="action-group">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(j)}><MdEdit /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => openHapus(j)}><MdDelete /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {(modal === 'tambah' || modal === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'tambah' ? '➕ Tambah Jadwal' : '✏️ Edit Jadwal'}</h3>
              <button className="modal-close" onClick={closeModal}><MdClose /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Guru *</label>
                <select className="form-control" value={form.guru_id}
                  onChange={e => setForm(f => ({ ...f, guru_id: e.target.value }))}>
                  <option value="">Pilih Guru...</option>
                  {mockGuru.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Mata Pelajaran</label>
                  <select className="form-control" value={form.mata_pelajaran}
                    onChange={e => setForm(f => ({ ...f, mata_pelajaran: e.target.value }))}>
                    <option value="">Pilih...</option>
                    {['Matematika', 'Bahasa Indonesia', 'IPA', 'IPS', 'PJOK', 'PAI', 'Bahasa Inggris', 'SBK'].map(m =>
                      <option key={m} value={m}>{m}</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Kelas</label>
                  <select className="form-control" value={form.kelas}
                    onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))}>
                    <option value="">Pilih...</option>
                    {['Kelas I', 'Kelas II', 'Kelas III', 'Kelas IV', 'Kelas V', 'Kelas VI'].map(k =>
                      <option key={k} value={k}>{k}</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Hari</label>
                  <select className="form-control" value={form.hari}
                    onChange={e => setForm(f => ({ ...f, hari: e.target.value }))}>
                    {HARI.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Jam Mulai</label>
                  <input type="time" className="form-control" value={form.jam_mulai}
                    onChange={e => setForm(f => ({ ...f, jam_mulai: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jam Selesai</label>
                  <input type="time" className="form-control" value={form.jam_selesai}
                    onChange={e => setForm(f => ({ ...f, jam_selesai: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {modal === 'tambah' ? 'Simpan' : 'Perbarui'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'hapus' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div className="confirm-icon"><MdDelete /></div>
            <h3 style={{ marginBottom: '8px' }}>Hapus Jadwal?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Jadwal <strong>{selected?.mata_pelajaran}</strong> – {selected?.guru_nama}
            </p>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={closeModal}>Batal</button>
              <button className="btn btn-danger" onClick={handleHapus}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast success">
          <span className="toast-icon">✅</span>
          {toast}
        </div>
      )}
    </div>
  );
}
