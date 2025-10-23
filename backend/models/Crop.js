const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropType: {
    type: String,
    required: true,
    enum: [
      'Foxtail Millet', 'Pearl Millet', 'Finger Millet', 'Little Millet',
      'Kodo Millet', 'Proso Millet', 'Barnyard Millet', 'Sorghum',
      'Red Gram', 'Green Gram', 'Black Gram', 'Bengal Gram', 'Other'
    ]
  },
  variety: {
    type: String,
    required: true
  },
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
  harvestDate: {
    type: Date,
    required: true
  },
  expectedPrice: {
    type: Number,
    required: true,
    min: 0
  },
  photos: [{
    type: String
  }],
  description: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['available', 'partially_sold', 'sold', 'expired'],
    default: 'available'
  },
  certifications: [{
    type: String,
    enum: ['organic', 'pesticide_free', 'traditional', 'certified_seed']
  }],
  traceabilityId: {
    type: String,
    unique: true
  },
  farmDetails: {
    farmSize: Number,
    soilType: String,
    irrigationType: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  qualityGrade: {
    type: String,
    enum: ['A', 'B', 'C'],
    default: 'B'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create geospatial index
cropSchema.index({ 'farmDetails.location': '2dsphere' });

// Generate traceability ID before saving
cropSchema.pre('save', function(next) {
  if (!this.traceabilityId) {
    this.traceabilityId = `CROP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Crop', cropSchema);
