import { CURRENCY } from '../config';

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY });

export const formatPrice = (value) => formatter.format(value || 0);

export const titleCase = (text = '') =>
  text.replace(/\b\w/g, (c) => c.toUpperCase());
