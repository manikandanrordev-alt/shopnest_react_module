import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import Rating from '../components/Rating';
import ProductGrid from '../components/ProductGrid';
import Reveal from '../components/Reveal';
import { formatPrice, titleCase } from '../utils/format';
import { FREE_SHIPPING_THRESHOLD } from '../config';

const TABS = ['Details', 'Delivery', 'Returns'];

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, loading, error, retry } = useProduct(id);
  const { data: all } = useProducts();
  const { addToCart, items, maxQty } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('Details');
  const [zoom, setZoom] = useState(null);

  const related = useMemo(
    () => (all ?? []).filter((p) => product && p.category === product.category && p.id !== product.id).slice(0, 4),
    [all, product]
  );

  if (loading) return <Container className="page"><Spinner label="Loading product…" /></Container>;
  if (error) {
    return (
      <Container className="page">
        <ErrorState message={error} onRetry={retry} />
        <p className="text-center mt-3"><Link to="/products" className="text-link">Back to all products</Link></p>
      </Container>
    );
  }

  const inCart = items.find((i) => i.id === product.id)?.qty ?? 0;

  const onAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const onZoomMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const tabText = {
    Details: product.description,
    Delivery: `Free standard delivery on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}. Orders are packed within one working day.`,
    Returns: 'Return any unused item within 30 days for a full refund. We cover the return label.',
  };

  return (
    <Container className="page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/products">Shop</Link>
        <i className="bi bi-chevron-right" aria-hidden="true" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{titleCase(product.category)}</Link>
      </nav>

      <section className="row g-4 g-xl-5">
        <div className="col-lg-6">
          <motion.div
            className="detail__media"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={onZoomMove}
            onMouseLeave={() => setZoom(null)}
          >
            <img
              src={product.image}
              alt={product.title}
              style={zoom ? { transform: 'scale(1.7)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
            <span className="detail__hint"><i className="bi bi-zoom-in" /> Hover to zoom</span>
          </motion.div>
        </div>

        <motion.div className="col-lg-6 detail__info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
          <span className="p-card__cat">{titleCase(product.category)}</span>
          <h1>{product.title}</h1>
          <Rating value={product.rating} count={product.ratingCount} />
          <p className="detail__price">{formatPrice(product.price)}</p>

          <div className="detail__buy">
            <div className="qty qty--lg" role="group" aria-label="Quantity">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity"><i className="bi bi-dash" /></button>
              <output>{qty}</output>
              <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Increase quantity"><i className="bi bi-plus" /></button>
            </div>
            <motion.button className="btn btn-gold btn-lg flex-grow-1" onClick={onAdd} whileTap={{ scale: 0.97 }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={added ? 'done' : 'add'} className="d-inline-flex align-items-center gap-2" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.18 }}>
                  {added ? <><i className="bi bi-check2-circle" /> Added</> : <><i className="bi bi-bag-plus" /> Add to cart · {formatPrice(product.price * qty)}</>}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
          {inCart > 0 && <p className="muted mb-0">{inCart} in your cart. <Link to="/cart" className="text-link">Review cart</Link></p>}

          <div className="tabs" role="tablist">
            {TABS.map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} className={`tabs__btn ${tab === t ? 'is-active' : ''}`} onClick={() => setTab(t)}>
                {t}
                {tab === t && <motion.span layoutId="tab-underline" className="tabs__line" />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={tab} className="muted tabs__panel" role="tabpanel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {tabText[tab]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </section>

      {related.length > 0 && (
        <section className="section pb-0">
          <Reveal className="section__head"><h2>You may also like</h2></Reveal>
          <ProductGrid products={related} />
        </section>
      )}
    </Container>
  );
}
