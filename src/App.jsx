import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import GuruLayout from './layouts/GuruLayout';

// Pages
import Login from './pages/Login';

// Admin Pages
import DashboardAdmin from './pages/admin/DashboardAdmin';
import DataGuru from './pages/admin/DataGuru';
import DataUser from './pages/admin/DataUser';
import JadwalGuru from './pages/admin/JadwalGuru';
import DataKehadiran from './pages/admin/DataKehadiran';
import LaporanKehadiran from './pages/admin/LaporanKehadiran';

// Guru Pages
import DashboardGuru from './pages/guru/DashboardGuru';
import AbsensiGuru from './pages/guru/AbsensiGuru';
import Jadwal from './pages/guru/Jadwal';
import LaporanGuru from './pages/guru/LaporanGuru';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="data-guru" element={<DataGuru />} />
            <Route path="data-user" element={<DataUser />} />
            <Route path="jadwal" element={<JadwalGuru />} />
            <Route path="kehadiran" element={<DataKehadiran />} />
            <Route path="laporan" element={<LaporanKehadiran />} />
          </Route>

          {/* Guru Routes */}
          <Route
            path="/guru"
            element={
              <ProtectedRoute requiredRole="guru">
                <GuruLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/guru/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardGuru />} />
            <Route path="absensi" element={<AbsensiGuru />} />
            <Route path="jadwal" element={<Jadwal />} />
            <Route path="laporan" element={<LaporanGuru />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
