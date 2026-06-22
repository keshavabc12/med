require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { resolveMongoUri, stopMongoMemory } = require('../src/config/resolveMongoUri');
const User = require('../src/models/User');

async function updateAdminPassword() {
  try {
    const uri = await resolveMongoUri();
    process.env.MONGO_URI = uri;
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Find by role in case email was different before
    const admin = await User.findOne({ role: 'admin' }).select('+password');

    if (admin) {
      console.log(`📧 Found admin: ${admin.email} — updating email & password...`);
      admin.email = 'infocherishya@gmail.com';
      admin.password = 'CheriShya@030721';
      await admin.save();
      console.log('✅ Admin email updated to: infocherishya@gmail.com');
      console.log('✅ Admin password updated to: CheriShya@030721');
    } else {
      // No admin exists at all — create one fresh
      console.log('⚠️  No admin found — creating new admin account...');
      await User.create({
        name: 'Pharma Admin',
        email: 'infocherishya@gmail.com',
        password: 'CheriShya@030721',
        role: 'admin',
      });
      console.log('✅ Admin created: infocherishya@gmail.com / CheriShya@030721');
    }

    await mongoose.disconnect();
    await stopMongoMemory();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await stopMongoMemory();
    process.exit(1);
  }
}

updateAdminPassword();
