import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Ticker from './components/Ticker';
import Navbar from './components/Navbar';
import MiniCart from './components/MiniCart';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  return (
    <>
      <div className="aurora" aria-hidden="true"><span /><span /><span /></div>
      <ScrollToTop />
      <ScrollProgress />
      <a className="skip-link" href="#main">Skip to content</a>
      <Ticker />
      <Navbar />
      <MiniCart />
      <main id="main">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <Toast />
      <BackToTop />
    </>
  );
}
