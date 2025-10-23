const express = require('express');
const router = express.Router();
const Traceability = require('../models/Traceability');
const QRCode = require('qrcode');
const { protect } = require('../middleware/auth');

// @route   POST /api/traceability
// @desc    Create traceability record
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const traceabilityData = {
      ...req.body,
      farmer: req.user._id
    };

    const traceability = await Traceability.create(traceabilityData);

    // Generate QR code
    const qrData = {
      batchId: traceability.batchId,
      farmer: req.user.name,
      location: traceability.farmDetails.location
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
    traceability.qrCode = qrCode;
    await traceability.save();

    res.status(201).json({
      success: true,
      message: 'Traceability record created successfully',
      data: { traceability }
    });
  } catch (error) {
    console.error('Create traceability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating traceability record',
      error: error.message
    });
  }
});

// @route   GET /api/traceability/:batchId
// @desc    Get traceability info by batch ID
// @access  Public
router.get('/:batchId', async (req, res) => {
  try {
    const traceability = await Traceability.findOne({ batchId: req.params.batchId })
      .populate('farmer', 'name phone region organizationName certifications')
      .populate('productId', 'name category')
      .populate('cropId', 'cropType variety');

    if (!traceability) {
      return res.status(404).json({
        success: false,
        message: 'Traceability record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { traceability }
    });
  } catch (error) {
    console.error('Get traceability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching traceability data',
      error: error.message
    });
  }
});

// @route   PUT /api/traceability/:id/processing
// @desc    Add processing stage
// @access  Private
router.put('/:id/processing', protect, async (req, res) => {
  try {
    const { stage, location, description } = req.body;

    const traceability = await Traceability.findById(req.params.id);

    if (!traceability) {
      return res.status(404).json({
        success: false,
        message: 'Traceability record not found'
      });
    }

    traceability.processingDetails.push({
      stage,
      date: new Date(),
      location,
      processedBy: req.user._id,
      description
    });

    traceability.timeline.push({
      event: `Processing: ${stage}`,
      description
    });

    await traceability.save();

    res.status(200).json({
      success: true,
      message: 'Processing stage added successfully',
      data: { traceability }
    });
  } catch (error) {
    console.error('Add processing stage error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding processing stage',
      error: error.message
    });
  }
});

// @route   PUT /api/traceability/:id/quality-check
// @desc    Add quality check
// @access  Private
router.put('/:id/quality-check', protect, async (req, res) => {
  try {
    const { checkedBy, parameters, result, remarks } = req.body;

    const traceability = await Traceability.findById(req.params.id);

    if (!traceability) {
      return res.status(404).json({
        success: false,
        message: 'Traceability record not found'
      });
    }

    traceability.qualityChecks.push({
      date: new Date(),
      checkedBy,
      parameters,
      result,
      remarks
    });

    traceability.timeline.push({
      event: 'Quality Check',
      description: `Result: ${result}`
    });

    await traceability.save();

    res.status(200).json({
      success: true,
      message: 'Quality check added successfully',
      data: { traceability }
    });
  } catch (error) {
    console.error('Add quality check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding quality check',
      error: error.message
    });
  }
});

module.exports = router;
