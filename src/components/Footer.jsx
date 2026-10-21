import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './Navbar';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (/^\S+@\S+\.\S+$/.test(email)) setJoined(true);
  };

  return (
    <footer className="nest-footer">
      <Container>
        <div className="row g-5">
          <div className="col-lg-5">
            <Logo />
            <p className="muted mt-3 footer__tag">Everyday essentials, chosen with care and delivered with attention.</p>
            <form className="newsletter" onSubmit={onSubmit} noValidate>
              <AnimatePresence mode="wait" initial={false}>
                {joined ? (
                  <motion.p key="ok" className="newsletter__ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <i className="bi bi-check-circle-fill" /> You’re on the list. Welcome to ShopNest.
                  </motion.p>
                ) : (
                  <motion.div key="form" className="input-group" exit={{ opacity: 0 }}>
                    <input type="email" className="form-control" placeholder="Your email address" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button className="btn btn-gold" type="submit">Join</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
          <div className="col-6 col-lg-3 offset-lg-1">
            <h3 className="footer__h">Explore</h3>
            <nav className="footer__links" aria-label="Footer">
              <Link to="/products">Shop all</Link>
              <Link to="/cart">Your cart</Link>
              <Link to="/contact">Contact us</Link>
            </nav>
          </div>
          <div className="col-6 col-lg-3">
            <h3 className="footer__h">Follow</h3>
            <div className="footer__social">
              <a href="https://instagram.com" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a href="https://x.com" aria-label="X"><i className="bi bi-twitter-x" /></a>
              <a href="https://youtube.com" aria-label="YouTube"><i className="bi bi-youtube" /></a>
            </div>
          </div>
        </div>
        <div className="footer__word" aria-hidden="true">ShopNest</div>
        <div className="footer__legal muted">© {new Date().getFullYear()} ShopNest. All rights reserved.</div>
      </Container>
    </footer>
  );
}
