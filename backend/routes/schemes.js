const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');
const { protect } = require('../middleware/auth');

// @route   GET /api/schemes
// @desc    Get all active schemes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, state, role } = req.query;

    const query = { isActive: true };
    
    if (category) query.category = category;
    if (role) query['eligibility.roles'] = role;
    if (state) query['eligibility.regions.state'] = state;

    const schemes = await Scheme.find(query).sort('-createdAt');

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

// @route   GET /api/schemes/eligible
// @desc    Get schemes eligible for current user
// @access  Private
router.get('/eligible', protect, async (req, res) => {
  try {
    const query = {
      isActive: true,
      'eligibility.roles': req.user.role
    };

    if (req.user.region?.state) {
      query.$or = [
        { 'eligibility.regions.state': req.user.region.state },
        { 'eligibility.regions': { $size: 0 } }
      ];
    }

    const schemes = await Scheme.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      data: { schemes }
    });
  } catch (error) {
    console.error('Get eligible schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching eligible schemes',
      error: error.message
    });
  }
});

// @route   GET /api/schemes/:id
// @desc    Get single scheme
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { scheme }
    });
  } catch (error) {
    console.error('Get scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scheme',
      error: error.message
    });
  }
});

module.exports = router;
