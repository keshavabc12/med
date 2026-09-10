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

    const targetEmail = 'infocherishya@gmail.com';
    let user = await User.findOne({ email: targetEmail });
    
    const hashed = await bcrypt.hash('CheriShya@0307', 10);

    if (!user) {
      console.log(`⚠️  No user found with email ${targetEmail} — creating new admin account...`);
      await User.collection.insertOne({
        name: 'Admin',
        email: targetEmail,
        password: hashed,
        role: 'admin',
        phone: '',
        address: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Admin created: ${targetEmail} / CheriShya@0307`);
    } else {
      console.log(`📧 Found user with email: ${user.email}`);

      // Update the user to have admin role and the new password
      const result = await User.collection.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashed,
            role: 'admin',
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 1) {
        console.log(`✅ User ${targetEmail} updated to Admin role (if not already)`);
        console.log(`✅ Admin password updated to: CheriShya@0307`);
      } else {
        console.log('⚠️  No changes were made (already up to date?)');
      }
    }

    // Optional cleanup: remove any old admin@pharma.local if it exists
    await User.collection.deleteOne({ email: 'admin@pharma.local' });

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
