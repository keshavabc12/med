import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminStock() {
  const [low, setLow] = useState([]);
  const [threshold, setThreshold] = useState(10);
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');

  const loadLow = async () => {
    const { data } = await api.get('/api/products/admin/low-stock', {
      admin: true,
      params: { threshold },
    });
    setLow(data.items || []);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadLow();
        const { data } = await api.get('/api/products', { admin: true, params: { limit: 200, includeInactive: true } });
        if (!cancelled) setRows(data.items || []);
      } catch {
        if (!cancelled) {
          setLow([]);
          setRows([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [threshold]);

  const updateStock = async (id, stock) => {
    setMsg('');
    try {
      await api.patch(`/api/products/${id}/stock`, { stock: Number(stock) }, { admin: true });
      setMsg('Stock updated');
      await loadLow();
      const { data } = await api.get('/api/products', { admin: true, params: { limit: 200, includeInactive: true } });
      setRows(data.items || []);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Stock</h1>
      <p className="mt-1 text-sm text-slate-400">Low-stock alerts and quick quantity updates</p>

      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm text-slate-300">Alert threshold</label>
        <input
          type="number"
          min={0}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value) || 0)}
          className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white"
        />
      </div>

      {msg && <p className="mt-3 text-sm text-emerald-400">{msg}</p>}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-amber-300">Low stock (≤ {threshold})</h2>
        {low.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No low-stock items.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {low.map((p) => (
              <li key={p._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-900/50 bg-amber-950/30 px-3 py-2 text-sm">
                <span className="text-slate-200">{p.name}</span>
                <span className="font-mono text-amber-200">stock {p.stock}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white">Update quantities</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-3 py-2 text-left text-xs uppercase text-slate-400">Product</th>
                <th className="px-3 py-2 text-left text-xs uppercase text-slate-400">Current</th>
                <th className="px-3 py-2 text-left text-xs uppercase text-slate-400">New</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              {rows.map((p) => (
                <StockRow key={`${p._id}-${p.stock}`} product={p} onSave={updateStock} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StockRow({ product, onSave }) {
  const [val, setVal] = useState(String(product.stock));
  return (
    <tr>
      <td className="px-3 py-2 text-slate-200">{product.name}</td>
      <td className="px-3 py-2 text-slate-400">{product.stock}</td>
      <td className="px-3 py-2">
        <input
          type="number"
          min={0}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-24 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-white"
        />
      </td>
      <td className="px-3 py-2 text-right">
        <button
          type="button"
          onClick={() => onSave(product._id, val)}
          className="text-brand-400 hover:underline"
        >
          Save
        </button>
      </td>
    </tr>
  );
}
