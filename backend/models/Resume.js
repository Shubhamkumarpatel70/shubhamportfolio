const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    trim: true,
    default: ''
  },
  fileName: {
    type: String,
    trim: true,
    default: ''
  },
  fileData: {
    type: String, // Base64 encoded PDF
    default: ''
  },
  fileType: {
    type: String,
    default: 'application/pdf'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);

