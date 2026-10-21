import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import AnimatedNumber from '../components/AnimatedNumber';
import Reveal from '../components/Reveal';
import { formatPrice, titleCase } from '../utils/format';
import { FREE_SHIPPING_THRESHOLD } from '../config';

const HEADLINE = ['Objects', 'worth', 'keeping.'];
const ICONS = { electronics: 'bi-cpu', jewelery: 'bi-gem', jewelry: 'bi-gem', "men's clothing": 'bi-person-standing', "women's clothing": 'bi-handbag' };

function Tile({ product, className, x, y, delay }) {
  return (
    <motion.div className={`stage-tile ${className}`} style={{ x, y }}>
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }} className="stage-tile__inner">
        <Link to={`/products/${product.id}`} aria-label={product.title}>
          <img src={product.image} alt={product.title} />
        </Link>
        <span>{formatPrice(product.price)}</span>
      </motion.div>
    </motion.div>
  );
}

function Hero({ spotlight, stats }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const a = { x: useTransform(sx, [-0.5, 0.5], [-26, 26]), y: useTransform(sy, [-0.5, 0.5], [-18, 18]) };
  const b = { x: useTransform(sx, [-0.5, 0.5], [34, -34]), y: useTransform(sy, [-0.5, 0.5], [24, -24]) };
  const c = { x: useTransform(sx, [-0.5, 0.5], [-14, 14]), y: useTransform(sy, [-0.5, 0.5], [-30, 30]) };

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section className="hero" onMouseMove={onMove}>
      <Container>
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <motion.span className="hero__pill" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <i className="bi bi-stars" /> New season is here
            </motion.span>
            <h1 className="hero__title" aria-label={HEADLINE.join(' ')}>
              {HEADLINE.map((word, i) => (
                <span className="word-mask" key={word} aria-hidden="true">
                  <motion.span initial={{ y: '115%', rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.8, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>
                    {word}{' '}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p className="hero__lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
              A tightly edited collection for how you dress, work and live. Free delivery over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
            </motion.p>
            <motion.div className="d-flex flex-wrap gap-3 mt-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Link to="/products" className="btn btn-gold btn-lg">Shop the collection <i className="bi bi-arrow-right" /></Link>
              <Link to="/contact" className="btn btn-outline-glass btn-lg">Talk to us</Link>
            </motion.div>
            <motion.dl className="hero__stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <div><dt>Products</dt><dd><AnimatedNumber value={stats.count} countUp /></dd></div>
              <div><dt>Categories</dt><dd><AnimatedNumber value={stats.categories} countUp /></dd></div>
              <div><dt>Avg. rating</dt><dd><AnimatedNumber value={stats.rating} countUp format={(v) => v.toFixed(1)} /></dd></div>
            </motion.dl>
          </div>

          <div className="col-lg-6">
            <div className="hero__stage">
              <div className="hero__ring" aria-hidden="true" />
              {spotlight[0] && <Tile product={spotlight[0]} className="stage-tile--1" {...a} delay={0} />}
              {spotlight[1] && <Tile product={spotlight[1]} className="stage-tile--2" {...b} delay={1.2} />}
              {spotlight[2] && <Tile product={spotlight[2]} className="stage-tile--3" {...c} delay={2.4} />}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function Home() {
  const { data, loading, error, retry } = useProducts();

  const { featured, categories, spotlight, stats } = useMemo(() => {
    const list = data ?? [];
    const byRating = [...list].sort((a, b) => b.rating - a.rating);
    const counts = list.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {});
    const avg = list.length ? list.reduce((s, p) => s + p.rating, 0) / list.length : 0;
    return {
      featured: byRating.slice(0, 8),
      spotlight: byRating.slice(0, 3),
      categories: Object.entries(counts),
      stats: { count: list.length, categories: Object.keys(counts).length, rating: avg },
    };
  }, [data]);

  return (
    <>
      <Hero spotlight={spotlight} stats={stats} />

      {categories.length > 0 && (
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[0, 1, 2].map((n) => (
              <div className="marquee__group" key={n}>
                {categories.map(([name]) => <span key={name}>{titleCase(name)}<i className="bi bi-asterisk" /></span>)}
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <Container as="section" className="section">
          <Reveal className="section__head"><h2>Shop by category</h2></Reveal>
          <div className="row g-3 g-lg-4">
            {categories.map(([name, count], i) => (
              <Reveal className="col-6 col-lg-3" key={name} delay={i * 0.08}>
                <Link to={`/products?category=${encodeURIComponent(name)}`} className="cat-tile">
                  <i className={`bi ${ICONS[name] || 'bi-stars'} cat-tile__icon`} />
                  <strong>{titleCase(name)}</strong>
                  <span className="muted">{count} items</span>
                  <i className="bi bi-arrow-up-right cat-tile__arrow" />
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      )}

      <Container as="section" className="section">
        <Reveal className="section__head">
          <h2>Top rated this week</h2>
          <Link to="/products" className="text-link">View all <i className="bi bi-arrow-right" /></Link>
        </Reveal>
        <ProductGrid products={featured} loading={loading} error={error} onRetry={retry} />
      </Container>

      <Container as="section" className="section">
        <div className="row g-3 g-lg-4">
          {[
            ['bi-truck', 'Free delivery', `On every order over ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`],
            ['bi-arrow-repeat', '30-day returns', 'Changed your mind? Send it back, no questions.'],
            ['bi-shield-lock', 'Secure checkout', 'Your payment details stay encrypted end to end.'],
          ].map(([icon, title, text], i) => (
            <Reveal className="col-md-4" key={title} delay={i * 0.1}>
              <div className="perk"><i className={`bi ${icon}`} /><div><h3>{title}</h3><p className="muted mb-0">{text}</p></div></div>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container as="section" className="section">
        <Reveal>
          <div className="cta-band">
            <div>
              <h2>Find something you’ll keep for years.</h2>
              <p>Every product here is rated by real customers. Start with the favourites.</p>
            </div>
            <Link to="/products?sort=featured" className="btn btn-gold btn-lg">Explore the shop <i className="bi bi-arrow-right" /></Link>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
