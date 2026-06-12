import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { mediaUrl } from '../services/api';
import { useCatalog } from '../context/CatalogContext';
import { formatINR } from '../utils/formatPrice';

const CATS = [
  { value: 'all', label: 'All' },
  { value: 'medicine', label: 'Medicines' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'vitamins', label: 'Vitamins' },
  { value: 'personal-care', label: 'Personal care' },
  { value: 'devices', label: 'Devices' },
];

export default function Products() {
  const { catalogVersion } = useCatalog();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || 'all';
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/products', {
          params: { q: q || undefined, category: category === 'all' ? undefined : category, limit: 24 },
        });
        if (!cancelled) {
          setItems(data.items || []);
          setTotal(data.total ?? 0);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q, category, catalogVersion]);

  const submitSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (searchInput.trim()) next.set('q', searchInput.trim());
    else next.delete('q');
    setParams(next);
  };

  return (
    <div className="pb-12">
      <div className="rounded-3xl border border-brand-200/50 bg-white/90 p-6 shadow-lg shadow-brand-900/5 backdrop-blur sm:p-8">
        <h1 className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">Products</h1>
        <p className="mt-2 text-slate-600">
          Search and filter — <span className="font-semibold text-brand-800">{total}</span> items · prices in INR
        </p>

        <form onSubmit={submitSearch} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="search" className="text-sm font-semibold text-brand-900">
              Search
            </label>
            <input
              id="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Name, SKU, description…"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm shadow-inner transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition hover:from-brand-500 hover:to-brand-700"
          >
            Search
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                const next = new URLSearchParams(params);
                if (c.value === 'all') next.delete('category');
                else next.set('category', c.value);
                setParams(next);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                (category === 'all' && c.value === 'all') || category === c.value
                  ? 'bg-brand-800 text-white shadow-md'
                  : 'bg-slate-100 text-slate-800 hover:bg-brand-100 hover:text-brand-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-14 text-center font-medium text-slate-500">Loading catalogue…</p>
      ) : (
        <div className="mt-10 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <Link
              key={p._id}
              to={`/products/${p._id}`}
              className="group overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-md transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-900/10"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-brand-50">
                <img
                  src={mediaUrl(p.image)}
                  alt=""
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col h-full">
                <p className="line-clamp-2 font-semibold text-slate-900 group-hover:text-brand-800">{p.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-600/80">{p.category}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 flex-grow">{p.description}</p>
                <p className="mt-3 font-display text-xl font-bold text-brand-900">{formatINR(p.price)}</p>
                <p className="mt-1 text-xs text-slate-500">In stock: {p.stock}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <p className="mt-14 text-center text-slate-500">No products match your filters.</p>
      )}
    </div>
  );
}
