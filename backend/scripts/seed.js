/**
 * Seeds sample data. Run: npm run seed
 * Uses MONGO_URI from .env, or in-memory MongoDB in development when MONGO_URI is empty.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { resolveMongoUri, stopMongoMemory } = require('../src/config/resolveMongoUri');
const { seedDatabase } = require('../src/config/seedDatabase');

async function run() {
  const uri = await resolveMongoUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
  console.log('Connected for seed');

  await seedDatabase();

  await mongoose.disconnect();
  await stopMongoMemory();
  console.log('Seed done');
  process.exit(0);
}

run().catch(async (e) => {
  console.error(e);
  await stopMongoMemory();
  process.exit(1);
});
