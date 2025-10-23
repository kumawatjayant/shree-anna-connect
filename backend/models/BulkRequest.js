const mongoose = require('mongoose');

const bulkRequestSchema = new mongoose.Schema({
  processor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestNumber: {
    type: String,
    unique: true
  },
  cropType: {
    type: String,
    required: true
  },
  variety: String,
  quantity: {
    value: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton'],
      default: 'kg'
    }
  },
  qualityRequirements: {
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'Any']
    },
    certifications: [{
      type: String,
      enum: ['organic', 'pesticide_free', 'traditional']
    }],
    moistureContent: String,
    otherSpecs: String
  },
  priceRange: {
    min: Number,
    max: Number
  },
  deliveryLocation: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  requiredBy: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'partially_fulfilled', 'fulfilled', 'closed', 'cancelled'],
    default: 'open'
  },
  offers: [{
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop'
    },
    quantity: Number,
    price: Number,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  description: {
    type: String,
    maxlength: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate request number
bulkRequestSchema.pre('save', function(next) {
  if (!this.requestNumber) {
    this.requestNumber = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('BulkRequest', bulkRequestSchema);
