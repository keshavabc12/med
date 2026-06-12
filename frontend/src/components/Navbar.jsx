import { Link, NavLink } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // auth removed
// import { useCart } from '../context/CartContext';
import { COMPANY_NAME } from '../constants/branding';

const linkClass = ({ isActive }) =>
  `px-4 py-2 rounded-xl text-base font-bold transition ${isActive
    ? 'bg-brand-700 text-white shadow-md shadow-brand-700/25'
    : 'text-slate-700 hover:bg-white/80 hover:text-brand-800'
  }`;

export default function Navbar() {
  // Auth removed
  // useCart removed

  return (
    <header className="sticky top-0 z-40 border-b border-teal-900/10 bg-white/85 shadow-sm shadow-teal-900/5 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4">
        <Link to="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="flex h-10 sm:h-12 w-auto shrink-0 items-center justify-center rounded-xl border-2 border-brand-200 overflow-hidden shadow-sm transition group-hover:border-brand-400 bg-white">
            {/* Make sure to save your image as 'logo-full.jpeg' inside frontend/public */}
            <img src="/logo.jpg" alt={COMPANY_NAME} className="h-full w-auto object-contain bg-white" />
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-display text-sm sm:text-[1.05rem] font-bold text-brand-900 leading-none truncate">{COMPANY_NAME}</span>
            <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-teal-600/80 uppercase mt-0.5 truncate">Wellness & Care</span>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>

        </nav>

        <div className="flex shrink-0 items-center gap-2">

        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-t border-teal-900/5 bg-white/70 px-2 py-2 lg:hidden">
        <NavLink to="/" className={linkClass} end>
          Home
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
        <NavLink to="/contact" className={linkClass}>
          Contact
        </NavLink>

      </div>
    </header>
  );
}
