import { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md';
import { HARI_COLORS } from '../../data/mockData';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const emptyForm = { guru_id: '', mata_pelajaran: '', kelas: '', hari: 'Senin', jam_mulai: '07:30', jam_selesai: '08:30' };
const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function JadwalGuru() {
  const [jadwal, setJadwal] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterHari, setFilterHari] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Ambil data Guru dan Jadwal dari Firestore
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Ambil data guru untuk dropdown pilihan guru
      const guruSnapshot = await getDocs(collection(db, 'guru'));
      const guruData = guruSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGuruList(guruData);

      // 2. Ambil data jadwal
      const jadwalSnapshot = await getDocs(query(collection(db, 'jadwal'), orderBy('hari', 'asc')));
      const jadwalData = jadwalSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJadwal(jadwalData);

    } catch (error) {
      console.error("Gagal memuat data:", error);
      showToast('Gagal memuat data dari database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = jadwal.filter(j => !filterHari || j.hari === filterHari);

  const openTambah = () => { setForm(emptyForm); setModal('tambah'); };
  const openEdit = (j) => { setSelected(j); setForm({ ...j }); setModal('edit'); };
  const openHapus = (j) => { setSelected(j); setModal('hapus'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const getGuruNama = (id) => guruList.find(g => g.id === id)?.nama || '';

  const handleSave = async () => {
    if (!form.guru_id || !form.mata_pelajaran || !form.kelas) {
      showToast('Mohon lengkapi data guru, mata pelajaran, dan kelas!', 'error');
      return;
    }

    const guruNama = getGuruNama(form.guru_id);

    try {
      if (modal === 'tambah') {
        const docRef = await addDoc(collection(db, 'jadwal'), {
          ...form,
          guru_nama: guruNama,
          created_at: new Date()
        });
        setJadwal(prev => [...prev, { ...form, id: docRef.id, guru_nama: guruNama }]);
        showToast('Jadwal berhasil ditambahkan ✅');
      } else if (modal === 'edit' && selected) {
        const docRef = doc(db, 'jadwal', selected.id);
        await updateDoc(docRef, {
          guru_id: form.guru_id,
          guru_nama: guruNama,
          mata_pelajaran: form.mata_pelajaran,
          kelas: form.kelas,
          hari: form.hari,
          jam_mulai: form.jam_mulai,
          jam_selesai: form.jam_selesai
        });
        setJadwal(prev => prev.map(j => j.id === selected.id ? { ...j, ...form, guru_nama: guruNama } : j));
        showToast('Jadwal berhasil diperbarui ✅');
      }
      closeModal();
      fetchData(); // Sinkronisasi ulang data
    } catch (error) {
      console.error("Gagal menyimpan jadwal:", error);
      showToast('Gagal menyimpan ke database', 'error');
    }
  };

  const handleHapus = async () => {
    if (!selected) return;

    try {
      await deleteDoc(doc(db, 'jadwal', selected.id));
      setJadwal(prev => prev.filter(j => j.id !== selected.id));
      showToast('Jadwal dihapus 🗑️', 'error');
      closeModal();
    } catch (error) {
      console.error("Gagal menghapus jadwal:", error);
      showToast('Gagal menghapus dari database', 'error');
    }
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
        <div className="filter-group" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
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
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>Memuat data jadwal...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state-icon">📅</div>
                    <h4>Belum ada jadwal</h4>
                    <p>Tambahkan jadwal mengajar guru</p>
                  </div>
                </td></tr>
              ) : filtered.map((j, i) => {
                const hc = HARI_COLORS[j.hari] || { bg: '#eee', color: '#333' };
                return (
                  <tr key={j.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{j.guru_nama}</td>
                    <td>{j.mata_pelajaran}</td>
                    <td>
                      {j.kelas}
                    </td>
                    <td>
                      <span
                        className="hari-badge"
                        style={{ background: hc.bg, color: hc.color, fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}
                      >
                        {j.hari}
                      </span>
                    </td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{j.jam_mulai}</td>
                    <td style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{j.jam_selesai}</td>
                    <td>
                      <div className="action-group" style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(j)} title="Edit"><MdEdit /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => openHapus(j)} title="Hapus"><MdDelete /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {(modal === 'tambah' || modal === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'tambah' ? '➕ Tambah Jadwal' : '✏️ Edit Jadwal'}</h3>
              <button className="modal-close" onClick={closeModal}><MdClose /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              <div className="form-group">
                <label className="form-label">Guru *</label>
                <select className="form-control" value={form.guru_id}
                  onChange={e => setForm(f => ({ ...f, guru_id: e.target.value }))}>
                  <option value="" disabled hidden>Pilih Guru...</option>
                  {guruList.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Mata Pelajaran *</label>
                  <select className="form-control" value={form.mata_pelajaran}
                    onChange={e => setForm(f => ({ ...f, mata_pelajaran: e.target.value }))}>
                    <option value="" disabled hidden>Pilih...</option>
                    {['Matematika', 'Bahasa Indonesia', 'IPA', 'IPS', 'PJOK', 'PAI', 'Bahasa Inggris', 'SBK', 'Guru Kelas'].map(m =>
                      <option key={m} value={m}>{m}</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Kelas *</label>
                  <select className="form-control" value={form.kelas}
                    onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))}>
                    <option value="" disabled hidden>Pilih...</option>
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

            <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div className="confirm-icon" style={{ fontSize: '2.5rem', color: 'var(--accent-red, red)', marginBottom: '10px' }}><MdDelete /></div>
            <h3 style={{ marginBottom: '8px' }}>Hapus Jadwal?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Jadwal <strong>{selected?.mata_pelajaran}</strong> – {selected?.guru_nama}
            </p>
            <div className="modal-footer" style={{ justifyContent: 'center', display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={closeModal}>Batal</button>
              <button className="btn btn-danger" onClick={handleHapus}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✅' : '🗑️'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}