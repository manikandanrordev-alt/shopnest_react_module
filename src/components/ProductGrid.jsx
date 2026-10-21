import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import Spinner from './Spinner';
import ErrorState from './ErrorState';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProductGrid({ products, loading, error, onRetry, emptyMessage = 'No products match your search.' }) {
  if (loading) {
    return (
      <>
        <Spinner label="Loading products…" />
        <div className="row g-3 g-lg-4" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <div className="col-6 col-md-4 col-xl-3" key={i}>
              <div className="p-card skeleton"><div className="skeleton__media" /><div className="skeleton__line" /><div className="skeleton__line skeleton__line--short" /></div>
            </div>
          ))}
        </div>
      </>
    );
  }
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!products?.length) {
    return (
      <div className="state">
        <i className="bi bi-search state__icon" />
        <h3>Nothing found</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }
  return (
    <motion.div
      key={products.map((p) => p.id).join('-')}
      className="row g-3 g-lg-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
    >
      {products.map((p) => (
        <motion.div className="col-6 col-md-4 col-xl-3" key={p.id} variants={item}>
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
