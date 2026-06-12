import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { mediaUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatPrice';

export default function Cart() {
  const { items, setQty, removeItem, total } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-brand-200/60 bg-white/95 p-12 text-center shadow-xl">
        <h1 className="font-display text-2xl font-bold text-brand-950">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Browse the catalogue and add items — all prices in INR.</p>
        <Link
          to="/products"
          className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-brand-600 to-brand-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <h1 className="font-display text-3xl font-bold text-brand-950">Shopping cart</h1>
      <p className="mt-2 text-slate-600">Review items before checkout (INR)</p>
      <div className="mt-8 space-y-4">
        {items.map((line) => (
          <div
            key={line.productId}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md sm:flex-row sm:items-center"
          >
            <img src={mediaUrl(line.image)} alt="" className="h-24 w-24 rounded-xl object-cover ring-1 ring-slate-100" />
            <div className="min-w-0 flex-1">
              <Link
                to={`/products/${line.productId}`}
                className="font-semibold text-slate-900 hover:text-brand-800"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-slate-500">{formatINR(line.price)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={line.quantity}
                onChange={(e) => setQty(line.productId, e.target.value)}
                className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => removeItem(line.productId)}
                className="text-sm font-bold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <p className="text-right font-display text-lg font-bold text-brand-900 sm:w-32">
              {formatINR(line.price * line.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-end gap-4 rounded-2xl border border-brand-200/50 bg-gradient-to-br from-brand-50 to-white p-6 sm:p-8">
        <p className="text-xl text-slate-800">
          Total: <span className="font-display text-2xl font-bold text-brand-900">{formatINR(total)}</span>
        </p>
        {user ? (
          <Link
            to="/checkout"
            className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-900 px-10 py-3.5 text-sm font-bold text-white shadow-lg"
          >
            Proceed to checkout
          </Link>
        ) : (
          <p className="text-sm text-slate-600">
            <Link to="/login" className="font-bold text-brand-700 hover:underline">
              Log in
            </Link>{' '}
            to place an order.
          </p>
        )}
      </div>
    </div>
  );
}
