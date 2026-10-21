import { useState } from 'react';
import { Container, FloatingLabel, Form } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '../components/Reveal';

const EMPTY = { name: '', email: '', message: '' };

const validate = ({ name, email, message }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Enter your name.';
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (message.trim().length < 10) errors.message = 'Tell us a little more (at least 10 characters).';
  return errors;
};

const INFO = [
  ['bi-envelope', 'Email', 'hello@shopnest.example'],
  ['bi-telephone', 'Phone', '+91 98765 43210'],
  ['bi-clock', 'Hours', 'Mon to Sat, 9am to 6pm'],
];

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      setSent(true);
      setForm(EMPTY);
    }
  };

  return (
    <Container className="page">
      <header className="page__head">
        <h1>Let’s talk</h1>
        <p className="muted">Questions about an order or a product? We reply within one working day.</p>
      </header>

      <div className="row g-4 g-xl-5">
        <div className="col-lg-5">
          {INFO.map(([icon, label, value], i) => (
            <Reveal key={label} delay={i * 0.1} className="info-card">
              <i className={`bi ${icon}`} />
              <div><span className="muted">{label}</span><strong>{value}</strong></div>
            </Reveal>
          ))}
        </div>

        <div className="col-lg-7">
          <div className="form-panel">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div key="sent" className="state state--plain" role="status" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
                    <motion.circle cx="36" cy="36" r="32" fill="none" stroke="var(--n-gold)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
                    <motion.path d="M22 37l10 10 18-20" fill="none" stroke="var(--n-gold)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />
                  </svg>
                  <h3>Message sent</h3>
                  <p>Thanks for reaching out. We’ll be in touch soon.</p>
                  <button className="btn btn-outline-glass" onClick={() => setSent(false)}>Send another message</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, y: -10 }} className="d-grid gap-3">
                  {[['name', 'Your name', 'text'], ['email', 'Email address', 'email']].map(([key, label, type]) => (
                    <FloatingLabel key={key} controlId={`c-${key}`} label={label}>
                      <Form.Control name={key} type={type} placeholder={label} value={form[key]} onChange={onChange} isInvalid={!!errors[key]} />
                      <Form.Control.Feedback type="invalid">{errors[key]}</Form.Control.Feedback>
                    </FloatingLabel>
                  ))}
                  <FloatingLabel controlId="c-message" label="Message">
                    <Form.Control as="textarea" name="message" placeholder="Message" style={{ height: 140 }} value={form.message} onChange={onChange} isInvalid={!!errors.message} />
                    <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                  </FloatingLabel>
                  <button className="btn btn-gold btn-lg" type="submit">Send message <i className="bi bi-send" /></button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Container>
  );
}
