const express = require('express');
const router = express.Router();
const Pricing = require('../models/Pricing');

// Get all pricing
router.get('/', async (req, res) => {
  try {
    const pricing = await Pricing.find();
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pricing by size
router.get('/:size', async (req, res) => {
  try {
    const pricing = await Pricing.findOne({ size: req.params.size });
    if (!pricing) {
      return res.status(404).json({ message: 'Pricing not found' });
    }
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update pricing
router.post('/', async (req, res) => {
  try {
    const { size, pricePerTray, pricePerPiece } = req.body;
    
    const pricing = await Pricing.findOneAndUpdate(
      { size },
      { pricePerTray, pricePerPiece },
      { upsert: true, new: true, runValidators: true }
    );
    
    res.status(201).json(pricing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update pricing
router.put('/:size', async (req, res) => {
  try {
    const { pricePerTray, pricePerPiece } = req.body;
    
    const pricing = await Pricing.findOneAndUpdate(
      { size: req.params.size },
      { pricePerTray, pricePerPiece },
      { new: true, runValidators: true }
    );
    
    if (!pricing) {
      return res.status(404).json({ message: 'Pricing not found' });
    }
    
    res.json(pricing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Initialize default pricing
router.post('/initialize', async (req, res) => {
  try {
    const sizes = ['peewee', 'pullets', 'small', 'medium', 'large'];
    const defaultPrices = {
      peewee: { tray: 100, piece: 4 },
      pullets: { tray: 120, piece: 5 },
      small: { tray: 140, piece: 5 },
      medium: { tray: 160, piece: 6 },
      large: { tray: 180, piece: 7 }
    };
    
    const pricingPromises = sizes.map(size => 
      Pricing.findOneAndUpdate(
        { size },
        { 
          pricePerTray: defaultPrices[size].tray, 
          pricePerPiece: defaultPrices[size].piece 
        },
        { upsert: true, new: true }
      )
    );
    
    const pricing = await Promise.all(pricingPromises);
    res.json(pricing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
