const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['farmer', 'shg', 'fpo', 'processor', 'consumer', 'admin'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profileImage: {
    type: String,
    default: ''
  },
  region: {
    state: String,
    district: String,
    village: String,
    pincode: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  // For SHG/FPO
  organizationName: String,
  organizationType: String,
  registrationNumber: String,
  memberCount: Number,
  
  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['aadhar', 'pan', 'registration', 'certification', 'other']
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Certifications (for farmers/SHGs)
  certifications: [{
    type: String,
    enum: ['organic', 'fssai', 'fairtrade', 'other']
  }],
  
  // Language preference
  language: {
    type: String,
    enum: ['en', 'hi', 'ta', 'te', 'kn', 'mr'],
    default: 'en'
  },
  
  // OTP for verification
  otp: String,
  otpExpiry: Date,
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
