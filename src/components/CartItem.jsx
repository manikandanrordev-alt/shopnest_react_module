import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function CartItem({ item, compact = false }) {
  const { updateQty, removeFromCart, closeDrawer, maxQty } = useCart();

  return (
    <motion.li
      layout
      className={`cart-item ${compact ? 'cart-item--compact' : ''}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60, height: 0, marginBottom: 0, paddingBlock: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
    >
      <Link to={`/products/${item.id}`} className="cart-item__media" onClick={closeDrawer}>
        <img src={item.image} alt="" />
      </Link>
      <div className="cart-item__info">
        <Link to={`/products/${item.id}`} className="cart-item__title" onClick={closeDrawer}>{item.title}</Link>
        <span className="muted">{formatPrice(item.price)} each</span>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="qty" role="group" aria-label={`Quantity for ${item.title}`}>
            <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease quantity"><i className="bi bi-dash" /></button>
            <output>{item.qty}</output>
            <button onClick={() => updateQty(item.id, item.qty + 1)} disabled={item.qty >= maxQty} aria-label="Increase quantity"><i className="bi bi-plus" /></button>
          </div>
          <button className="link-btn" onClick={() => removeFromCart(item.id)}><i className="bi bi-trash3" /> Remove</button>
        </div>
      </div>
      <strong className="cart-item__total">{formatPrice(item.price * item.qty)}</strong>
    </motion.li>
  );
}
