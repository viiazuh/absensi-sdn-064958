// ===== MOCK DATA DUMMY =====
// Nanti akan diganti dengan data dari Supabase

export const mockUser = {
  id: '1',
  nama: 'Admin Sekolah',
  email: 'admin@sdn064956.sch.id',
  role: 'admin',
  foto: null,
};

export const mockGuruUser = {
  id: '2',
  nama: 'Budi Santoso',
  email: 'budi@sdn064956.sch.id',
  role: 'guru',
  foto: null,
};

export const mockGuru = [
  {
    id: 'g1',
    nip: '198601012010012001',
    nama: 'Siti Ahmad',
    mata_pelajaran: 'Guru Kelas',
    kelas: 'Kelas I',
    foto_url: null,
    status: 'Aktif',
  },
  {
    id: 'g2',
    nip: '198903152012012002',
    nama: 'Budi Santoso',
    mata_pelajaran: 'Guru Kelas',
    kelas: 'Kelas II',
    foto_url: null,
    status: 'Aktif',
  },
  {
    id: 'g3',
    nip: '199002201013011003',
    nama: 'Andi Saputra',
    mata_pelajaran: 'Guru Kelas',
    kelas: 'Kelas III',
    foto_url: null,
    status: 'Aktif',
  },
  {
    id: 'g4',
    nip: '198512101011011004',
    nama: 'Dewi Rahayu',
    mata_pelajaran: 'PJOK',
    kelas: 'Semua Kelas',
    foto_url: null,
    status: 'Aktif',
  },
  {
    id: 'g5',
    nip: '199105251014012005',
    nama: 'Muhammad Rizky',
    mata_pelajaran: 'PAI',
    kelas: 'Semua Kelas',
    foto_url: null,
    status: 'Nonaktif',
  },
];

export const mockUsers = [
  {
    id: 'u1',
    nama: 'Admin Sekolah',
    email: 'admin@sdn064956.sch.id',
    role: 'admin',
    status: 'Aktif',
    createdAt: '2024-01-01',
  },
  {
    id: 'u2',
    nama: 'Siti Ahmad',
    email: 'siti@sdn064956.sch.id',
    role: 'guru',
    status: 'Aktif',
    createdAt: '2024-01-05',
  },
  {
    id: 'u3',
    nama: 'Budi Santoso',
    email: 'budi@sdn064956.sch.id',
    role: 'guru',
    status: 'Aktif',
    createdAt: '2024-01-05',
  },
  {
    id: 'u4',
    nama: 'Andi Saputra',
    email: 'andi@sdn064956.sch.id',
    role: 'guru',
    status: 'Aktif',
    createdAt: '2024-01-05',
  },
  {
    id: 'u5',
    nama: 'Dewi Rahayu',
    email: 'dewi@sdn064956.sch.id',
    role: 'guru',
    status: 'Aktif',
    createdAt: '2024-01-10',
  },
];

export const mockJadwal = [
  { id: 'j1', guru_id: 'g1', guru_nama: 'Siti Ahmad', mata_pelajaran: 'Matematika', kelas: 'Kelas I', hari: 'Senin', jam_mulai: '07:30', jam_selesai: '08:30' },
  { id: 'j2', guru_id: 'g1', guru_nama: 'Siti Ahmad', mata_pelajaran: 'Bahasa Indonesia', kelas: 'Kelas I', hari: 'Selasa', jam_mulai: '08:30', jam_selesai: '09:30' },
  { id: 'j3', guru_id: 'g2', guru_nama: 'Budi Santoso', mata_pelajaran: 'IPA', kelas: 'Kelas II', hari: 'Senin', jam_mulai: '09:00', jam_selesai: '10:00' },
  { id: 'j4', guru_id: 'g3', guru_nama: 'Andi Saputra', mata_pelajaran: 'IPS', kelas: 'Kelas III', hari: 'Rabu', jam_mulai: '07:30', jam_selesai: '08:30' },
  { id: 'j5', guru_id: 'g4', guru_nama: 'Dewi Rahayu', mata_pelajaran: 'PJOK', kelas: 'Kelas I & II', hari: 'Kamis', jam_mulai: '07:30', jam_selesai: '09:30' },
  { id: 'j6', guru_id: 'g5', guru_nama: 'Muhammad Rizky', mata_pelajaran: 'PAI', kelas: 'Kelas IV', hari: 'Jumat', jam_mulai: '07:30', jam_selesai: '08:30' },
];

export const mockKehadiran = [
  { id: 'k1', guru_id: 'g1', guru_nama: 'Siti Ahmad', tanggal: '2024-09-23', jam_masuk: '07:15', jam_keluar: '13:00', status: 'Hadir', keterangan: '' },
  { id: 'k2', guru_id: 'g2', guru_nama: 'Budi Santoso', tanggal: '2024-09-23', jam_masuk: '07:20', jam_keluar: '13:00', status: 'Hadir', keterangan: '' },
  { id: 'k3', guru_id: 'g3', guru_nama: 'Andi Saputra', tanggal: '2024-09-23', jam_masuk: null, jam_keluar: null, status: 'Sakit', keterangan: 'Demam' },
  { id: 'k4', guru_id: 'g4', guru_nama: 'Dewi Rahayu', tanggal: '2024-09-23', jam_masuk: '07:10', jam_keluar: '13:00', status: 'Hadir', keterangan: '' },
  { id: 'k5', guru_id: 'g5', guru_nama: 'Muhammad Rizky', tanggal: '2024-09-23', jam_masuk: null, jam_keluar: null, status: 'Izin', keterangan: 'Keperluan keluarga' },
];

export const mockLaporan = [
  { guru_nama: 'Siti Ahmad', nip: '198601012010012001', hadir: 18, sakit: 1, izin: 0, alpha: 0, total: 19 },
  { guru_nama: 'Budi Santoso', nip: '198903152012012002', hadir: 17, sakit: 0, izin: 2, alpha: 0, total: 19 },
  { guru_nama: 'Andi Saputra', nip: '199002201013011003', hadir: 15, sakit: 3, izin: 1, alpha: 0, total: 19 },
  { guru_nama: 'Dewi Rahayu', nip: '198512101011011004', hadir: 19, sakit: 0, izin: 0, alpha: 0, total: 19 },
  { guru_nama: 'Muhammad Rizky', nip: '199105251014012005', hadir: 12, sakit: 2, izin: 5, alpha: 0, total: 19 },
];

// Helper untuk mendapatkan inisial nama
export const getInitials = (nama) => {
  if (!nama) return '?';
  return nama.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

// Format tanggal Indo
export const formatTanggal = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatTanggalShort = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const getNowTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export const HARI_COLORS = {
  Senin: { bg: 'rgba(79,142,247,0.15)', color: '#4F8EF7' },
  Selasa: { bg: 'rgba(67,232,154,0.15)', color: '#43E89A' },
  Rabu: { bg: 'rgba(167,139,250,0.15)', color: '#A78BFA' },
  Kamis: { bg: 'rgba(251,146,60,0.15)', color: '#FB923C' },
  Jumat: { bg: 'rgba(248,113,113,0.15)', color: '#F87171' },
  Sabtu: { bg: 'rgba(129,140,248,0.15)', color: '#818CF8' },
};
