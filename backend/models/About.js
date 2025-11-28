const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    trim: true
  },
  experience: [{
    company: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      trim: true
    },
    startDate: {
      type: String,
      trim: true
    },
    endDate: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    current: {
      type: Boolean,
      default: false
    }
  }],
  education: [{
    institution: {
      type: String,
      trim: true
    },
    degree: {
      type: String,
      trim: true
    },
    field: {
      type: String,
      trim: true
    },
    startDate: {
      type: String,
      trim: true
    },
    endDate: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);

