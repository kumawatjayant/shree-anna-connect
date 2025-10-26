const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ragrokproductions:16u1de1q7DtFVlAy@cluster0.lforudj.mongodb.net/Shree-anna-connect', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

const User = require('./models/User');

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ phone: '9999999999' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Phone: 9999999999');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      role: 'admin',
      name: 'Admin User',
      phone: '9999999999',
      email: 'admin@shreeanna.in',
      password: 'admin123', // Will be hashed by pre-save hook
      region: {
        state: 'Delhi',
        district: 'New Delhi',
        village: 'Central',
        pincode: '110001'
      },
      verificationStatus: 'verified',
      isActive: true,
      language: 'en'
    });

    console.log('✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log('Phone: 9999999999');
    console.log('Password: admin123');
    console.log('-----------------------------------');
    console.log('You can now login at: http://localhost:3000/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
