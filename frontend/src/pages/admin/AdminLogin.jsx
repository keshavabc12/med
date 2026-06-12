import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { COMPANY_NAME } from '../../constants/branding';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-brand-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-teal-800/40 bg-slate-900/90 p-8 shadow-2xl shadow-black/40 backdrop-blur sm:p-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-teal-400">{COMPANY_NAME}</p>
        <h1 className="mt-3 text-center font-display text-2xl font-bold text-white">Staff login</h1>
        <p className="mt-2 text-center text-sm text-slate-400">Separate from customer accounts. Admin credentials only.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-300" htmlFor="aemail">
              Email
            </label>
            <input
              id="aemail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300" htmlFor="apw">
              Password
            </label>
            <input
              id="apw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          {err && <p className="text-sm font-semibold text-red-400">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-brand-800 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-900/40 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Enter console'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500">
          <Link to="/" className="font-semibold text-teal-300 hover:text-white hover:underline">
            ← Back to storefront
          </Link>
        </p>
      </div>
    </div>
  );
}
