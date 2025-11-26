const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: '💼'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);

