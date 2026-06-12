# Pharma E-commerce (Full Stack Demo)

React storefront + Express REST API + MongoDB + JWT auth (customers and separate admin login).

## Project structure

- `frontend/` — Vite + React + Tailwind CSS + Recharts (admin dashboard)
- `backend/` — Node.js + Express + Mongoose + Multer (product images)

## Prerequisites

- Node.js 18+
- **MongoDB:** Set **`MONGO_URI`** (full string from Atlas → Connect → Drivers) **or** set **`MONGO_ATLAS_HOST`**, **`MONGO_ATLAS_USER`**, and **`MONGO_ATLAS_PASSWORD`** in `backend/.env`. If none of these are set in development, the API falls back to **mongodb-memory-server** (data is lost when the process exits).

## Backend setup

1. Environment file **`backend/.env`** is created for you in this repo template (gitignored). To recreate from scratch:

   ```bash
   cd backend
   copy .env.example .env
   ```

   On macOS/Linux use `cp .env.example .env`.

   - **`MONGO_URI`:** your connection string, or leave blank for in-memory dev.
   - **`AUTO_SEED=true`:** on startup, seeds admin, demo customer, products, and demo orders if collections are empty.

2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Optional one-off seed against your own `MONGO_URI` (then you can set `AUTO_SEED=false`):

   ```bash
   npm run seed
   ```

   Demo accounts:

   - Admin: `admin@pharma.local` / `Admin123!`
   - Customer: `customer@demo.com` / `User123!`

3. API default: [http://localhost:5000](http://localhost:5000) — `GET /api/health`.

The app resolves the DB from **`process.env.MONGO_URI`** when set; otherwise dev falls back to in-memory Mongo (see `src/config/resolveMongoUri.js`).

## Run API + frontend together (recommended)

From the **project root** (`pharma/`):

```bash
npm install
npm run bootstrap
npm run dev
```

(`bootstrap` installs `backend/` and `frontend/` dependencies once. Skip it if you already ran `npm install` in those folders.)

This starts the API on [http://localhost:5000](http://localhost:5000) and the Vite app on [http://localhost:5173](http://localhost:5173).

## Frontend only

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (requires the API on port 5000 for data).

For a production build served separately from the API, set `VITE_API_URL` to your API origin (including protocol) so image URLs resolve correctly.

## Features (summary)

**Storefront:** registration/login, home, product listing (search, category, filters), product detail, cart (local storage), checkout (COD + mock online payment), order history, about, contact.

**Admin (staff login):** dashboard (revenue, orders, users, products + charts), product CRUD with image upload, stock updates and low-stock list, all orders with status updates, customer list.

## API routes (overview)

| Area      | Path prefix        | Notes                                      |
| --------- | ------------------ | ------------------------------------------ |
| Auth      | `/api/auth`        | User register/login, admin login, `/me`    |
| Products  | `/api/products`    | Public list/detail; admin writes + stock   |
| Orders    | `/api/orders`      | User `POST`, `GET /my`; admin `GET`, patch |
| Users     | `/api/users`       | Admin-only customer list                   |
| Admin     | `/api/admin`       | Dashboard aggregates                       |

Uploaded files are stored under `backend/uploads/` and served at `/uploads/...`.

## Dummy project (quick upload sample)

A minimal sample is available in `dummy-project/` with plain HTML/CSS/JS.

To run it, open `dummy-project/index.html` in your browser.

## Vercel deployment (frontend + backend)

Deploy frontend and backend as two separate Vercel projects.

1. **Deploy backend (`backend/`)**
   - In Vercel, create a new project and set root directory to `backend`.
   - Keep the included `backend/vercel.json` as-is.
   - Add environment variables:
     - `MONGO_URI` (Atlas connection string — required in production)
     - `JWT_SECRET` (strong random string — **required**; without it, login returns a server error)
     - `JWT_EXPIRES_IN=7d` (optional)
     - `AUTO_SEED=true` (recommended on first deploy so the demo admin and products exist)
     - `CLIENT_ORIGINS=https://<your-frontend-domain>.vercel.app` (optional; any `https://*.vercel.app` is allowed unless you set `CORS_STRICT=true`)
     - `ALLOW_VERCEL_PREVIEWS=true` (optional; extra preview support — not required for `*.vercel.app` when `CORS_STRICT` is off)
     - `CORS_STRICT=true` (optional; allow **only** origins listed in `CLIENT_ORIGIN` / `CLIENT_ORIGINS` plus localhost)

2. **Deploy frontend (`frontend/`)**
   - Create another Vercel project with root directory `frontend`.
   - `frontend/vercel.json` rewrites all routes to `index.html` so React Router paths like `/admin/login` work after refresh.
   - Add env variable:
     - `VITE_API_URL=https://<your-backend-domain>.vercel.app` (no trailing slash; do not append `/api`)
   - Redeploy frontend after setting env.

3. **Admin login**
   - Use `admin@pharma.local` / `Admin123!` (seeded when `AUTO_SEED=true`).
   - If you disable seeding later, keep the created admin in MongoDB.
