import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useCatalog } from '../../context/CatalogContext';
import { COMPANY_NAME } from '../../constants/branding';

const CATEGORIES = ['medicine', 'healthcare', 'vitamins', 'personal-care', 'devices'];

const empty = {
  name: '',
  description: '',
  price: '',
  costPrice: '',
  category: 'medicine',
  stock: '',
  sku: '',
  isActive: true,
};

export default function AdminProductForm() {
  const { productId } = useParams();
  const isNew = productId === 'new';
  const navigate = useNavigate();
  const { bumpCatalog } = useCatalog();
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/api/products/${productId}`, { admin: true });
        if (cancelled) return;
        setForm({
          name: data.name || '',
          description: data.description || '',
          price: String(data.price ?? ''),
          costPrice: String(data.costPrice ?? '0'),
          category: data.category || 'medicine',
          stock: String(data.stock ?? ''),
          sku: data.sku || '',
          isActive: !!data.isActive,
        });
      } catch {
        if (!cancelled) setErr('Product not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, isNew]);

  const change = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('costPrice', form.costPrice === '' ? '0' : form.costPrice);
    fd.append('category', form.category);
    fd.append('stock', form.stock);
    fd.append('sku', form.sku);
    fd.append('isActive', String(form.isActive));
    // documentUrl will be set by backend if a PDF is uploaded
    if (file) fd.append('image', file);
    if (docFile) fd.append('document', docFile);

    try {
      if (isNew) {
        await api.post('/api/products', fd, { admin: true });
      } else {
        await api.put(`/api/products/${productId}`, fd, { admin: true });
      }
      bumpCatalog();
      navigate('/admin/products');
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Save failed');
    }
  };

  if (loading) return <p className="text-slate-400">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/admin/products" className="text-sm font-semibold text-teal-400 hover:underline">
        ← Products
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold text-white">{isNew ? 'Add product' : 'Edit product'}</h1>
      <p className="mt-1 text-sm text-slate-500">
        Rich descriptions show on the storefront. Cost price powers profit on the dashboard.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-xl">
        <div>
          <label className="text-sm font-semibold text-slate-300">Product name</label>
          <input
            required
            value={form.name}
            onChange={change('name')}
            className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-300">Full description</label>
          <p className="mt-0.5 text-xs text-slate-500">Shown on the product page — ingredients, usage, warnings, etc.</p>
          <textarea
            rows={10}
            value={form.description}
            onChange={change('description')}
            placeholder="Write a detailed description for customers…"
            className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm leading-relaxed text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-300">Selling price (INR)</label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={change('price')}
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300">Cost price (INR)</label>
            <p className="mt-0.5 text-xs text-slate-500">Your buy cost — used for profit charts</p>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.costPrice}
              onChange={change('costPrice')}
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-300">Stock units</label>
            <input
              required
              type="number"
              min={0}
              value={form.stock}
              onChange={change('stock')}
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300">Category</label>
            <select
              value={form.category}
              onChange={change('category')}
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-300">SKU</label>
          <input
            value={form.sku}
            onChange={change('sku')}
            className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-300">Product image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-2 w-full text-sm text-slate-400"
          />
          {!isNew && (
            <p className="mt-2 text-xs text-slate-500">Leave empty to keep the current image.</p>
          )}
          <label className="mt-4 text-sm font-semibold text-slate-300">Product document (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setDocFile(e.target.files?.[0] || null)}
            className="mt-2 w-full text-sm text-slate-400"
          />
          {!isNew && (
            <p className="mt-2 text-xs text-slate-500">Leave empty to keep the current document.</p>
          )}
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
          <input type="checkbox" checked={form.isActive} onChange={change('isActive')} className="rounded border-slate-600" />
          Active (visible on {COMPANY_NAME} storefront)
        </label>
        {err && <p className="text-sm font-medium text-red-400">{err}</p>}
        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-teal-800 py-3.5 text-sm font-bold text-white shadow-lg"
        >
          Save & publish to storefront
        </button>
      </form>
    </div>
  );
}
