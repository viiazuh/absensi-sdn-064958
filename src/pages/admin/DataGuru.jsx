import { useState, useEffect } from 'react';
import { MdSearch, MdClose } from 'react-icons/md';
import { getInitials } from '../../data/mockData';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function DataGuru() {
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Ambil data guru langsung dari koleksi 'users' dengan filter role 'guru'
  const fetchGuru = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(query(collection(db, 'users'), orderBy('nama', 'asc')));
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.role === 'guru'); // Hanya ambil yang rolenya guru

      setGuruList(data);
    } catch (error) {
      console.error("Gagal mengambil data guru:", error);
      showToast('Gagal memuat data guru dari database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  const filtered = guruList.filter(g =>
    (g.nama?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (g.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (g.mata_pelajaran?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>👨‍🏫 Data Guru</h2>
          <p>{guruList.length} akun guru terdaftar di sistem</p>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="search-bar">
          <div className="search-input-wrapper">
            <MdSearch className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama, email, atau mata pelajaran..."
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
                <th>Email</th>
                <th>Mata Pelajaran</th>
                <th>Kelas</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Memuat data guru...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6}>
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
                          ? <img src={g.foto_url} alt={g.nama} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          : getInitials(g.nama || 'Guru')
                        }
                      </div>
                      <div className="guru-cell-info">
                        <h5 style={{ margin: 0 }}>{g.nama || 'Tanpa Nama'}</h5>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {g.email || '—'}
                  </td>
                  <td>{g.mata_pelajaran || '—'}</td>
                  <td>{g.kelas || '—'}</td>
                  <td>
                    <span className={`badge ${g.status === 'Aktif' || !g.status ? 'aktif' : 'nonaktif'}`}>
                      {g.status || 'Aktif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✅' : '⚠️'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}