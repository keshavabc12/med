import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COMPANY_NAME } from '../constants/branding';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

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
    <div className="mx-auto max-w-md pb-12">
      <div className="rounded-3xl border border-brand-200/50 bg-white/95 p-8 shadow-2xl sm:p-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{COMPANY_NAME}</p>
        <h1 className="mt-3 text-center font-display text-3xl font-bold text-brand-950">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Staff?{' '}
          <Link to="/admin/login" className="font-bold text-brand-700 hover:underline">
            Admin login
          </Link>
        </p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-brand-900" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-900" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-brand-600 to-brand-900 py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{' '}
          <Link to="/register" className="font-bold text-brand-700 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
