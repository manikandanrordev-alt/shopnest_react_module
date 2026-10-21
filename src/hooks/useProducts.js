import { useEffect, useState, useCallback } from 'react';
import { fetchProducts, fetchProduct, isCancelled } from '../api/client';

const useRequest = (request, deps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    request(controller.signal)
      .then(setData)
      .catch((err) => {
        if (isCancelled(err)) return;
        setError(
          err.response?.status === 404
            ? 'We couldn’t find that product.'
            : 'We couldn’t reach the store. Check your connection and try again.'
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { data, loading, error, retry };
};

export const useProducts = () => useRequest(fetchProducts, []);
export const useProduct = (id) => useRequest((signal) => fetchProduct(id, signal), [id]);
