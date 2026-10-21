import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import AnimatedNumber from '../components/AnimatedNumber';
import { formatPrice } from '../utils/format';
import { FREE_SHIPPING_THRESHOLD, TAX_RATE } from '../config';

export default function Cart() {
  const { items, itemCount, subtotal, shipping, tax, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Container className="page">
        <div className="state state--big">
          <i className="bi bi-bag state__icon" />
          <h1>Your cart is empty</h1>
          <p>Add a few things you love and they will show up here.</p>
          <Link to="/products" className="btn btn-gold btn-lg">Start shopping</Link>
        </div>
      </Container>
    );
  }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Container className="page">
      <header className="page__head page__head--row">
        <h1>Your cart <span className="muted">({itemCount})</span></h1>
        <button className="link-btn" onClick={clearCart}><i className="bi bi-trash3" /> Clear cart</button>
      </header>

      <div className="row g-4">
        <div className="col-lg-8">
          <ul className="cart-list">
            <AnimatePresence initial={false}>
              {items.map((item) => <CartItem key={item.id} item={item} />)}
            </AnimatePresence>
          </ul>
        </div>

        <aside className="col-lg-4" aria-label="Order summary">
          <div className="summary">
            <h2>Order summary</h2>
            <div className="ship-meter">
              <p className="mb-2">
                {remaining > 0
                  ? <>Add <strong>{formatPrice(remaining)}</strong> more for free delivery.</>
                  : <strong><i className="bi bi-patch-check-fill" /> You’ve unlocked free delivery.</strong>}
              </p>
              <div className="ship-meter__bar"><motion.span initial={false} animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></div>
            </div>
            <dl>
              <div><dt>Subtotal</dt><dd><AnimatedNumber value={subtotal} format={formatPrice} /></dd></div>
              <div><dt>Delivery</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
              <div><dt>Tax estimate ({Math.round(TAX_RATE * 100)}%)</dt><dd><AnimatedNumber value={tax} format={formatPrice} /></dd></div>
              <div className="summary__total"><dt>Total</dt><dd><AnimatedNumber value={total} format={formatPrice} /></dd></div>
            </dl>
            <button className="btn btn-gold btn-lg w-100" disabled title="Checkout connects to the Phase 4 backend">Checkout coming soon</button>
            <Link to="/products" className="text-link text-center">Continue shopping</Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}
