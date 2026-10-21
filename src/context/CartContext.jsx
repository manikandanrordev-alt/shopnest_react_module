import { createContext, useContext, useEffect, useMemo, useReducer, useState, useCallback } from 'react';
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../config';

const CartContext = createContext(null);
const STORAGE_KEY = 'shopnest.cart.v1';
const MAX_QTY = 10;

const clamp = (n) => Math.max(1, Math.min(MAX_QTY, n));

const reducer = (items, action) => {
  switch (action.type) {
    case 'add': {
      const { product, qty } = action;
      const exists = items.find((i) => i.id === product.id);
      if (exists) {
        return items.map((i) => (i.id === product.id ? { ...i, qty: clamp(i.qty + qty) } : i));
      }
      return [...items, { ...product, qty: clamp(qty) }];
    }
    case 'setQty':
      return items.map((i) => (i.id === action.id ? { ...i, qty: clamp(action.qty) } : i));
    case 'remove':
      return items.filter((i) => i.id !== action.id);
    case 'clear':
      return [];
    default:
      return items;
  }
};

const loadInitial = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], loadInitial);
  const [notice, setNotice] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const addToCart = useCallback((product, qty = 1) => {
    dispatch({ type: 'add', product, qty });
    setNotice({ id: Date.now(), title: product.title, image: product.image });
  }, []);
  const removeFromCart = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const updateQty = useCallback((id, qty) => dispatch({ type: 'setQty', id, qty }), []);
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), []);
  const dismissNotice = useCallback(() => setNotice(null), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = subtotal * TAX_RATE;
    return {
      items, itemCount, subtotal, shipping, tax,
      total: subtotal + shipping + tax,
      maxQty: MAX_QTY,
      notice, drawerOpen, openDrawer, closeDrawer,
      addToCart, removeFromCart, updateQty, clearCart, dismissNotice,
    };
  }, [items, notice, drawerOpen, openDrawer, closeDrawer, addToCart, removeFromCart, updateQty, clearCart, dismissNotice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
