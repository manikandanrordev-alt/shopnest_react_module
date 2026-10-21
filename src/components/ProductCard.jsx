import { Link } from 'react-router-dom';
import { motion, useSpring } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice, titleCase } from '../utils/format';
import Rating from './Rating';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const rotateX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 9);
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 9);
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.article
      className="p-card"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="p-card__media">
        {product.rating >= 4.5 && <span className="p-card__badge"><i className="bi bi-award-fill" /> Top rated</span>}
        <Link to={`/products/${product.id}`} aria-label={`View ${product.title}`}>
          <img src={product.image} alt={product.title} loading="lazy" />
        </Link>
        <button className="p-card__quick" onClick={() => addToCart(product)} aria-label={`Add ${product.title} to cart`}>
          <i className="bi bi-bag-plus" /> Quick add
        </button>
      </div>
      <div className="p-card__body">
        <span className="p-card__cat">{titleCase(product.category)}</span>
        <h3 className="p-card__title"><Link to={`/products/${product.id}`}>{product.title}</Link></h3>
        <div className="p-card__foot">
          <strong className="price">{formatPrice(product.price)}</strong>
          <Rating value={product.rating} />
        </div>
      </div>
    </motion.article>
  );
}
