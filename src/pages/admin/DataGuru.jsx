import { useState, useRef } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdCloudUpload, MdPerson } from 'react-icons/md';
import { mockGuru, getInitials } from '../../data/mockData';

const emptyForm = { nip: '', nama: '', mata_pelajaran: '', kelas: '', status: 'Aktif', foto_url: null };

export default function DataGuru() {
  const [guruList, setGuruList] = useState(mockGuru);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'tambah' | 'edit' | 'hapus'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  const filtered = guruList.filter(g =>
    g.nama.toLowerCase().includes(search.toLowerCase()) ||
    g.nip.includes(search) ||
    g.mata_pelajaran.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openTambah = () => {
    setForm(emptyForm);
    setFotoPreview(null);
    setModal('tambah');
  };

  const openEdit = (guru) => {
    setSelected(guru);
    setForm({ ...guru });
    setFotoPreview(guru.foto_url);
    setModal('edit');
  };

  const openHapus = (guru) => {
    setSelected(guru);
    setModal('hapus');
  };

  const closeModal = () => { setModal(null); setSelected(null); };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFotoPreview(url);
    setForm(f => ({ ...f, foto_url: url }));
    // TODO: Upload ke Cloudinary
  };

  const handleSave = () => {
    if (!form.nip || !form.nama) return;
    if (modal === 'tambah') {
      setGuruList(prev => [...prev, { ...form, id: 'g' + Date.now() }]);
      showToast('Data guru berhasil ditambahkan');
    } else {
      setGuruList(prev => prev.map(g => g.id === selected.id ? { ...g, ...form } : g));
      showToast('Data guru berhasil diperbarui');
    }
    closeModal();
  };

  const handleHapus = () => {
    setGuruList(prev => prev.filter(g => g.id !== selected.id));
    showToast('Data guru berhasil dihapus', 'error');
    closeModal();
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>👨‍🏫 Data Guru</h2>
          <p>{guruList.length} guru terdaftar</p>
        </div>
        <button className="btn btn-primary" onClick={openTambah} id="btn-tambah-guru">
          <MdAdd /> Tambah Guru
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="search-bar">
          <div className="search-input-wrapper">
            <MdSearch className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama, NIP, atau mata pelajaran..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="search-guru"
            />
          </div>
          {search && (
            <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>
              <MdClose /> Reset
            </button>
          )}
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filtered.length} ditemukan
          </span>
        </div>
      </div>

      {/* Tabel */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Guru</th>
                <th>NIP</th>
                <th>Mata Pelajaran</th>
                <th>Kelas</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h4>Tidak ditemukan</h4>
                    <p>Coba ubah kata kunci pencarian</p>
                  </div>
                </td></tr>
              ) : filtered.map((g, i) => (
                <tr key={g.id}>
                  <td style={{ color: 'var(--text-muted)', width: '40px' }}>{i + 1}</td>
                  <td>
                    <div className="guru-cell">
                      <div className="guru-avatar-sm">
                        {g.foto_url
                          ? <img src={g.foto_url} alt={g.nama} />
                          : getInitials(g.nama)
                        }
                      </div>
                      <div className="guru-cell-info">
                        <h5>{g.nama}</h5>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                    {g.nip}
                  </td>
                  <td>{g.mata_pelajaran}</td>
                  <td>{g.kelas}</td>
                  <td>
                    <span className={`badge ${g.status === 'Aktif' ? 'aktif' : 'nonaktif'}`}>
                      {g.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-group">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEdit(g)}
                        title="Edit"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => openHapus(g)}
                        title="Hapus"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {(modal === 'tambah' || modal === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'tambah' ? '➕ Tambah Guru' : '✏️ Edit Guru'}</h3>
              <button className="modal-close" onClick={closeModal}><MdClose /></button>
            </div>

            {/* Upload Foto */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                Foto Guru
              </label>
              <div className="foto-upload-area" onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
                {fotoPreview ? (
                  <img src={fotoPreview} alt="preview" className="foto-preview" />
                ) : (
                  <div className="foto-upload-icon"><MdCloudUpload /></div>
                )}
                <p className="foto-upload-text">
                  {fotoPreview ? 'Klik untuk ganti foto' : 'Klik untuk upload foto'}
                </p>
                <p className="foto-upload-hint">JPG, PNG, WebP • Maks 2MB • (Nanti via Cloudinary)</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">NIP *</label>
                <input
                  className="form-control"
                  placeholder="18 digit NIP"
                  value={form.nip}
                  onChange={e => setForm(f => ({ ...f, nip: e.target.value }))}
                  maxLength={18}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nama Lengkap *</label>
                <input
                  className="form-control"
                  placeholder="Nama guru"
                  value={form.nama}
                  onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mata Pelajaran</label>
                <select
                  className="form-control"
                  value={form.mata_pelajaran}
                  onChange={e => setForm(f => ({ ...f, mata_pelajaran: e.target.value }))}
                >
                  <option value="">Pilih...</option>
                  {['Guru Kelas', 'Matematika', 'Bahasa Indonesia', 'IPA', 'IPS', 'PJOK', 'PAI', 'Bahasa Inggris', 'SBK'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Kelas</label>
                <select
                  className="form-control"
                  value={form.kelas}
                  onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))}
                >
                  <option value="">Pilih...</option>
                  {['Kelas I', 'Kelas II', 'Kelas III', 'Kelas IV', 'Kelas V', 'Kelas VI', 'Semua Kelas'].map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
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

      {/* Modal Hapus */}
      {modal === 'hapus' && (
        <div className="modal-overlay confirm-modal" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div className="confirm-icon"><MdDelete /></div>
            <h3 style={{ marginBottom: '8px' }}>Hapus Guru?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>
              Yakin ingin menghapus data guru
            </p>
            <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '24px' }}>
              "{selected?.nama}"?
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0' }}>
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={closeModal}>Batal</button>
              <button className="btn btn-danger" onClick={handleHapus}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✅' : '🗑️'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
