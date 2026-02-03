const express = require('express');
const router = express.Router();
const Production = require('../models/Production');
const Inventory = require('../models/Inventory');

// Get all production records
router.get('/', async (req, res) => {
  try {
    const productions = await Production.find().sort({ date: -1 });
    res.json(productions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get production by date
router.get('/date/:date', async (req, res) => {
  try {
    const production = await Production.findOne({ 
      date: new Date(req.params.date) 
    });
    if (!production) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    res.json(production);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create production record
router.post('/', async (req, res) => {
  try {
    const { date, harvested } = req.body;
    
    // Get previous day's ending balance
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    
    const previousProduction = await Production.findOne({ 
      date: previousDate 
    }).sort({ date: -1 });
    
    const beginningBalance = previousProduction 
      ? previousProduction.endingBalance 
      : { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0, xlarge: 0, jumbo: 0, crack: 0 };
    
    const production = new Production({
      date: new Date(date),
      beginningBalance,
      harvested: harvested || { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0, xlarge: 0, jumbo: 0, crack: 0 }
    });
    
    const newProduction = await production.save();
    
    // Update inventory
    await updateInventory(date, newProduction.endingBalance);
    
    res.status(201).json(newProduction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update production record
router.put('/:id', async (req, res) => {
  try {
    const { harvested } = req.body;
    const production = await Production.findById(req.params.id);
    
    if (!production) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    
    if (harvested) {
      production.harvested = harvested;
    }
    
    const updatedProduction = await production.save();
    
    // Update inventory
    await updateInventory(updatedProduction.date, updatedProduction.endingBalance);
    
    res.json(updatedProduction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete production record
router.delete('/:id', async (req, res) => {
  try {
    const production = await Production.findById(req.params.id);
    if (!production) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    
    await production.deleteOne();
    res.json({ message: 'Production record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to update inventory
async function updateInventory(date, balance) {
  try {
    await Inventory.findOneAndUpdate(
      { date: new Date(date) },
      { 
        peewee: balance.peewee,
        pullets: balance.pullets,
        small: balance.small,
        medium: balance.medium,
        large: balance.large,
        xlarge: balance.xlarge,
        jumbo: balance.jumbo,
        crack: balance.crack
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
}

module.exports = router;
