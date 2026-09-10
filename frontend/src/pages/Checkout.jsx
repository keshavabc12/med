import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { formatINR } from '../utils/formatPrice';

function CheckoutInner() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [payment, setPayment] = useState('cod');
  const [address, setAddress] = useState(user?.address || '');
  const [mockPaid, setMockPaid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (user?.address) setAddress((a) => a || user.address);
  }, [user]);

  const placeOrder = async () => {
    setErr('');
    setLoading(true);
    try {
      const payload = {
        items: items.map((x) => ({ productId: x.productId, quantity: x.quantity })),
        paymentMethod: payment,
        shippingAddress: address,
        mockPaymentSuccess: payment === 'online' ? mockPaid : undefined,
      };
      const { data } = await api.post('/api/orders', payload);
      clear();
      const id = data?._id || data?.id;
      if (id) {
        navigate(`/track-order?orderId=${id}`, { replace: true });
      } else {
        navigate('/orders', { replace: true });
      }
    } catch (e) {
      setErr(e.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
        <p className="text-slate-600">Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block font-bold text-brand-700 hover:underline">
          Browse catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg pb-12">
      <h1 className="font-display text-3xl font-bold text-brand-950">Checkout</h1>
      <p className="mt-2 text-lg text-slate-600">
        Order total: <span className="font-display font-bold text-brand-900">{formatINR(total)}</span>
      </p>

      <div className="mt-8 space-y-5 rounded-3xl border border-brand-200/50 bg-white/95 p-7 shadow-xl">
        <div>
          <label className="text-sm font-semibold text-brand-900">Shipping address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
            required
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-900">Payment</p>
          <div className="mt-3 space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm hover:border-brand-300">
              <input type="radio" name="pay" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
              Cash on delivery (INR)
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm hover:border-brand-300">
              <input type="radio" name="pay" checked={payment === 'online'} onChange={() => setPayment('online')} />
              Online payment (mock, INR)
            </label>
          </div>
        </div>

        {payment === 'online' && (
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-amber-950">
            <p className="font-semibold">Simulate gateway</p>
            <label className="mt-2 flex items-center gap-2">
              <input type="checkbox" checked={mockPaid} onChange={(e) => setMockPaid(e.target.checked)} />
              Payment succeeds (marks order as paid)
            </label>
          </div>
        )}

        {err && <p className="text-sm font-semibold text-red-600">{err}</p>}

        <button
          type="button"
          disabled={loading || !address.trim()}
          onClick={placeOrder}
          className="w-full rounded-2xl bg-gradient-to-r from-brand-600 to-brand-900 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-brand-500 hover:to-brand-800 disabled:opacity-50"
        >
          {loading ? 'Placing order…' : `Place order — ${formatINR(total)}`}
        </button>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutInner />
    </ProtectedRoute>
  );
}
