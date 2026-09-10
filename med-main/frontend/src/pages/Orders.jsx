import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import { formatINR } from '../utils/formatPrice';

function OrdersInner() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/api/orders/my');
        if (!cancelled) setOrders(data);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="py-12 text-center font-medium text-slate-500">Loading orders…</p>;

  return (
    <div className="pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-950">Order history</h1>
          <p className="mt-2 text-slate-600">All amounts in INR · Track any order below</p>
        </div>
        <Link
          to="/track-order"
          className="inline-flex justify-center rounded-2xl border-2 border-brand-600 bg-white px-5 py-2.5 text-sm font-bold text-brand-800 shadow-sm hover:bg-brand-50"
        >
          Track an order
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
          No orders yet.
        </p>
      ) : (
        <ul className="mt-8 space-y-5">
          {orders.map((o) => (
            <li
              key={o._id}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md transition hover:border-brand-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs text-slate-500">{o._id}</p>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold capitalize text-brand-900">
                  {o.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {new Date(o.createdAt).toLocaleString()} · {o.paymentMethod?.toUpperCase()} · Payment: {o.paymentStatus}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {o.items?.map((it, i) => (
                  <li key={i}>
                    {it.name} × {it.quantity} — {formatINR(it.price * it.quantity)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-display text-lg font-bold text-brand-900">Total: {formatINR(o.total)}</p>
              <Link
                to={`/track-order?orderId=${o._id}`}
                className="mt-4 inline-flex text-sm font-bold text-brand-700 hover:text-brand-900 hover:underline"
              >
                Track this order →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Orders() {
  return (
    <ProtectedRoute>
      <OrdersInner />
    </ProtectedRoute>
  );
}
