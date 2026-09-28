import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mengoper props isOpen & setIsOpen ke Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="main-content">
        {/* Mengoper fungsi onToggle ke Topbar supaya tombol hamburger bisa berfungsi */}
        <Topbar onToggle={() => setIsOpen(!isOpen)} />

        <main className="page-content fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}