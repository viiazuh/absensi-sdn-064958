import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Autentikasi user dengan Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Ambil data role tambahan dari Firestore (koleksi 'users')
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      let role = 'admin'; // Default role jika tidak ditemukan
      let additionalData = {};

      if (userDoc.exists()) {
        const userData = userDoc.data();
        role = userData.role || 'guru';
        additionalData = userData;
      }

      const userInfo = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: role,
        ...additionalData
      };

      setUser(userInfo);
      setLoading(false);
      return { success: true, role: role };

    } catch (error) {
      setLoading(false);
      let errorMessage = 'Email atau password salah';

      // Menyesuaikan pesan error umum dari Firebase
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Email atau password salah.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Terlalu banyak percobaan gagal. Coba beberapa saat lagi.';
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  // Pantau status login secara real-time (persistence session)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          let role = 'admin';
          let additionalData = {};

          if (userDoc.exists()) {
            const userData = userDoc.data();
            role = userData.role || 'admin';
            additionalData = userData;
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: role,
            ...additionalData
          });
        } catch (err) {
          console.error("Gagal mengambil data role user:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Tampilkan layar muat saat Firebase sedang mengecek sesi aktif agar tidak langsung redirect ke login saat refresh
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⏳</div>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Memuat sesi aplikasi...</p>
        </div>
      </div>
    );
  }

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