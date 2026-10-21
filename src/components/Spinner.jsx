export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="nest-spinner" role="status">
      <span className="nest-spinner__ring" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
