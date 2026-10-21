import { FREE_SHIPPING_THRESHOLD } from '../config';
import { formatPrice } from '../utils/format';

const MESSAGES = [
  `Free delivery over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
  '30-day easy returns',
  'New arrivals every week',
  'Secure, encrypted checkout',
];

export default function Ticker() {
  return (
    <div className="ticker" role="marquee" aria-label="Store announcements">
      <div className="ticker__track">
        {[0, 1].map((n) => (
          <div className="ticker__group" key={n} aria-hidden={n === 1}>
            {MESSAGES.map((m) => <span key={m}><i className="bi bi-stars" /> {m}</span>)}
          </div>
        ))}
      </div>
    </div>
  );
}
