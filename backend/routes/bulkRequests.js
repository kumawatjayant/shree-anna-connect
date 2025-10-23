const express = require('express');
const router = express.Router();
const BulkRequest = require('../models/BulkRequest');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/bulk-requests
// @desc    Create bulk procurement request
// @access  Private (Processor)
router.post('/', protect, authorize('processor'), async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      processor: req.user._id
    };

    const bulkRequest = await BulkRequest.create(requestData);

    res.status(201).json({
      success: true,
      message: 'Bulk request created successfully',
      data: { bulkRequest }
    });
  } catch (error) {
    console.error('Create bulk request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating bulk request',
      error: error.message
    });
  }
});

// @route   GET /api/bulk-requests
// @desc    Get all bulk requests
// @access  Public (for farmers to see)
router.get('/', async (req, res) => {
  try {
    const { status = 'open', cropType, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };
    if (status) query.status = status;
    if (cropType) query.cropType = cropType;

    const requests = await BulkRequest.find(query)
      .populate('processor', 'name organizationName phone email region')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await BulkRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        requests,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get bulk requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bulk requests',
      error: error.message
    });
  }
});

// @route   GET /api/bulk-requests/my-requests
// @desc    Get processor's own requests
// @access  Private (Processor)
router.get('/my-requests', protect, authorize('processor'), async (req, res) => {
  try {
    const requests = await BulkRequest.find({ processor: req.user._id })
      .populate('offers.farmer', 'name phone region')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: { requests }
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your requests',
      error: error.message
    });
  }
});

// @route   GET /api/bulk-requests/:id
// @desc    Get single bulk request
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const request = await BulkRequest.findById(req.params.id)
      .populate('processor', 'name organizationName phone email region')
      .populate('offers.farmer', 'name phone region');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Bulk request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { request }
    });
  } catch (error) {
    console.error('Get bulk request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bulk request',
      error: error.message
    });
  }
});

// @route   POST /api/bulk-requests/:id/offer
// @desc    Submit offer for bulk request
// @access  Private (Farmer/FPO/SHG)
router.post('/:id/offer', protect, authorize('farmer', 'fpo', 'shg'), async (req, res) => {
  try {
    const { cropId, quantity, price, message } = req.body;

    const bulkRequest = await BulkRequest.findById(req.params.id);

    if (!bulkRequest) {
      return res.status(404).json({
        success: false,
        message: 'Bulk request not found'
      });
    }

    if (bulkRequest.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This bulk request is no longer accepting offers'
      });
    }

    // Check if already submitted offer
    const existingOffer = bulkRequest.offers.find(
      offer => offer.farmer.toString() === req.user._id.toString()
    );

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an offer for this request'
      });
    }

    // Add offer
    bulkRequest.offers.push({
      farmer: req.user._id,
      cropId,
      quantity,
      price,
      message
    });

    await bulkRequest.save();

    res.status(201).json({
      success: true,
      message: 'Offer submitted successfully',
      data: { bulkRequest }
    });
  } catch (error) {
    console.error('Submit offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting offer',
      error: error.message
    });
  }
});

// @route   PUT /api/bulk-requests/:id/offer/:offerId
// @desc    Accept or reject offer
// @access  Private (Processor - owner only)
router.put('/:id/offer/:offerId', protect, authorize('processor'), async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    const bulkRequest = await BulkRequest.findById(req.params.id);

    if (!bulkRequest) {
      return res.status(404).json({
        success: false,
        message: 'Bulk request not found'
      });
    }

    // Check ownership
    if (bulkRequest.processor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    // Find and update offer
    const offer = bulkRequest.offers.id(req.params.offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    offer.status = status;
    await bulkRequest.save();

    res.status(200).json({
      success: true,
      message: `Offer ${status} successfully`,
      data: { bulkRequest }
    });
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating offer',
      error: error.message
    });
  }
});

// @route   PUT /api/bulk-requests/:id
// @desc    Update bulk request
// @access  Private (Processor - owner only)
router.put('/:id', protect, authorize('processor'), async (req, res) => {
  try {
    let bulkRequest = await BulkRequest.findById(req.params.id);

    if (!bulkRequest) {
      return res.status(404).json({
        success: false,
        message: 'Bulk request not found'
      });
    }

    // Check ownership
    if (bulkRequest.processor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    bulkRequest = await BulkRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Bulk request updated successfully',
      data: { bulkRequest }
    });
  } catch (error) {
    console.error('Update bulk request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bulk request',
      error: error.message
    });
  }
});

module.exports = router;
