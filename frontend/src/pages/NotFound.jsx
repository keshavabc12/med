import { Link } from 'react-router-dom';
import { COMPANY_NAME } from '../constants/branding';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">{COMPANY_NAME}</p>
      <h1 className="mt-4 font-display text-7xl font-bold text-brand-950">404</h1>
      <p className="mt-4 max-w-md text-lg text-slate-600">This page isn&apos;t in our catalogue.</p>
      <Link
        to="/"
        className="mt-10 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg"
      >
        Back home
      </Link>
    </div>
  );
}
