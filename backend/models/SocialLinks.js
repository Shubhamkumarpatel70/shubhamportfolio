const mongoose = require('mongoose');

const socialLinksSchema = new mongoose.Schema({
  github: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  },
  instagram: {
    type: String,
    trim: true
  },
  facebook: {
    type: String,
    trim: true
  },
  youtube: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SocialLinks', socialLinksSchema);

