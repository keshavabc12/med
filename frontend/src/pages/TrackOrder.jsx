import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatPrice';

const STEPS = [
  { key: 'pending', label: 'Order placed', desc: 'We received your order and are preparing it.' },
  { key: 'shipped', label: 'Shipped', desc: 'Your package is on the way.' },
  { key: 'delivered', label: 'Delivered', desc: 'Order completed. Thank you for shopping with us.' },
];

function stepActiveIndex(status) {
  if (status === 'cancelled') return -1;
  const i = STEPS.findIndex((s) => s.key === status);
  return i >= 0 ? i : 0;
}

export default function TrackOrder() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId')?.trim() || '';

  const [orderIdInput, setOrderIdInput] = useState(orderIdFromUrl);
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const trackById = async (rawId) => {
    const id = (rawId || '').trim();
    if (!id) {
      setErr('Please paste your order ID.');
      setOrder(null);
      return;
    }
    setErr('');
    setLoading(true);
    setOrder(null);
    try {
      const { data } = await api.get(`/api/orders/my/${id}`);
      setOrder(data);
      setSearchParams({ orderId: id }, { replace: true });
    } catch (e) {
      setErr(e.response?.data?.message || 'Order not found. Check the ID or sign in with the account that placed it.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderIdFromUrl) setOrderIdInput(orderIdFromUrl);
  }, [orderIdFromUrl]);

  useEffect(() => {
    if (!user || !orderIdFromUrl) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr('');
      setOrder(null);
      try {
        const { data } = await api.get(`/api/orders/my/${orderIdFromUrl}`);
        if (!cancelled) setOrder(data);
      } catch (e) {
        if (!cancelled) {
          setErr(e.response?.data?.message || 'Could not load order');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, orderIdFromUrl]);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg pb-12">
        <h1 className="font-display text-3xl font-bold text-brand-950">Track your order</h1>
        <p className="mt-3 text-slate-600">
          Sign in with the same account you used at checkout. Your order ID was shown after placing the order and in
          your email confirmation (demo: check the Orders page).
        </p>
        <Link
          to="/login"
          state={{ from: '/track-order' }}
          className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-brand-600 to-brand-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg"
        >
          Log in to track
        </Link>
        <p className="mt-6 text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-bold text-brand-700 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    );
  }

  const activeIdx = order ? stepActiveIndex(order.status) : -1;

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <h1 className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">Track your order</h1>
      <p className="mt-2 text-slate-600">
        Enter the order ID from your confirmation (MongoDB ObjectId). You can also open this page right after checkout
        — we redirect you here automatically.
      </p>

      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          trackById(orderIdInput);
        }}
      >
        <div className="flex-1">
          <label htmlFor="oid" className="text-sm font-semibold text-brand-900">
            Order ID
          </label>
          <input
            id="oid"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            placeholder="e.g. 674a1b2c3d4e5f6789abcdef"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 font-mono text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-50"
        >
          {loading ? 'Looking up…' : 'Track'}
        </button>
      </form>

      {err && !loading && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{err}</p>
      )}

      {order && (
        <div className="mt-10 space-y-8">
          <div className="rounded-2xl border border-brand-200/60 bg-white/95 p-6 shadow-lg">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Order</p>
                <p className="mt-1 font-mono text-sm text-slate-800">{order._id}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Placed {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Total</p>
                <p className="mt-1 font-display text-2xl font-bold text-brand-900">{formatINR(order.total)}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {order.paymentMethod?.toUpperCase()} · {order.paymentStatus}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Ship to:</span> {order.shippingAddress || '—'}
            </p>
          </div>

          {order.status === 'cancelled' ? (
            <div className="rounded-2xl border border-amber-300/80 bg-amber-50 p-6 text-amber-950">
              <p className="font-display text-lg font-bold">Order cancelled</p>
              <p className="mt-2 text-sm">This order is no longer active. Contact support if this looks wrong.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-md">
              <p className="text-sm font-bold uppercase tracking-widest text-brand-600">Status</p>
              <ol className="mt-6 space-y-0">
                {STEPS.map((step, idx) => {
                  const done = idx < activeIdx;
                  const current = idx === activeIdx;
                  return (
                    <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                      {idx < STEPS.length - 1 && (
                        <span
                          className={`absolute left-[15px] top-8 h-[calc(100%-0.5rem)] w-0.5 ${
                            done || current ? 'bg-brand-500' : 'bg-slate-200'
                          }`}
                          aria-hidden
                        />
                      )}
                      <span
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          done
                            ? 'bg-brand-600 text-white'
                            : current
                              ? 'bg-accent-400 text-brand-950 ring-4 ring-accent-400/30'
                              : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {done ? '✓' : idx + 1}
                      </span>
                      <div>
                        <p className={`font-semibold ${current ? 'text-brand-900' : 'text-slate-800'}`}>{step.label}</p>
                        <p className="mt-1 text-sm text-slate-600">{step.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Items</p>
            <ul className="mt-3 space-y-2 text-sm">
              {order.items?.map((it, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>
                    {it.name} × {it.quantity}
                  </span>
                  <span className="font-medium text-brand-900">{formatINR(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/orders" className="text-sm font-bold text-brand-700 hover:underline">
              ← All orders
            </Link>
            <Link to="/products" className="text-sm font-bold text-brand-700 hover:underline">
              Continue shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
