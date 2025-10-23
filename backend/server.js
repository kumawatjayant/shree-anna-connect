const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production on Vercel, allow same origin
    if (process.env.VERCEL) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shree-anna-connect', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Import routes
const authRoutes = require('./routes/auth');
const cropRoutes = require('./routes/crops');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const bulkRequestRoutes = require('./routes/bulkRequests');
const adminRoutes = require('./routes/admin');
const traceabilityRoutes = require('./routes/traceability');
const schemeRoutes = require('./routes/schemes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bulk-requests', bulkRequestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/traceability', traceabilityRoutes);
app.use('/api/schemes', schemeRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shree Anna Connect API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  
  // Serve static files
  app.use(express.static(frontendBuildPath));
  
  // Handle React routing - send all non-API requests to index.html
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // Development - just show API info
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Shree Anna Connect API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        crops: '/api/crops',
        products: '/api/products',
        orders: '/api/orders',
        bulkRequests: '/api/bulk-requests',
        admin: '/api/admin',
        traceability: '/api/traceability',
        schemes: '/api/schemes'
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  // Close server & exit process
  process.exit(1);
});
