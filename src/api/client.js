import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({ baseURL: API_URL, timeout: 10000 });

// Maps whatever the backend returns onto one shape the UI relies on.
const normalize = (p) => ({
  id: String(p.id ?? p._id),
  title: p.title ?? p.name ?? 'Untitled product',
  price: Number(p.price) || 0,
  description: p.description ?? '',
  category: p.category ?? 'general',
  image: p.image ?? p.imageUrl ?? p.thumbnail ?? '',
  rating: Number(p.rating?.rate ?? p.rating) || 0,
  ratingCount: Number(p.rating?.count ?? p.numReviews) || 0,
});

export const fetchProducts = async (signal) => {
  const { data } = await api.get('/products', { signal });
  const list = Array.isArray(data) ? data : data.products ?? data.data ?? [];
  return list.map(normalize);
};

export const fetchProduct = async (id, signal) => {
  const { data } = await api.get(`/products/${id}`, { signal });
  return normalize(data.product ?? data.data ?? data);
};

export const isCancelled = axios.isCancel;
