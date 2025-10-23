const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Crop = require('../models/Crop');
const { protect } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { orderType, items, shippingAddress, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Calculate total and get seller
    let totalAmount = 0;
    let sellerId = null;

    for (let item of items) {
      if (orderType === 'product') {
        const product = await Product.findById(item.itemId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product ${item.itemId} not found`
          });
        }
        item.price = product.price;
        item.name = product.name;
        item.subtotal = product.price * item.quantity;
        sellerId = product.seller;
      } else if (orderType === 'crop') {
        const crop = await Crop.findById(item.itemId);
        if (!crop) {
          return res.status(404).json({
            success: false,
            message: `Crop ${item.itemId} not found`
          });
        }
        item.price = crop.expectedPrice;
        item.name = `${crop.cropType} - ${crop.variety}`;
        item.subtotal = crop.expectedPrice * item.quantity;
        sellerId = crop.seller;
      }
      totalAmount += item.subtotal;
    }

    const order = await Order.create({
      orderType,
      buyer: req.user._id,
      seller: sellerId,
      items,
      totalAmount,
      shippingAddress,
      notes: { buyer: notes }
    });

    // Add initial status to history
    order.addStatusHistory('pending', 'Order created');
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders (buyer or seller)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type = 'buyer', status, page = 1, limit = 10 } = req.query;

    const query = type === 'buyer' 
      ? { buyer: req.user._id }
      : { seller: req.user._id };

    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('buyer', 'name phone email')
      .populate('seller', 'name phone email organizationName')
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

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name phone email region')
      .populate('seller', 'name phone email organizationName region');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.buyer._id.toString() !== req.user._id.toString() &&
        order.seller._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Seller/Admin)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.status = status;
    order.addStatusHistory(status, note);
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status
// @access  Private
router.put('/:id/payment', protect, async (req, res) => {
  try {
    const { paymentStatus, method, transactionId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentStatus = paymentStatus;
    order.paymentDetails = {
      method,
      transactionId,
      paidAt: paymentStatus === 'paid' ? new Date() : undefined
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment',
      error: error.message
    });
  }
});

module.exports = router;
