const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('🔍 Testing Login API...\n');
    
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      phone: '9000000000',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.data.user.name);
    console.log('Role:', response.data.data.user.role);
    console.log('Token:', response.data.data.token.substring(0, 20) + '...');
    
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Error:', error.message);
  }
}

testLoginAPI();
