const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Get all inventory records
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ date: -1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current inventory (latest date)
router.get('/current', async (req, res) => {
  try {
    const inventory = await Inventory.findOne().sort({ date: -1 });
    if (!inventory) {
      return res.status(404).json({ message: 'No inventory found' });
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inventory by date
router.get('/date/:date', async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ 
      date: new Date(req.params.date) 
    });
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found for this date' });
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete inventory record
router.delete('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.json({ message: 'Inventory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
