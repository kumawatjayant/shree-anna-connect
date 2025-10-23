const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Crop = require('../models/Crop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const BulkRequest = require('../models/BulkRequest');
const Scheme = require('../models/Scheme');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin role
router.use(protect, authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    const pendingVerifications = await User.countDocuments({ verificationStatus: 'pending' });

    // Crop statistics
    const totalCrops = await Crop.countDocuments({ isActive: true });
    const cropsByType = await Crop.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$cropType', count: { $sum: 1 } } }
    ]);

    // Product statistics
    const totalProducts = await Product.countDocuments({ isActive: true });
    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Order statistics
    const totalOrders = await Order.countDocuments();
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Bulk request statistics
    const totalBulkRequests = await BulkRequest.countDocuments({ isActive: true });
    const openBulkRequests = await BulkRequest.countDocuments({ status: 'open', isActive: true });

    // Recent activity
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('name role region createdAt verificationStatus');

    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('buyer', 'name')
      .populate('seller', 'name organizationName');

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          byRole: usersByRole,
          pendingVerifications
        },
        crops: {
          total: totalCrops,
          byType: cropsByType
        },
        products: {
          total: totalProducts,
          byCategory: productsByCategory
        },
        orders: {
          total: totalOrders,
          byStatus: ordersByStatus,
          revenue: totalRevenue[0]?.total || 0
        },
        bulkRequests: {
          total: totalBulkRequests,
          open: openBulkRequests
        },
        recentActivity: {
          users: recentUsers,
          orders: recentOrders
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filters
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const { role, verificationStatus, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/verify
// @desc    Verify or reject user
// @access  Private (Admin)
router.put('/users/:id/verify', async (req, res) => {
  try {
    const { verificationStatus, note } = req.body;

    if (!['verified', 'rejected'].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verificationStatus },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // TODO: Send notification to user

    res.status(200).json({
      success: true,
      message: `User ${verificationStatus} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying user',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/toggle-active
// @desc    Activate or deactivate user
// @access  Private (Admin)
router.put('/users/:id/toggle-active', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Toggle user active error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
});

// @route   GET /api/admin/crops
// @desc    Get all crops for admin review
// @access  Private (Admin)
router.get('/crops', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const crops = await Crop.find(query)
      .populate('seller', 'name phone region organizationName verificationStatus')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Crop.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        crops,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching crops',
      error: error.message
    });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products for admin review
// @access  Private (Admin)
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const products = await Product.find(query)
      .populate('seller', 'name organizationName region verificationStatus')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private (Admin)
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('buyer', 'name phone')
      .populate('seller', 'name organizationName')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// @route   GET /api/admin/analytics/region
// @desc    Get region-wise analytics
// @access  Private (Admin)
router.get('/analytics/region', async (req, res) => {
  try {
    const usersByRegion = await User.aggregate([
      {
        $group: {
          _id: {
            state: '$region.state',
            district: '$region.district'
          },
          count: { $sum: 1 },
          farmers: {
            $sum: { $cond: [{ $eq: ['$role', 'farmer'] }, 1, 0] }
          },
          shgs: {
            $sum: { $cond: [{ $eq: ['$role', 'shg'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const cropsByRegion = await Crop.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'seller'
        }
      },
      { $unwind: '$seller' },
      {
        $group: {
          _id: '$seller.region.state',
          totalCrops: { $sum: 1 },
          totalQuantity: { $sum: '$quantity.value' }
        }
      },
      { $sort: { totalCrops: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        usersByRegion,
        cropsByRegion
      }
    });
  } catch (error) {
    console.error('Region analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching region analytics',
      error: error.message
    });
  }
});

// @route   GET /api/admin/export
// @desc    Export data as CSV
// @access  Private (Admin)
router.get('/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let data;

    switch (type) {
      case 'users':
        data = await User.find().select('-password -otp -otpExpiry');
        break;
      case 'crops':
        data = await Crop.find().populate('seller', 'name phone');
        break;
      case 'products':
        data = await Product.find().populate('seller', 'name organizationName');
        break;
      case 'orders':
        data = await Order.find().populate('buyer seller', 'name phone');
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
});

// @route   POST /api/admin/schemes
// @desc    Create government scheme
// @access  Private (Admin)
router.post('/schemes', async (req, res) => {
  try {
    const schemeData = {
      ...req.body,
      createdBy: req.user._id
    };

    const scheme = await Scheme.create(schemeData);

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: { scheme }
    });
  } catch (error) {
    console.error('Create scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating scheme',
      error: error.message
    });
  }
});

// @route   GET /api/admin/schemes
// @desc    Get all schemes
// @access  Private (Admin)
router.get('/schemes', async (req, res) => {
  try {
    const schemes = await Scheme.find()
      .populate('createdBy', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: { schemes }
    });
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schemes',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/schemes/:id
// @desc    Update scheme
// @access  Private (Admin)
router.put('/schemes/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Scheme updated successfully',
      data: { scheme }
    });
  } catch (error) {
    console.error('Update scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating scheme',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/schemes/:id
// @desc    Delete scheme
// @access  Private (Admin)
router.delete('/schemes/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    scheme.isActive = false;
    await scheme.save();

    res.status(200).json({
      success: true,
      message: 'Scheme deleted successfully'
    });
  } catch (error) {
    console.error('Delete scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting scheme',
      error: error.message
    });
  }
});

module.exports = router;
