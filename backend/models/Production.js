const mongoose = require('mongoose');

const eggSizeSchema = new mongoose.Schema({
  peewee: { type: Number, default: 0 },
  pullets: { type: Number, default: 0 },
  small: { type: Number, default: 0 },
  medium: { type: Number, default: 0 },
  large: { type: Number, default: 0 }
});

const productionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  beginningBalance: eggSizeSchema,
  harvested: eggSizeSchema,
  endingBalance: eggSizeSchema,
  totalEggs: {
    type: Number,
    default: 0
  },
  totalTrays: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
productionSchema.pre('save', function(next) {
  const sizes = ['peewee', 'pullets', 'small', 'medium', 'large'];
  
  // Initialize endingBalance if not exists
  if (!this.endingBalance) {
    this.endingBalance = {};
  }
  
  // Calculate ending balance
  sizes.forEach(size => {
    this.endingBalance[size] = 
      (this.beginningBalance[size] || 0) + (this.harvested[size] || 0);
  });
  
  // Calculate total eggs
  this.totalEggs = sizes.reduce((sum, size) => 
    sum + (this.endingBalance[size] || 0), 0);
  
  // Calculate total trays (30 eggs per tray)
  this.totalTrays = Math.floor(this.totalEggs / 30);
  
  next();
});

module.exports = mongoose.model('Production', productionSchema);
