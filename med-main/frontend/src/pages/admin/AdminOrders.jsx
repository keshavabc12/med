import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatINR } from '../../utils/formatPrice';

const STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/orders', { admin: true });
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/api/orders/${id}/status`, { status }, { admin: true });
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <p className="text-slate-400">Loading orders…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Orders</h1>
      <p className="mt-1 text-sm text-slate-400">Update fulfillment status</p>

      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs text-slate-500">{o._id}</p>
              <select
                value={o.status}
                onChange={(e) => setStatus(o._id, e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {new Date(o.createdAt).toLocaleString()} · {o.user?.name} ({o.user?.email}) · {o.paymentMethod?.toUpperCase()}{' '}
              · pay: {o.paymentStatus}
            </p>
            <ul className="mt-2 text-sm text-slate-300">
              {o.items?.map((it, i) => (
                <li key={i}>
                  {it.name} × {it.quantity}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-semibold text-brand-300">{formatINR(o.total)}</p>
            <p className="mt-1 text-xs text-slate-500">Ship to: {o.shippingAddress}</p>
          </div>
        ))}
      </div>

      {orders.length === 0 && <p className="mt-8 text-slate-500">No orders yet.</p>}
    </div>
  );
}
