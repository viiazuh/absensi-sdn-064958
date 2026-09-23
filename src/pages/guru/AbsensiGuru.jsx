import { useState } from 'react';
import { MdCheckCircle, MdSick, MdEventBusy, MdAccessTime } from 'react-icons/md';
import { formatTanggal, getTodayString, getNowTime } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function AbsensiGuru() {
  const { user } = useAuth();
  const today = getTodayString();
  const [form, setForm] = useState({
    tanggal: today,
    jam_masuk: getNowTime(),
    status: 'Hadir',
    keterangan: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAbsen = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    // TODO: Simpan ke Supabase
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="absensi-form-card" style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '50%',
            background: 'rgba(67,232,154,0.15)',
            border: '2px solid var(--accent-green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '2.5rem',
          }}>
            ✅
          </div>
          <h2 style={{ marginBottom: '8px' }}>Absensi Berhasil!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {form.status === 'Hadir'
              ? `Anda telah tercatat hadir pada pukul ${form.jam_masuk}`
              : `Anda tercatat ${form.status} hari ini`
            }
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            {formatTanggal(form.tanggal)}
          </p>

          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'left',
          }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status</p>
              <span className={`badge ${form.status.toLowerCase()}`}>● {form.status}</span>
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Jam Masuk</p>
              <p style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>{form.jam_masuk || '—'}</p>
            </div>
            {form.keterangan && (
              <div style={{ gridColumn: '1/-1' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Keterangan</p>
                <p style={{ fontSize: '0.85rem' }}>{form.keterangan}</p>
              </div>
            )}
          </div>

          <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="absensi-form-card">
        <h3 style={{ marginBottom: '4px' }}>📍 Absensi Kehadiran</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          {formatTanggal(today)}
        </p>

        {/* Status Selection */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ marginBottom: '10px' }}>Status Kehadiran *</label>
          <div className="absensi-status-grid">
            {[
              { val: 'Hadir', icon: '✅', label: 'Hadir' },
              { val: 'Sakit', icon: '🤒', label: 'Sakit' },
              { val: 'Izin', icon: '📄', label: 'Izin' },
            ].map(s => (
              <div
                key={s.val}
                className={`status-option ${form.status === s.val ? `selected-${s.val.toLowerCase()}` : ''}`}
                onClick={() => setForm(f => ({ ...f, status: s.val }))}
                id={`status-${s.val.toLowerCase()}`}
              >
                <span className="icon">{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tanggal & Jam */}
        <div className="form-grid" style={{ marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label">Tanggal</label>
            <input type="date" className="form-control"
              value={form.tanggal}
              onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <MdAccessTime style={{ verticalAlign: 'middle' }} /> Jam Masuk
            </label>
            <input type="time" className="form-control"
              value={form.jam_masuk}
              onChange={e => setForm(f => ({ ...f, jam_masuk: e.target.value }))}
              disabled={form.status !== 'Hadir'}
            />
          </div>
        </div>

        {/* Keterangan */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">
            Keterangan {form.status !== 'Hadir' && '(wajib diisi)'}
          </label>
          <textarea
            className="form-control"
            rows={3}
            placeholder={
              form.status === 'Hadir'
                ? 'Catatan tambahan (opsional)...'
                : form.status === 'Sakit'
                ? 'Jelaskan kondisi kesehatan...'
                : 'Alasan izin tidak masuk...'
            }
            value={form.keterangan}
            onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Info Guru */}
        <div style={{
          background: 'rgba(79,142,247,0.06)',
          border: '1px solid rgba(79,142,247,0.15)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          marginBottom: '20px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
        }}>
          👨‍🏫 Guru: <strong style={{ color: 'var(--text-primary)' }}>{user?.nama}</strong>
        </div>

        <button
          id="btn-absen"
          className="btn btn-primary"
          style={{ width: '100%', padding: '13px', fontSize: '0.95rem' }}
          onClick={handleAbsen}
          disabled={loading}
        >
          {loading ? '⟳ Menyimpan...' : '✅ Absen Masuk'}
        </button>
      </div>
    </div>
  );
}
