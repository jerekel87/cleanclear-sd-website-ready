import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminHeader />
      <main className="w-full max-w-site mx-auto px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
