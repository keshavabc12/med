const mongoose = require('mongoose');

/**
 * Connects to MongoDB using MONGO_URI from environment (never hardcode).
 * Safe for Vercel serverless: reuses an existing connection when the isolate is warm.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set in environment variables');
  }
  mongoose.set('strictQuery', true);
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = connectDB;
