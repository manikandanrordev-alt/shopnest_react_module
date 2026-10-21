import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar as BsNavbar } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="ShopNest home">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="10" className="logo__bg" />
        <path d="M6 17c0-6 4.5-10 10-10s10 4 10 10c0 4-4.5 8-10 8S6 21 6 17Z" fill="none" stroke="#D9B66B" strokeWidth="2.4" />
        <circle cx="16" cy="16" r="3" fill="#D9B66B" />
      </svg>
      <span>ShopNest</span>
    </Link>
  );
}

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Shop' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { itemCount, openDrawer } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <BsNavbar expand="md" sticky="top" expanded={expanded} onToggle={setExpanded} className={`nest-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <Container>
        <Logo />
        <div className="d-flex align-items-center gap-2 order-md-3">
          <button className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.i
                key={theme}
                className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'}`}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
          </button>
          <button className="icon-btn" onClick={openDrawer} aria-label={`Open cart, ${itemCount} items`}>
            <i className="bi bi-bag" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  className="icon-btn__badge"
                  initial={{ scale: 1.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <BsNavbar.Toggle aria-controls="main-nav" className="icon-btn nest-toggle" />
        </div>
        <BsNavbar.Collapse id="main-nav" className="order-md-2">
          <Nav className="mx-md-auto nest-links" as="nav" aria-label="Main">
            {LINKS.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className="nav-link">
                {({ isActive }) => (
                  <>
                    <span>{label}</span>
                    {isActive && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  </>
                )}
              </NavLink>
            ))}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
