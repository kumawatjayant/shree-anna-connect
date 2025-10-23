const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Flour', 'Snacks', 'Cookies', 'Noodles', 'Pasta', 'Breakfast Mix',
      'Ready to Cook', 'Laddu', 'Chips', 'Health Mix', 'Other'
    ]
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  ingredients: [{
    type: String
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['gm', 'kg', 'piece', 'pack'],
    default: 'gm'
  },
  packSize: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  photos: [{
    type: String
  }],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    servingSize: String
  },
  certifications: [{
    type: String,
    enum: ['fssai', 'organic', 'iso', 'halal', 'other']
  }],
  shelfLife: {
    value: Number,
    unit: {
      type: String,
      enum: ['days', 'months', 'years']
    }
  },
  traceabilityId: {
    type: String,
    unique: true
  },
  sourceCrops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'out_of_stock', 'discontinued'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate traceability ID
productSchema.pre('save', function(next) {
  if (!this.traceabilityId) {
    this.traceabilityId = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

// Update average rating
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.ratings.average = sum / this.reviews.length;
    this.ratings.count = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
