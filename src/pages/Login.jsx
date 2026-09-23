import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate(res.role === 'admin' ? '/admin/dashboard' : '/guru/dashboard');
    } else {
      setError(res.error);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') { setEmail('admin@sdn.id'); setPassword('admin123'); }
    else { setEmail('guru@sdn.id'); setPassword('guru123'); }
  };

  return (
    <div className="login-page">
      {/* Background Orbs */}
      <div className="login-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🏫</div>
          <h1>SD NEGERI 064956<br />MEDAN</h1>
          <p>Aplikasi Kehadiran Guru Berbasis Web</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(248,113,113,0.12)',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '0.82rem',
            color: '#F87171',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="login-input-wrapper">
              <MdEmail className="login-input-icon" />
              <input
                id="login-email"
                type="email"
                className="form-control"
                placeholder="email@sdn.id"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="login-input-wrapper" style={{ position: 'relative' }}>
              <MdLock className="login-input-icon" />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  fontSize: '1rem', display: 'flex'
                }}
              >
                {showPass ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          <button
            id="login-btn"
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? '⟳ Masuk...' : '🔐 Masuk'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '20px',
          padding: '14px',
          background: 'rgba(79,142,247,0.06)',
          border: '1px solid rgba(79,142,247,0.15)',
          borderRadius: 'var(--radius-sm)',
        }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>
            🧪 DEMO AKUN (klik untuk isi otomatis)
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.72rem' }}
            >
              ⚡ Login Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('guru')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.72rem' }}
            >
              👨‍🏫 Login Guru
            </button>
          </div>
        </div>

        <div className="login-footer">
          © SDN 064958 Medan — Sistem Absensi Digital
        </div>
      </div>
    </div>
  );
}
