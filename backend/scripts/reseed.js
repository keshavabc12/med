/**
 * Clears all products from the database and re-seeds with corrected sample data.
 * Run: node backend/scripts/reseed.js   (from project root)
 *   or: npm run reseed                  (from the backend folder)
 *
 * This is needed when the database was previously seeded with invalid category
 * values ('medicine', 'vitamins', etc.) that don't match the Product schema enum.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { resolveMongoUri, stopMongoMemory } = require('../src/config/resolveMongoUri');
const Product = require('../src/models/Product');
const { seedDatabase } = require('../src/config/seedDatabase');

async function run() {
  const uri = await resolveMongoUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  const deleted = await Product.deleteMany({});
  console.log(`🗑️  Cleared ${deleted.deletedCount} existing product(s)`);

  await seedDatabase();
  console.log('🌱 Re-seed complete');

  const count = await Product.countDocuments();
  console.log(`📦 Products in DB: ${count}`);

  await mongoose.disconnect();
  await stopMongoMemory();
  process.exit(0);
}

run().catch(async (e) => {
  console.error('❌ Reseed failed:', e.message);
  await stopMongoMemory();
  process.exit(1);
});
