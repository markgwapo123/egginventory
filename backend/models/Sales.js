const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['peewee', 'pullets', 'small', 'medium', 'large', 'xlarge', 'jumbo', 'crack']
  },
  trays: {
    type: Number,
    default: 0,
    min: 0
  },
  pieces: {
    type: Number,
    default: 0,
    min: 0
  },
  pricePerTray: {
    type: Number,
    required: true
  },
  pricePerPiece: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  }
});

const salesSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  items: [saleItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
salesSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.totalAmount, 0);
  next();
});

module.exports = mongoose.model('Sales', salesSchema);
