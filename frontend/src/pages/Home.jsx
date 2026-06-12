import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mediaUrl } from '../services/api';
import { useCatalog } from '../context/CatalogContext';
import { formatINR } from '../utils/formatPrice';
import { COMPANY_NAME, COMPANY_TAGLINE } from '../constants/branding';

const CATEGORIES = [
  { id: 'medicine', label: 'Medicines', desc: 'OTC & prescription support items' },
  { id: 'vitamins', label: 'Vitamins', desc: 'Daily nutrition & immunity' },
  { id: 'healthcare', label: 'Healthcare', desc: 'Monitoring & wellness' },
];

export default function Home() {
  const { catalogVersion } = useCatalog();
  const [featured, setFeatured] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/api/products', { params: { limit: 6 } });
        if (!cancelled) setFeatured(data.items || []);
      } catch (e) {
        if (!cancelled) setErr(e.response?.data?.message || 'Could not load products. Is the API running?');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [catalogVersion]);

  return (
    <div className="space-y-20 pb-8">
      {/* Hero — scroll down CTA */}
      <section
        id="top"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-950 p-8 text-white shadow-2xl shadow-brand-900/40 ring-1 ring-white/10 md:p-14 lg:p-16"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-300">{COMPANY_NAME}</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] text-balance sm:text-5xl lg:text-6xl">
            {COMPANY_TAGLINE}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-teal-100/95 sm:text-lg">
            Scroll to explore categories and curated picks — medicines, vitamins, devices, and personal care with simple
            checkout and order history.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
          </div>
          <a
            href="#categories"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-amber-200/90 transition hover:text-white"
          >
            Scroll to explore
            <span className="inline-block animate-bounce text-lg" aria-hidden>
              ↓
            </span>
          </a>
        </div>
      </section>

      {/* Trust strip — adds vertical rhythm for scrolling */}
      <section className="grid gap-4 rounded-2xl border border-brand-200/60 bg-white/80 p-6 shadow-sm backdrop-blur sm:grid-cols-3 sm:p-8">
        {[
          { t: 'Verified catalogue', d: 'Clear categories & stock visibility' },
          { t: 'Secure accounts', d: 'JWT login for customers & staff' },
          { t: 'Order tracking', d: 'History & fulfilment at a glance' },
        ].map((x) => (
          <div key={x.t} className="text-center sm:text-left">
            <p className="font-semibold text-brand-900">{x.t}</p>
            <p className="mt-1 text-sm text-slate-600">{x.d}</p>
          </div>
        ))}
      </section>

      <section id="categories" className="scroll-mt-28">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-3xl font-bold text-brand-950">Shop by category</h2>
          <a href="#featured" className="text-sm font-semibold text-brand-700 hover:underline">
            Jump to featured ↓
          </a>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.id}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/10"
            >
              <span className="absolute right-4 top-4 h-12 w-12 rounded-full bg-brand-100 opacity-0 transition group-hover:opacity-100" />
              <p className="font-display text-xl font-semibold text-brand-800">{c.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.desc}</p>
              <span className="mt-4 inline-block text-sm font-bold text-accent-600 group-hover:text-accent-500">
                Browse →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="featured" className="scroll-mt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-brand-950">Featured for you</h2>
            <p className="mt-1 text-slate-600">Hand-picked essentials from our catalogue</p>
          </div>
          <Link
            to="/products"
            className="rounded-full bg-brand-700 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:bg-brand-800"
          >
            View all products
          </Link>
        </div>
        {err && <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-900">{err}</p>}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p._id}
              to={`/products/${p._id}`}
              className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md transition hover:border-brand-300 hover:shadow-lg"
            >
              <img src={mediaUrl(p.image)} alt="" className="max-w-full max-h-[150px] object-contain mx-auto" />
              <div className="min-w-0 flex-1 flex flex-col">
                <p className="line-clamp-2 font-semibold text-slate-900">{p.name}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-600/80">
                  {p.category?.replace('-', ' ')}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600 flex-grow">{p.description}</p>
                <p className="mt-2 text-lg font-bold text-brand-800">{formatINR(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-r from-brand-900 to-slate-900 px-8 py-12 text-center text-white shadow-xl">
        <p className="font-display text-2xl font-bold sm:text-3xl">View Products</p>
        <p className="mx-auto mt-3 max-w-lg text-sm text-teal-100/90">
          Browse our curated selection of medicines, vitamins, devices, and personal care items.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/products" className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-brand-900 hover:bg-amber-50">
            View products
          </Link>
          <a
            href="#top"
            className="rounded-2xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Back to top
          </a>
        </div>
      </section>
    </div>
  );
}
