import axios from 'axios';

/**
 * Base URL empty in dev: Vite proxies /api and /uploads to Express.
 * For production build, set VITE_API_URL to your API origin.
 */
function normalizeApiBase(url) {
  const trimmed = (url || '').trim().replace(/\/+$/, '');
  // If user sets .../api in env, avoid duplicate /api in request paths.
  return trimmed.endsWith('/api') ? trimmed.slice(0, -4) : trimmed;
}

const baseURL = normalizeApiBase(import.meta.env.VITE_API_URL);

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  if (config.skipAuth) return config;
  const useAdmin = config.admin === true;
  const token = localStorage.getItem(useAdmin ? 'pharma_admin_token' : 'pharma_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

/** Full URL for uploaded images (relative paths from API). */
export function mediaUrl(path) {
  if (!path) return '/placeholder-product.svg';
  if (path.startsWith('http')) return path;
  const origin = normalizeApiBase(import.meta.env.VITE_API_URL);
  return `${origin}${path}`;
}
