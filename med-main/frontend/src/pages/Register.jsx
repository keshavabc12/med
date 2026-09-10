import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COMPANY_NAME } from '../constants/branding';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (ex) {
      const msg = ex.response?.data?.message;
      const errs = ex.response?.data?.errors;
      setErr(errs?.map((x) => x.msg).join(', ') || msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pb-12">
      <div className="rounded-3xl border border-brand-200/50 bg-white/95 p-8 shadow-2xl sm:p-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{COMPANY_NAME}</p>
        <h1 className="mt-3 text-center font-display text-3xl font-bold text-brand-950">Create account</h1>
        <p className="mt-2 text-center text-sm text-slate-600">Shop in INR and track orders in one place.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold text-brand-900">Full name</label>
            <input
              required
              value={form.name}
              onChange={change('name')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-900">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={change('email')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-900">Password (min 6)</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={change('password')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-900">Phone</label>
            <input
              value={form.phone}
              onChange={change('phone')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-900">Default address</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={change('address')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-brand-600 to-brand-900 py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
