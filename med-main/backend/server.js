/**
 * Application entry — loads env, connects to MongoDB, starts HTTP server.
 */
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const { resolveMongoUri } = require('./src/config/resolveMongoUri');
const { seedDatabase } = require('./src/config/seedDatabase');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const uri = await resolveMongoUri();
    process.env.MONGO_URI = uri;
    await connectDB();

    if (process.env.AUTO_SEED === 'true' || process.env.AUTO_SEED === '1') {
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
