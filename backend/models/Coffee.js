const mongoose = require('mongoose');

const coffeeSchema = new mongoose.Schema({
  minCoffee: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  maxCoffee: {
    type: Number,
    required: true,
    default: 10,
    min: 1
  },
  coffeePrice: {
    type: Number,
    required: true,
    default: 50,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coffee', coffeeSchema);

