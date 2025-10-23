const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shree-anna-connect', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

const User = require('./models/User');
const Crop = require('./models/Crop');
const Product = require('./models/Product');
const Order = require('./models/Order');
const BulkRequest = require('./models/BulkRequest');
const Scheme = require('./models/Scheme');
const Traceability = require('./models/Traceability');

// Indian names and locations
const indianNames = {
  male: ['Rajesh Kumar', 'Amit Singh', 'Suresh Patel', 'Ramesh Sharma', 'Vijay Reddy', 'Anil Verma', 'Manoj Gupta', 'Ravi Kumar', 'Santosh Yadav', 'Prakash Joshi'],
  female: ['Sunita Devi', 'Lakshmi Bai', 'Radha Kumari', 'Savitri Devi', 'Meena Sharma', 'Geeta Patel', 'Anita Singh', 'Kavita Reddy', 'Priya Verma', 'Asha Devi']
};

const states = [
  { state: 'Karnataka', districts: ['Bangalore', 'Mysore', 'Belgaum', 'Hubli'] },
  { state: 'Maharashtra', districts: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'] },
  { state: 'Tamil Nadu', districts: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'] },
  { state: 'Andhra Pradesh', districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'] },
  { state: 'Telangana', districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'] },
  { state: 'Rajasthan', districts: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'] },
  { state: 'Gujarat', districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'] },
  { state: 'Madhya Pradesh', districts: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur'] }
];

const milletTypes = ['Foxtail Millet', 'Pearl Millet', 'Finger Millet', 'Little Millet', 'Kodo Millet', 'Barnyard Millet', 'Proso Millet', 'Sorghum'];

const productCategories = ['Flour', 'Snacks', 'Cookies', 'Ready to Cook', 'Breakfast Mix', 'Health Mix'];

const shgNames = ['Mahila Mandal', 'Shakti SHG', 'Pragati Group', 'Swayam Sahayata Samuh', 'Navjyoti SHG', 'Swarojgar Samiti'];

// Generate users
async function generateUsers() {
  const users = [];
  let phoneCounter = 9000000000;
  
  // Hash password once for all users
  const hashedPassword = await hashPassword('password123');

  // 10 Farmers
  for (let i = 0; i < 10; i++) {
    const stateData = states[i % states.length];
    const name = i % 2 === 0 ? indianNames.male[i % 10] : indianNames.female[i % 10];
    users.push({
      role: 'farmer',
      name: name,
      phone: String(phoneCounter++),
      email: `farmer${i + 1}@example.com`,
      password: hashedPassword,
      region: {
        state: stateData.state,
        district: stateData.districts[i % stateData.districts.length],
        village: `Village ${i + 1}`,
        pincode: String(400000 + i * 1000)
      },
      verificationStatus: 'verified',
      isActive: true,
      language: 'en',
      farmDetails: {
        landSize: (Math.random() * 10 + 1).toFixed(2),
        certifications: i % 3 === 0 ? ['Organic'] : []
      }
    });
  }

  // 10 SHGs
  for (let i = 0; i < 10; i++) {
    const stateData = states[i % states.length];
    users.push({
      role: 'shg',
      name: `${shgNames[i % shgNames.length]} ${i + 1}`,
      phone: String(phoneCounter++),
      email: `shg${i + 1}@example.com`,
      password: hashedPassword,
      organizationName: `${shgNames[i % shgNames.length]} ${i + 1}`,
      region: {
        state: stateData.state,
        district: stateData.districts[i % stateData.districts.length],
        village: `Village ${i + 11}`,
        pincode: String(410000 + i * 1000)
      },
      verificationStatus: 'verified',
      isActive: true,
      language: 'en',
      shgDetails: {
        registrationNumber: `SHG${1000 + i}`,
        memberCount: Math.floor(Math.random() * 20) + 10,
        formationYear: 2015 + (i % 8)
      }
    });
  }

  // 10 FPOs
  for (let i = 0; i < 10; i++) {
    const stateData = states[i % states.length];
    users.push({
      role: 'fpo',
      name: `FPO ${stateData.state} ${i + 1}`,
      phone: String(phoneCounter++),
      email: `fpo${i + 1}@example.com`,
      password: hashedPassword,
      organizationName: `${stateData.state} Farmer Producer Organization ${i + 1}`,
      region: {
        state: stateData.state,
        district: stateData.districts[i % stateData.districts.length],
        village: `Town ${i + 1}`,
        pincode: String(420000 + i * 1000)
      },
      verificationStatus: 'verified',
      isActive: true,
      language: 'en',
      fpoDetails: {
        registrationNumber: `FPO${2000 + i}`,
        memberFarmers: Math.floor(Math.random() * 500) + 100
      }
    });
  }

  // 10 Processors
  for (let i = 0; i < 10; i++) {
    const stateData = states[i % states.length];
    users.push({
      role: 'processor',
      name: `Processor ${i + 1}`,
      phone: String(phoneCounter++),
      email: `processor${i + 1}@example.com`,
      password: hashedPassword,
      organizationName: `${stateData.state} Millet Processing Unit ${i + 1}`,
      region: {
        state: stateData.state,
        district: stateData.districts[i % stateData.districts.length],
        village: `Industrial Area ${i + 1}`,
        pincode: String(430000 + i * 1000)
      },
      verificationStatus: 'verified',
      isActive: true,
      language: 'en',
      processorDetails: {
        capacity: `${Math.floor(Math.random() * 50) + 10} tons/month`,
        certifications: i % 2 === 0 ? ['FSSAI', 'ISO'] : ['FSSAI']
      }
    });
  }

  // 10 Consumers
  for (let i = 0; i < 10; i++) {
    const stateData = states[i % states.length];
    const name = i % 2 === 0 ? indianNames.male[i % 10] : indianNames.female[i % 10];
    users.push({
      role: 'consumer',
      name: name.replace('Kumar', 'Consumer').replace('Devi', 'Consumer'),
      phone: String(phoneCounter++),
      email: `consumer${i + 1}@example.com`,
      password: hashedPassword,
      region: {
        state: stateData.state,
        district: stateData.districts[i % stateData.districts.length],
        village: `City ${i + 1}`,
        pincode: String(440000 + i * 1000)
      },
      verificationStatus: 'verified',
      isActive: true,
      language: 'en'
    });
  }

  return users;
}

// Generate crops
async function generateCrops(farmers) {
  const crops = [];
  
  for (let i = 0; i < 30; i++) {
    const farmer = farmers[i % farmers.length];
    const milletType = milletTypes[i % milletTypes.length];
    
    crops.push({
      seller: farmer._id,
      cropType: milletType,
      variety: `${milletType} Variety ${(i % 3) + 1}`,
      quantity: {
        value: Math.floor(Math.random() * 500) + 100,
        unit: 'kg'
      },
      expectedPrice: Math.floor(Math.random() * 30) + 20,
      harvestDate: new Date(Date.now() + (Math.random() * 60 - 30) * 24 * 60 * 60 * 1000),
      qualityGrade: ['A', 'B', 'C'][i % 3],
      certifications: i % 3 === 0 ? ['organic'] : i % 3 === 1 ? ['pesticide_free'] : [],
      status: 'available',
      description: `High quality ${milletType} from ${farmer.region.state}`,
      farmDetails: {
        farmSize: parseFloat((Math.random() * 10 + 1).toFixed(2)),
        soilType: ['Red Soil', 'Black Soil', 'Alluvial'][i % 3],
        irrigationType: ['Rainfed', 'Drip', 'Sprinkler'][i % 3]
      },
      traceabilityId: `CROP-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      isActive: true
    });
  }
  
  return crops;
}

// Generate products
async function generateProducts(shgs) {
  const products = [];
  
  for (let i = 0; i < 40; i++) {
    const shg = shgs[i % shgs.length];
    const category = productCategories[i % productCategories.length];
    const milletType = milletTypes[i % milletTypes.length];
    
    products.push({
      seller: shg._id,
      name: `${milletType} ${category}`,
      category: category,
      description: `Nutritious ${milletType} based ${category} made by ${shg.organizationName}`,
      price: Math.floor(Math.random() * 200) + 50,
      unit: category === 'Flour' ? 'kg' : 'pack',
      packSize: category === 'Flour' ? 1000 : 500,
      stock: Math.floor(Math.random() * 100) + 20,
      photos: [],
      ingredients: [milletType, 'Natural ingredients', 'Salt', 'Spices'],
      nutritionInfo: {
        calories: Math.floor(Math.random() * 200) + 300,
        protein: Math.floor(Math.random() * 10) + 5,
        carbs: Math.floor(Math.random() * 50) + 40,
        fat: Math.floor(Math.random() * 10) + 2,
        fiber: Math.floor(Math.random() * 10) + 5,
        servingSize: '100g'
      },
      certifications: i % 2 === 0 ? ['fssai', 'organic'] : ['fssai'],
      shelfLife: {
        value: category === 'Flour' ? 6 : 3,
        unit: 'months'
      },
      traceabilityId: `PROD-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      ratings: {
        average: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        count: Math.floor(Math.random() * 50) + 5
      },
      status: 'active',
      isActive: true
    });
  }
  
  return products;
}

// Generate bulk requests
async function generateBulkRequests(processors, milletTypes) {
  const requests = [];
  
  for (let i = 0; i < 15; i++) {
    const processor = processors[i % processors.length];
    const milletType = milletTypes[i % milletTypes.length];
    
    requests.push({
      processor: processor._id,
      requestNumber: `BR-${Date.now()}-${i}`,
      cropType: milletType,
      variety: `${milletType} Variety ${(i % 3) + 1}`,
      quantity: {
        value: Math.floor(Math.random() * 5000) + 1000,
        unit: 'kg'
      },
      priceRange: {
        min: Math.floor(Math.random() * 20) + 15,
        max: Math.floor(Math.random() * 30) + 25
      },
      deliveryLocation: {
        address: processor.region.village,
        city: processor.region.district,
        state: processor.region.state,
        pincode: processor.region.pincode
      },
      requiredBy: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
      qualityRequirements: {
        grade: ['A', 'B', 'C'][i % 3],
        certifications: i % 2 === 0 ? ['organic'] : [],
        moistureContent: '12% max',
        otherSpecs: 'Clean and dry'
      },
      status: ['open', 'partially_fulfilled'][i % 2],
      description: `Bulk requirement of ${milletType} for processing`,
      offers: []
    });
  }
  
  return requests;
}

// Generate schemes
async function generateSchemes() {
  const schemes = [
    {
      title: 'Millet Subsidy Scheme 2024',
      description: 'Financial assistance for millet cultivation to promote nutritious grain production',
      category: 'subsidy',
      benefits: 'Up to ₹10,000 per hectare for millet farmers. Additional ₹5,000 for organic certification.',
      eligibility: {
        roles: ['farmer', 'fpo'],
        regions: [
          { state: 'Karnataka', districts: ['Bangalore', 'Mysore', 'Belgaum'] },
          { state: 'Maharashtra', districts: ['Pune', 'Nagpur', 'Nashik'] }
        ],
        otherCriteria: 'Minimum 1 hectare land ownership'
      },
      applicationProcess: 'Apply online through agriculture portal with land documents',
      externalLink: 'https://agriculture.gov.in',
      contactInfo: {
        department: 'Department of Agriculture',
        phone: '1800-180-1551',
        email: 'millet@agriculture.gov.in'
      },
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true
    },
    {
      title: 'SHG Millet Processing Training Program',
      description: 'Free training for Self Help Groups on millet processing and value addition',
      category: 'training',
      benefits: '15-day residential training with certification, toolkit worth ₹25,000, and market linkage support',
      eligibility: {
        roles: ['shg'],
        regions: [],
        otherCriteria: 'Registered SHG with minimum 10 members'
      },
      applicationProcess: 'Submit application through District Rural Development Agency',
      externalLink: 'https://rural.gov.in',
      contactInfo: {
        department: 'Ministry of Rural Development',
        phone: '1800-180-6030',
        email: 'shg@rural.gov.in'
      },
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true
    },
    {
      title: 'Millet Marketing & Export Support',
      description: 'Marketing assistance and export promotion for millet products',
      category: 'marketing',
      benefits: 'Free stall in government exhibitions, 50% subsidy on packaging, export documentation support',
      eligibility: {
        roles: ['shg', 'fpo', 'processor'],
        regions: [],
        otherCriteria: 'FSSAI license required'
      },
      applicationProcess: 'Register on MSME portal and submit product details',
      externalLink: 'https://msme.gov.in',
      contactInfo: {
        department: 'Ministry of MSME',
        phone: '1800-180-6763',
        email: 'marketing@msme.gov.in'
      },
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true
    },
    {
      title: 'Millet Organic Certification Subsidy',
      description: 'Financial support for obtaining organic certification for millet crops',
      category: 'certification',
      benefits: '100% reimbursement of certification cost up to ₹15,000',
      eligibility: {
        roles: ['farmer', 'fpo'],
        regions: [
          { state: 'Rajasthan', districts: ['Jaipur', 'Jodhpur'] },
          { state: 'Gujarat', districts: ['Ahmedabad', 'Surat'] }
        ],
        otherCriteria: 'Must follow organic practices for minimum 2 years'
      },
      applicationProcess: 'Apply through state agriculture department',
      externalLink: 'https://agriculture.gov.in/organic',
      contactInfo: {
        department: 'Organic Certification Division',
        phone: '1800-180-1234',
        email: 'organic@agriculture.gov.in'
      },
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      isActive: true
    },
    {
      title: 'Millet Processing Unit Loan Scheme',
      description: 'Low-interest loans for setting up millet processing units',
      category: 'loan',
      benefits: 'Loan up to ₹50 lakhs at 4% interest with 5-year repayment period',
      eligibility: {
        roles: ['processor', 'fpo', 'shg'],
        regions: [],
        otherCriteria: 'Business plan and land ownership required'
      },
      applicationProcess: 'Apply through NABARD or scheduled banks',
      externalLink: 'https://nabard.org',
      contactInfo: {
        department: 'NABARD',
        phone: '1800-180-2345',
        email: 'loans@nabard.org'
      },
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true
    }
  ];
  
  return schemes;
}

// Main seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({ role: { $ne: 'admin' } }); // Keep admin
    await Crop.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await BulkRequest.deleteMany({});
    await Scheme.deleteMany({});
    await Traceability.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Generate and insert users
    console.log('👥 Creating 50 users...');
    const usersData = await generateUsers();
    const users = await User.insertMany(usersData);
    console.log(`✅ Created ${users.length} users\n`);

    // Separate users by role
    const farmers = users.filter(u => u.role === 'farmer');
    const shgs = users.filter(u => u.role === 'shg');
    const fpos = users.filter(u => u.role === 'fpo');
    const processors = users.filter(u => u.role === 'processor');
    const consumers = users.filter(u => u.role === 'consumer');

    console.log(`  - Farmers: ${farmers.length}`);
    console.log(`  - SHGs: ${shgs.length}`);
    console.log(`  - FPOs: ${fpos.length}`);
    console.log(`  - Processors: ${processors.length}`);
    console.log(`  - Consumers: ${consumers.length}\n`);

    // Generate and insert crops
    console.log('🌾 Creating crops...');
    const cropsData = await generateCrops([...farmers, ...fpos]);
    const crops = await Crop.insertMany(cropsData);
    console.log(`✅ Created ${crops.length} crop listings\n`);

    // Generate and insert products
    console.log('📦 Creating products...');
    const productsData = await generateProducts(shgs);
    const products = await Product.insertMany(productsData);
    console.log(`✅ Created ${products.length} products\n`);

    // Generate and insert bulk requests
    console.log('📋 Creating bulk requests...');
    const bulkRequestsData = await generateBulkRequests(processors, milletTypes);
    const bulkRequests = await BulkRequest.insertMany(bulkRequestsData);
    console.log(`✅ Created ${bulkRequests.length} bulk requests\n`);

    // Generate and insert schemes
    console.log('🎯 Creating government schemes...');
    const schemesData = await generateSchemes();
    const schemes = await Scheme.insertMany(schemesData);
    console.log(`✅ Created ${schemes.length} schemes\n`);

    // Summary
    console.log('=' .repeat(50));
    console.log('🎉 DATABASE SEEDING COMPLETED!\n');
    console.log('📊 Summary:');
    console.log(`  - Total Users: ${users.length}`);
    console.log(`  - Crops: ${crops.length}`);
    console.log(`  - Products: ${products.length}`);
    console.log(`  - Bulk Requests: ${bulkRequests.length}`);
    console.log(`  - Schemes: ${schemes.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log('  - Admin: 9999999999 / admin123 (Login at /admin/login)');
    console.log('  - Farmers: 9000000000-9000000009 / password123');
    console.log('  - SHGs: 9000000010-9000000019 / password123');
    console.log('  - FPOs: 9000000020-9000000029 / password123');
    console.log('  - Processors: 9000000030-9000000039 / password123');
    console.log('  - Consumers: 9000000040-9000000049 / password123');
    console.log('\n🌐 Access URLs:');
    console.log('  - Main App: http://localhost:3001');
    console.log('  - User Login: http://localhost:3001/login');
    console.log('  - Admin Login: http://localhost:3001/admin/login');
    console.log('  - Marketplace: http://localhost:3001/marketplace');
    console.log('=' .repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
