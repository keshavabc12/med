require('dotenv').config();

const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/database');
const { resolveMongoUri } = require('../backend/src/config/resolveMongoUri');
const { seedDatabase } = require('../backend/src/config/seedDatabase');

let dbReady = false;
let inflightInit = null;

async function initIfNeeded() {
  if (dbReady) return;
  if (inflightInit) {
    await inflightInit;
    return;
  }
  inflightInit = (async () => {
    const uri = await resolveMongoUri();
    process.env.MONGO_URI = uri;
    await connectDB();

    if (process.env.AUTO_SEED !== 'false') {
      await seedDatabase();
    }
    dbReady = true;
  })();
  try {
    await inflightInit;
  } catch (err) {
    dbReady = false;
    throw err;
  } finally {
    inflightInit = null;
  }
}

module.exports = async (req, res) => {
  await initIfNeeded();
  return app(req, res);
};
