const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  tech: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: '💼'
  },
  link: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);

