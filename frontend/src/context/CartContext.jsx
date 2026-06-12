import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CART_KEY = 'pharma_cart_v1';

const CartContext = createContext(null);

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const id = product._id || product.id;
      const idx = prev.findIndex((x) => x.productId === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [
        ...prev,
        {
          productId: id,
          name: product.name,
          price: product.price,
          image: product.image || '',
          quantity: qty,
          stock: product.stock,
        },
      ];
    });
  };

  const setQty = (productId, quantity) => {
    const q = Math.max(1, Number(quantity) || 1);
    setItems((prev) => prev.map((x) => (x.productId === productId ? { ...x, quantity: q } : x)));
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  };

  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.quantity, 0),
    [items]
  );

  const count = useMemo(() => items.reduce((n, x) => n + x.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, setQty, removeItem, clear, total, count }),
    [items, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
