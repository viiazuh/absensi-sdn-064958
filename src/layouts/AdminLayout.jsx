import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function AdminLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="page-content fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
