import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { mediaUrl } from '../services/api';
// Cart removed
import { useCatalog } from '../context/CatalogContext';
import { formatINR } from '../utils/formatPrice';

export default function ProductDetail() {
  const { id } = useParams();
  const { catalogVersion } = useCatalog();
  const [product, setProduct] = useState(null);
  const [err, setErr] = useState('');
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setErr('');
    (async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        if (!cancelled) setProduct(data);
      } catch {
        if (!cancelled) setErr('Product not found');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, catalogVersion]);

  if (err) {
    return (
      <div className="rounded-2xl border border-red-200/80 bg-red-50 p-8 text-red-900 shadow-sm">
        {err}.{' '}
        <Link to="/products" className="font-bold text-brand-800 underline">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return <p className="py-20 text-center font-medium text-slate-500">Loading…</p>;
  }



  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="flex justify-center items-center rounded-3xl border border-slate-200/90 bg-white shadow-xl ring-1 ring-slate-100">
                <img src={mediaUrl(product.image)} alt="" className="w-full h-auto object-contain" />
      </div>
      <div className="flex flex-col">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{product.category}</p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-brand-950 sm:text-4xl">{product.name}</h1>
        {product.description && (
  <div className="mt-5">
    {showFull ? (
      product.description.split('\n').map((para, i) => (
        <p key={i} className="text-lg leading-relaxed text-slate-600 mb-2">
          {para}
        </p>
      ))
    ) : (
      <p className="text-lg leading-relaxed text-slate-600">
        {product.description.split(' ').slice(0, 65).join(' ')}...
      </p>
    )}
    {product.description.split(' ').length > 65 && (
      <button
        className="mt-2 text-brand-600 hover:underline"
        onClick={() => setShowFull(!showFull)}
      >
        {showFull ? 'Read less' : 'Read more'}
      </button>
    )}
  </div>
)}
        {product.documentUrl && (
          <a
            href={mediaUrl(product.documentUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-5 py-3 text-brand-700 shadow-sm transition-all hover:bg-brand-100 hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-sm">View Product Document (PDF)</span>
          </a>
        )}
        <p className="mt-8 font-display text-4xl font-bold text-brand-900">
          {formatINR(product.price)}
        </p>



        {err && <p className="mt-4 text-sm font-bold text-red-600">{err}</p>}

        <Link
          to="/products"
          className="mt-auto pt-10 text-sm font-bold text-brand-700 hover:text-brand-900 hover:underline"
        >
          ← Back To Home
        </Link>
      </div>
    </div>
  );
}
