const mongoose = require('mongoose');

const traceabilitySchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmDetails: {
    location: {
      village: String,
      district: String,
      state: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    farmSize: Number,
    soilType: String,
    irrigationType: String
  },
  cultivationDetails: {
    datePlanted: Date,
    dateHarvested: Date,
    seedVariety: String,
    fertilizersUsed: [{
      name: String,
      type: {
        type: String,
        enum: ['organic', 'chemical', 'bio']
      },
      quantity: String
    }],
    pesticidesUsed: [{
      name: String,
      quantity: String
    }],
    waterSource: String
  },
  certifications: [{
    type: {
      type: String,
      enum: ['organic', 'fssai', 'pesticide_free', 'fairtrade', 'other']
    },
    certificateNumber: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    documentUrl: String
  }],
  processingDetails: [{
    stage: String,
    date: Date,
    location: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    description: String
  }],
  qualityChecks: [{
    date: Date,
    checkedBy: String,
    parameters: [{
      name: String,
      value: String,
      unit: String
    }],
    result: {
      type: String,
      enum: ['passed', 'failed']
    },
    remarks: String
  }],
  qrCode: {
    type: String
  },
  timeline: [{
    event: String,
    date: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate batch ID
traceabilitySchema.pre('save', function(next) {
  if (!this.batchId) {
    this.batchId = `BATCH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Traceability', traceabilitySchema);
