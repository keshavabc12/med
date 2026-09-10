/**
 * Resolves MongoDB connection string in this order:
 * 1. MONGO_URI if set (paste full Atlas string from Atlas → Connect → Drivers)
 * 2. Built from MONGO_ATLAS_HOST + MONGO_ATLAS_USER + MONGO_ATLAS_PASSWORD (+ optional MONGO_ATLAS_DB)
 * 3. In-memory MongoDB in non-production when nothing above is configured
 */
let memoryServer = null;

function buildAtlasUriFromParts() {
  const host = process.env.MONGO_ATLAS_HOST?.trim();
  const user = process.env.MONGO_ATLAS_USER?.trim();
  const pass = process.env.MONGO_ATLAS_PASSWORD?.trim();
  if (!host || !user || !pass) {
    return null;
  }
  const db = process.env.MONGO_ATLAS_DB?.trim() || 'pharma_ecommerce';
  const u = encodeURIComponent(user);
  const p = encodeURIComponent(pass);
  return `mongodb+srv://${u}:${p}@${host}/${db}?retryWrites=true&w=majority`;
}

async function resolveMongoUri() {
  const explicit = process.env.MONGO_URI?.trim();
  if (explicit) {
    return explicit;
  }

  const fromParts = buildAtlasUriFromParts();
  if (fromParts) {
    return fromParts;
  }

  const hasUser = !!process.env.MONGO_ATLAS_USER?.trim();
  const hasPass = !!process.env.MONGO_ATLAS_PASSWORD?.trim();
  const hasHost = !!process.env.MONGO_ATLAS_HOST?.trim();
  if ((hasUser || hasPass) && !hasHost) {
    throw new Error(
      'Atlas user/password are set but MONGO_ATLAS_HOST is missing. In Atlas: Database → Connect → Drivers, copy the hostname (e.g. cluster0.abcd123.mongodb.net) into MONGO_ATLAS_HOST in backend/.env, or paste the full connection string into MONGO_URI.'
    );
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MONGO_URI (or Atlas host + user + password) is required in production. Set backend/.env');
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  console.warn(
    '[dev] No MONGO_URI / Atlas parts — using in-memory MongoDB. Data is lost when the process exits. Set MONGO_URI or MONGO_ATLAS_* in .env for Atlas.'
  );
  return uri;
}

async function stopMongoMemory() {
  if (!memoryServer) return;
  try {
    await memoryServer.stop();
  } catch {
    /* ignore */
  }
  memoryServer = null;
}

module.exports = { resolveMongoUri, stopMongoMemory };
