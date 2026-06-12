import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { COMPANY_NAME } from '../../constants/branding';

const navCls = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
  }`;

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 border-r border-slate-800 bg-slate-900 p-4 md:block">
          <p className="font-display text-lg font-bold text-white">{COMPANY_NAME}</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-teal-400/90">Staff console</p>
          <p className="mt-1 truncate text-xs text-slate-400">{admin?.email}</p>
          <nav className="mt-6 space-y-1">
            <NavLink to="/admin/dashboard" className={navCls}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navCls}>
              Products
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 w-full rounded-lg border border-slate-600 py-2 text-sm hover:bg-slate-800"
          >
            Log out
          </button>
          <a href="/" className="mt-4 block text-center text-xs text-brand-300 hover:underline">
            ← Storefront
          </a>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 md:hidden">
            <span className="font-display text-sm font-bold text-white">CP</span>
            <button type="button" onClick={handleLogout} className="text-sm text-brand-300">
              Log out
            </button>
          </header>
          <div className="p-4 pb-24 md:p-8 md:pb-8">
            <Outlet />
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 flex border-t border-slate-800 bg-slate-900 p-2 md:hidden">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex-1 rounded-lg py-2 text-center text-xs font-medium ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `flex-1 rounded-lg py-2 text-center text-xs font-medium ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400'}`
          }
        >
          Products
        </NavLink>

      </nav>
    </div>
  );
}
