const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderType: {
    type: String,
    enum: ['crop', 'product'],
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'orderType'
    },
    itemType: {
      type: String,
      enum: ['Crop', 'Product']
    },
    name: String,
    quantity: Number,
    unit: String,
    price: Number,
    subtotal: Number
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['upi', 'bank_transfer', 'cod', 'wallet']
    },
    transactionId: String,
    paidAt: Date
  },
  shippingAddress: {
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String
  },
  deliveryDetails: {
    trackingNumber: String,
    courier: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  notes: {
    buyer: String,
    seller: String,
    admin: String
  },
  cancellationReason: String
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

// Add status to history
orderSchema.methods.addStatusHistory = function(status, note = '') {
  this.statusHistory.push({ status, note, timestamp: new Date() });
};

module.exports = mongoose.model('Order', orderSchema);
