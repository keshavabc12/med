import axios from 'axios';

/**
 * Base URL empty in dev: Vite proxies /api and /uploads to Express.
 * For production build, set VITE_API_URL to your backend API origin
 * (e.g. https://your-api.vercel.app). Do NOT include a trailing slash.
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

/**
 * Resolves an image path returned by the API into a full URL suitable for <img src>.
 *
 * - Empty / null path  → placeholder SVG
 * - Absolute URL       → returned as-is (e.g. Cloudinary)
 * - Relative path      → prefixed with the backend origin
 *     • In dev  (VITE_API_URL not set): origin = "" → relative path is
 *       forwarded by the Vite dev-server proxy to Express.
 *     • In prod (VITE_API_URL = "https://api.example.com"): becomes an
 *       absolute URL pointing at the real backend server.
 */
export function mediaUrl(path) {
  if (!path) return '/placeholder-product.svg';
  // Already an absolute URL (e.g., Cloudinary or external CDN)
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const origin = normalizeApiBase(import.meta.env.VITE_API_URL);
  // Ensure exactly one slash between origin and path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}
