const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['subsidy', 'training', 'loan', 'marketing', 'certification', 'other'],
    required: true
  },
  eligibility: {
    roles: [{
      type: String,
      enum: ['farmer', 'shg', 'fpo', 'processor']
    }],
    regions: [{
      state: String,
      districts: [String]
    }],
    otherCriteria: String
  },
  benefits: {
    type: String,
    required: true
  },
  applicationProcess: {
    type: String
  },
  documents: [{
    name: String,
    url: String
  }],
  externalLink: {
    type: String
  },
  contactInfo: {
    department: String,
    phone: String,
    email: String,
    address: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Scheme', schemeSchema);
