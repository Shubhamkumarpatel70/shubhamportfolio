const mongoose = require('mongoose');

const coffeePurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  numberOfCoffees: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  projectLink: {
    type: String,
    trim: true,
    default: ''
  },
  rejectionReason: {
    type: String,
    trim: true,
    default: ''
  },
  paymentProof: {
    type: String, // Base64 encoded image or URL
    default: ''
  },
  paymentType: {
    type: String,
    enum: ['upi', 'bank'],
    default: 'upi'
  },
  utr: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CoffeePurchase', coffeePurchaseSchema);

