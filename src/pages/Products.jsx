import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import Reveal from '../components/Reveal';

const SORTS = {
  featured: { label: 'Top rated', fn: (a, b) => b.rating - a.rating },
  low: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  high: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  name: { label: 'Name: A to Z', fn: (a, b) => a.title.localeCompare(b.title) },
};

export default function Products() {
  const { data, loading, error, retry } = useProducts();
  const [params, setParams] = useSearchParams();

  const category = params.get('category') || 'all';
  const query = params.get('q') || '';
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'featured';

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params);
    if (!value || value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const categories = useMemo(() => [...new Set((data ?? []).map((p) => p.category))], [data]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? [])
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .sort(SORTS[sort].fn);
  }, [data, category, query, sort]);

  return (
    <Container className="page">
      <header className="page__head">
        <h1>The collection</h1>
        <p className="muted">Browse everything in the ShopNest range.</p>
      </header>

      <Reveal className="toolbar">
        <div className="search">
          <i className="bi bi-search" />
          <label className="visually-hidden" htmlFor="q">Search products</label>
          <input id="q" type="search" placeholder="Search products" value={query} onChange={(e) => setParam('q', e.target.value, '')} />
          {query && <button className="search__clear" aria-label="Clear search" onClick={() => setParam('q', '', '')}><i className="bi bi-x-lg" /></button>}
        </div>
        <label className="visually-hidden" htmlFor="sort">Sort products</label>
        <select id="sort" className="form-select nest-select" value={sort} onChange={(e) => setParam('sort', e.target.value, 'featured')}>
          {Object.entries(SORTS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </Reveal>

      {categories.length > 0 && <CategoryFilter categories={categories} active={category} onChange={(c) => setParam('category', c, 'all')} />}

      {!loading && !error && <p className="muted results" aria-live="polite">{visible.length} {visible.length === 1 ? 'product' : 'products'}</p>}

      <ProductGrid products={visible} loading={loading} error={error} onRetry={retry} />
    </Container>
  );
}
