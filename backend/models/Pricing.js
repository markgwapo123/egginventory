const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['peewee', 'pullets', 'small', 'medium', 'large'],
    unique: true
  },
  pricePerTray: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerPiece: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pricing', pricingSchema);
