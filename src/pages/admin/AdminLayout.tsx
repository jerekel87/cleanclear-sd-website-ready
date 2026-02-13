import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems: Array<{ to: string; icon: typeof Users; label: string }> = [
  { to: '/admin/leads', icon: Users, label: 'Leads' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy-900 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-white/10 space-y-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-5 h-5 flex-shrink-0" />
              View Website
            </a>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-navy-900 leading-none">Admin</p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-navy-900 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
