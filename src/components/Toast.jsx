import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { notice, dismissNotice } = useCart();
  return (
    <div className="toast-zone" aria-live="polite">
      <AnimatePresence>
        {notice && (
          <motion.div
            key={notice.id}
            className="nest-toast"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            <img src={notice.image} alt="" />
            <div className="nest-toast__text">
              <strong><i className="bi bi-check-circle-fill" /> Added to cart</strong>
              <span>{notice.title}</span>
            </div>
            <Link to="/cart" onClick={dismissNotice}>View cart</Link>
            <motion.span className="nest-toast__timer" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 3.5, ease: 'linear' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
