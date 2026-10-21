import { Link } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import { AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import AnimatedNumber from './AnimatedNumber';
import { formatPrice } from '../utils/format';

export default function MiniCart() {
  const { items, itemCount, subtotal, drawerOpen, closeDrawer } = useCart();

  return (
    <Offcanvas show={drawerOpen} onHide={closeDrawer} placement="end" className="nest-drawer">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Your cart <span className="muted">({itemCount})</span></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        {items.length === 0 ? (
          <div className="state state--plain my-auto">
            <i className="bi bi-bag state__icon" />
            <h3>Nothing here yet</h3>
            <p>Add something you love and it will appear here.</p>
            <Link to="/products" className="btn btn-gold" onClick={closeDrawer}>Browse the shop</Link>
          </div>
        ) : (
          <>
            <ul className="cart-list flex-grow-1">
              <AnimatePresence initial={false}>
                {items.map((item) => <CartItem key={item.id} item={item} compact />)}
              </AnimatePresence>
            </ul>
            <div className="drawer-foot">
              <div className="d-flex justify-content-between align-items-baseline">
                <span className="muted">Subtotal</span>
                <strong className="drawer-foot__total"><AnimatedNumber value={subtotal} format={formatPrice} /></strong>
              </div>
              <p className="muted small mb-3">Delivery and tax are calculated on the cart page.</p>
              <Link to="/cart" className="btn btn-gold w-100" onClick={closeDrawer}>View cart and checkout</Link>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
