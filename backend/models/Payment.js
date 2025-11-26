const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  upiId: {
    type: String,
    trim: true,
    default: ''
  },
  bankAccount: {
    accountNumber: {
      type: String,
      trim: true,
      default: ''
    },
    ifscCode: {
      type: String,
      trim: true,
      default: ''
    },
    bankName: {
      type: String,
      trim: true,
      default: ''
    },
    accountHolderName: {
      type: String,
      trim: true,
      default: ''
    }
  },
  qrCode: {
    type: String, // Base64 encoded QR code image
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);

