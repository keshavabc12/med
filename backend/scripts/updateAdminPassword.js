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

    const adminEmail = 'admin@pharma.local';
    const admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.password = 'CheriShya@030721';
      await admin.save();
      console.log('✅ Admin password updated to CheriShya@030721');
    } else {
      console.log('❌ Admin user not found');
    }

    await mongoose.disconnect();
    await stopMongoMemory();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await stopMongoMemory();
    process.exit(1);
  }
}

updateAdminPassword();
