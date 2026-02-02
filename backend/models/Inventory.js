const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  peewee: { type: Number, default: 0, min: 0 },
  pullets: { type: Number, default: 0, min: 0 },
  small: { type: Number, default: 0, min: 0 },
  medium: { type: Number, default: 0, min: 0 },
  large: { type: Number, default: 0, min: 0 },
  xlarge: { type: Number, default: 0, min: 0 },
  jumbo: { type: Number, default: 0, min: 0 },
  crack: { type: Number, default: 0, min: 0 },
  totalEggs: { type: Number, default: 0 },
  totalTrays: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Calculate totals before saving
inventorySchema.pre('save', function(next) {
  const sizes = ['peewee', 'pullets', 'small', 'medium', 'large', 'xlarge', 'jumbo', 'crack'];
  this.totalEggs = sizes.reduce((sum, size) => sum + (this[size] || 0), 0);
  this.totalTrays = Math.floor(this.totalEggs / 30);
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
