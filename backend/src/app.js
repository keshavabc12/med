const express = require('express');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const contactRoutes = require('./routes/contact.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

function parseOrigins(value) {
  return (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const allowVercelPreviews =
  process.env.ALLOW_VERCEL_PREVIEWS === 'true' || process.env.ALLOW_VERCEL_PREVIEWS === '1';
const corsStrict = process.env.CORS_STRICT === 'true' || process.env.CORS_STRICT === '1';
const configuredOrigins = [
  ...parseOrigins(process.env.CLIENT_ORIGINS),
  ...parseOrigins(process.env.CLIENT_ORIGIN),
];
const hasExplicitOrigins = configuredOrigins.length > 0;
const allowedOrigins = new Set([...configuredOrigins, 'http://localhost:5173']);

/** e.g. https://my-app.vercel.app — common when frontend and API are separate Vercel projects */
function isVercelAppOrigin(origin) {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== 'https:') return false;
    return u.hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (!hasExplicitOrigins) return true;
  if (allowedOrigins.has(origin)) return true;
  if (!corsStrict && (allowVercelPreviews || isVercelAppOrigin(origin))) {
    return true;
  }
  return false;
}

// Allow frontend app(s) to call API in dev/prod.
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploaded product images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'pharma-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all route to serve the React frontend for unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Central error handler (four-arg signature required by Express)
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

module.exports = app;
