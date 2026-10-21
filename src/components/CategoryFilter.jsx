import { motion } from 'framer-motion';
import { titleCase } from '../utils/format';

export default function CategoryFilter({ categories, active, onChange }) {
  const options = ['all', ...categories];
  return (
    <div className="chips" role="group" aria-label="Filter by category">
      {options.map((c) => (
        <button key={c} className={`chip ${active === c ? 'is-active' : ''}`} aria-pressed={active === c} onClick={() => onChange(c)}>
          {active === c && <motion.span layoutId="chip-active" className="chip__bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className="chip__label">{c === 'all' ? 'All products' : titleCase(c)}</span>
        </button>
      ))}
    </div>
  );
}
