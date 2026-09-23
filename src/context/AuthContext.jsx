import { createContext, useContext, useState } from 'react';
import { mockUser } from '../data/mockData';

// ===== AUTH CONTEXT =====
// Untuk saat ini menggunakan state lokal (mock)
// Nanti akan diganti dengan Supabase Auth

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock login - nanti diganti Supabase
  const login = async (email, password) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // Simulasi loading

    // Demo credentials
    if (email === 'admin@sdn.id' && password === 'admin123') {
      setUser({ ...mockUser, role: 'admin' });
      setLoading(false);
      return { success: true, role: 'admin' };
    } else if (email === 'guru@sdn.id' && password === 'guru123') {
      setUser({ ...mockUser, nama: 'Budi Santoso', email: 'guru@sdn.id', role: 'guru' });
      setLoading(false);
      return { success: true, role: 'guru' };
    }

    setLoading(false);
    return { success: false, error: 'Email atau password salah' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
