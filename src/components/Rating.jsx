export default function Rating({ value, count }) {
  const filled = Math.round(value);
  return (
    <span className="rating" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <span aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} className={`bi ${i < filled ? 'bi-star-fill' : 'bi-star'}`} />
        ))}
      </span>
      <span className="rating__value">{value.toFixed(1)}</span>
      {count > 0 && <span className="rating__count">({count})</span>}
    </span>
  );
}
