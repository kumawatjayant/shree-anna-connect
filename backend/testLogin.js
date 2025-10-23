const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shree-anna-connect')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

async function testLogin() {
  try {
    // Test farmer login
    const phone = '9000000000';
    const password = 'password123';
    
    console.log(`\n🔍 Testing login for phone: ${phone}`);
    
    const user = await User.findOne({ phone }).select('+password');
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    
    console.log(`✅ User found: ${user.name} (${user.role})`);
    console.log(`📝 Password hash: ${user.password.substring(0, 20)}...`);
    console.log(`🔐 Testing password: "${password}"`);
    
    const isMatch = await user.comparePassword(password);
    
    if (isMatch) {
      console.log('✅ Password matches! Login should work.');
    } else {
      console.log('❌ Password does NOT match! Login will fail.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLogin();
