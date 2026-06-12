import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mediaUrl } from '../../services/api';
import { formatINR } from '../../utils/formatPrice';
import { useCatalog } from '../../context/CatalogContext';

export default function AdminProducts() {
  const { bumpCatalog } = useCatalog();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/products', {
        admin: true,
        params: { limit: 200, includeInactive: true },
      });
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deactivate = async (id) => {
    if (!window.confirm('Hide this product from the storefront? (You can re-activate by editing it.)')) return;
    try {
      await api.delete(`/api/products/${id}`, { admin: true });
      bumpCatalog();
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed');
    }
  };

  const deleteForever = async (id) => {
    if (
      !window.confirm(
        'Permanently delete this product from the database? This cannot be undone. Historical orders keep line snapshots.'
      )
    ) {
      return;
    }
    try {
      await api.delete(`/api/products/${id}?permanent=true`, { admin: true });
      bumpCatalog();
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-slate-400">Add, edit, hide, or remove — storefront refreshes automatically</p>
        </div>
        <Link
          to="/admin/products/new"
          className="rounded-2xl bg-gradient-to-r from-teal-500 to-teal-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg"
        >
          + Add product
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-700/80 shadow-xl">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/90">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Product</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">Description</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">Category</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">Price</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/80">
              {items.map((p) => (
                <tr key={p._id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={mediaUrl(p.image)} alt="" className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-700" />
                      <span className="max-w-[160px] font-medium text-slate-100">{p.name}</span>
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-500">
                    <span className="line-clamp-3 text-xs leading-relaxed">{p.description || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{p.category}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-200">{formatINR(p.price)}</td>
                  <td className="px-4 py-3 text-slate-200">{p.stock}</td>
                  <td className="px-4 py-3">
                    {p.isActive ? (
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-600/40 px-2.5 py-1 text-xs text-slate-400">Hidden</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link to={`/admin/products/${p._id}`} className="font-semibold text-teal-400 hover:underline">
                      Edit
                    </Link>
                    {p.isActive && (
                      <button
                        type="button"
                        onClick={() => deactivate(p._id)}
                        className="ml-3 font-semibold text-amber-400 hover:underline"
                      >
                        Hide
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteForever(p._id)}
                      className="ml-3 font-semibold text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
