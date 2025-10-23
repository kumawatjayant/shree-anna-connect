const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const { protect, authorize, checkVerified } = require('../middleware/auth');

// @route   POST /api/crops
// @desc    Create a new crop listing
// @access  Private (Farmer/FPO/SHG)
router.post('/', protect, authorize('farmer', 'fpo', 'shg'), checkVerified, async (req, res) => {
  try {
    const cropData = {
      ...req.body,
      seller: req.user._id
    };

    const crop = await Crop.create(cropData);

    res.status(201).json({
      success: true,
      message: 'Crop listed successfully',
      data: { crop }
    });
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating crop listing',
      error: error.message
    });
  }
});

// @route   GET /api/crops/my-crops
// @desc    Get current user's crop listings
// @access  Private (Farmer/FPO/SHG)
router.get('/my-crops', protect, authorize('farmer', 'fpo', 'shg'), async (req, res) => {
  try {
    const crops = await Crop.find({ seller: req.user._id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: crops.length,
      data: { crops }
    });
  } catch (error) {
    console.error('Get my crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your crops',
      error: error.message
    });
  }
});

// @route   GET /api/crops
// @desc    Get all crop listings with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      cropType,
      status,
      minPrice,
      maxPrice,
      region,
      certification,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (cropType) query.cropType = cropType;
    if (status) query.status = status;
    if (minPrice || maxPrice) {
      query.expectedPrice = {};
      if (minPrice) query.expectedPrice.$gte = Number(minPrice);
      if (maxPrice) query.expectedPrice.$lte = Number(maxPrice);
    }
    if (certification) query.certifications = { $in: [certification] };

    // Execute query with pagination
    const crops = await Crop.find(query)
      .populate('seller', 'name phone region organizationName verificationStatus')
      .sort(sort)
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

// @route   GET /api/crops/my-listings
// @desc    Get current user's crop listings
// @access  Private (Farmer/FPO/SHG)
router.get('/my-listings', protect, authorize('farmer', 'fpo', 'shg'), async (req, res) => {
  try {
    const crops = await Crop.find({ seller: req.user._id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: { crops }
    });
  } catch (error) {
    console.error('Get my crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your crops',
      error: error.message
    });
  }
});

// @route   GET /api/crops/:id
// @desc    Get single crop by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('seller', 'name phone email region organizationName verificationStatus certifications');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { crop }
    });
  } catch (error) {
    console.error('Get crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching crop',
      error: error.message
    });
  }
});

// @route   PUT /api/crops/:id
// @desc    Update crop listing
// @access  Private (Owner only)
router.put('/:id', protect, authorize('farmer', 'fpo', 'shg'), async (req, res) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Check ownership
    if (crop.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this crop'
      });
    }

    crop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Crop updated successfully',
      data: { crop }
    });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating crop',
      error: error.message
    });
  }
});

// @route   DELETE /api/crops/:id
// @desc    Delete crop listing
// @access  Private (Owner only)
router.delete('/:id', protect, authorize('farmer', 'fpo', 'shg'), async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Check ownership
    if (crop.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this crop'
      });
    }

    // Soft delete
    crop.isActive = false;
    await crop.save();

    res.status(200).json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting crop',
      error: error.message
    });
  }
});

module.exports = router;
