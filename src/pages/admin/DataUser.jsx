import { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdKey } from 'react-icons/md';
import { getInitials } from '../../data/mockData';
import { db, auth } from '../../firebase';
import {
  collection, getDocs, doc, setDoc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const emptyForm = { nama: '', email: '', role: 'guru', status: 'Aktif', password: '' };

export default function DataUser() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil data user dari Firestore saat komponen dimuat
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const listUser = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setUsers(listUser);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
      showToast("Gagal memuat data dari database", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    (u.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openTambah = () => { setForm(emptyForm); setModal('tambah'); };
  const openEdit = (u) => { setSelected(u); setForm({ ...u, password: '' }); setModal('edit'); };
  const openHapus = (u) => { setSelected(u); setModal('hapus'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSave = async () => {
    if (!form.nama || !form.email) return;
    setLoading(true);

    try {
      if (modal === 'tambah') {
        if (!form.password || form.password.length < 6) {
          alert('Password wajib diisi minimal 6 karakter untuk pembuatan akun baru.');
          setLoading(false);
          return;
        }

        // 1. Buat akun di Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const uid = userCredential.user.uid;

        // 2. Simpan profil lengkap ke Firestore collection 'users' menggunakan UID asli
        const newUserData = {
          nama: form.nama,
          email: form.email,
          role: form.role,
          status: form.status,
          createdAt: new Date().toISOString().slice(0, 10)
        };

        await setDoc(doc(db, 'users', uid), newUserData);
        showToast('User dan akun Auth berhasil ditambahkan');

      } else {
        // Edit data user di Firestore
        const userDocRef = doc(db, 'users', selected.id);
        const updateData = {
          nama: form.nama,
          role: form.role,
          status: form.status,
        };

        await updateDoc(userDocRef, updateData);
        showToast('Data user berhasil diperbarui');
      }

      closeModal();
      fetchUsers(); // Refresh data tabel
    } catch (error) {
      console.error("Error saving user:", error);
      showToast('Gagal: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = async () => {
    try {
      // Hapus dokumen dari Firestore berdasarkan ID (UID)
      await deleteDoc(doc(db, 'users', selected.id));
      showToast('User berhasil dihapus', 'error');
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error("Gagal menghapus:", error);
      showToast('Gagal menghapus data', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>👤 Data User</h2>
          <p>{users.length} akun pengguna terdaftar di Database</p>
        </div>
        <button className="btn btn-primary" onClick={openTambah} id="btn-tambah-user">
          <MdAdd /> Tambah User
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
              placeholder="Cari nama atau email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td>
                    <div className="guru-cell">
                      <div className="guru-avatar-sm" style={{
                        background: u.role === 'admin'
                          ? 'linear-gradient(135deg, #4F8EF7)'
                          : '#DBEAFE'
                      }}>
                        {getInitials(u.nama || 'User')}
                      </div>
                      <div className="guru-cell-info">
                        <h5>{u.nama}</h5>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'admin-role' : 'guru-role'}`}>
                      {u.role === 'admin' ? 'Admin' : 'Guru'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'Aktif' ? 'aktif' : 'nonaktif'}`}>
                      {u.status || 'Aktif'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.createdAt || '-'}</td>
                  <td>
                    <div className="action-group">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)} title="Edit">
                        <MdEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => openHapus(u)}
                        title="Hapus"
                        disabled={u.role === 'admin'}
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
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'tambah' ? '➕ Tambah User' : 'Edit User'}</h3>
              <button className="modal-close" onClick={closeModal}><MdClose /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap *</label>
                <input className="form-control" placeholder="Nama user" value={form.nama}
                  onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-control" type="email" placeholder="email@sdn.id" value={form.email}
                  disabled={modal === 'edit'}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-control" value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="guru">Guru</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              {modal === 'tambah' && (
                <div className="form-group">
                  <label className="form-label">
                    <MdKey style={{ verticalAlign: 'middle' }} /> Password *
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Min. 6 karakter"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Menyimpan...' : (modal === 'tambah' ? 'Simpan' : 'Perbarui')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {modal === 'hapus' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div className="confirm-icon"><MdDelete /></div>
            <h3 style={{ marginBottom: '8px' }}>Hapus User?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Hapus akun "<strong>{selected?.nama}</strong>"?
            </p>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={closeModal}>Batal</button>
              <button className="btn btn-danger" onClick={handleHapus}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✅' : '🗑️'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}