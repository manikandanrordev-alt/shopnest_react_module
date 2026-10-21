import { motion } from 'framer-motion';

export default function ErrorState({ message, onRetry }) {
  return (
    <motion.div className="state state--error" role="alert" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
      <i className="bi bi-wifi-off state__icon" />
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && <button className="btn btn-gold" onClick={onRetry}><i className="bi bi-arrow-clockwise" /> Try again</button>}
    </motion.div>
  );
}
