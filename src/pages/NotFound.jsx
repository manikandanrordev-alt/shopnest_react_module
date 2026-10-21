import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <Container className="page">
      <div className="state state--big">
        <motion.div className="nf-code" animate={{ rotate: [0, -3, 3, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>404</motion.div>
        <h1>Page not found</h1>
        <p>The page you’re looking for has moved or doesn’t exist.</p>
        <Link to="/" className="btn btn-gold btn-lg">Back to home</Link>
      </div>
    </Container>
  );
}
