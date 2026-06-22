require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { resolveMongoUri, stopMongoMemory } = require('../src/config/resolveMongoUri');
const User = require('../src/models/User');

async function updateAdmin() {
  try {
    const uri = await resolveMongoUri();
    process.env.MONGO_URI = uri;
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Find any admin user regardless of current email
    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      // No admin found — create one fresh
      console.log('⚠️  No admin found — creating new admin account...');
      const hashed = await bcrypt.hash('CheriShya@030721', 10);
      await User.collection.insertOne({
        name: 'Pharma Admin',
        email: 'infocherishya@gmail.com',
        password: hashed,
        role: 'admin',
        phone: '',
        address: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Admin created: infocherishya@gmail.com / CheriShya@030721');
    } else {
      console.log(`📧 Found admin with email: ${admin.email}`);

      // Hash the new password manually
      const hashed = await bcrypt.hash('CheriShya@030721', 10);

      // Use direct MongoDB update to bypass any Mongoose quirks
      const result = await User.collection.updateOne(
        { _id: admin._id },
        {
          $set: {
            email: 'infocherishya@gmail.com',
            password: hashed,
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 1) {
        console.log('✅ Admin email updated to: infocherishya@gmail.com');
        console.log('✅ Admin password updated to: CheriShya@030721');
      } else {
        console.log('⚠️  No changes were made (already up to date?)');
      }
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

updateAdmin();
