const express = require('express');
const router = express.Router();
const Sales = require('../models/Sales');
const Inventory = require('../models/Inventory');
const Pricing = require('../models/Pricing');

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sales.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales by date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sales = await Sales.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales by specific date
router.get('/date/:date', async (req, res) => {
  try {
    const startOfDay = new Date(req.params.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(req.params.date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const sales = await Sales.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 });
    
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new sale
router.post('/', async (req, res) => {
  try {
    const { date, items, notes } = req.body;
    
    // Check inventory availability
    const inventory = await Inventory.findOne({ 
      date: new Date(date) 
    });
    
    if (!inventory) {
      return res.status(400).json({ 
        message: 'No inventory found for this date. Please add production first.' 
      });
    }
    
    // Validate stock availability and calculate amounts
    const processedItems = [];
    for (const item of items) {
      const totalPieces = (item.trays * 30) + item.pieces;
      const availableStock = inventory[item.size] || 0;
      
      if (totalPieces > availableStock) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.size}. Available: ${availableStock} pieces` 
        });
      }
      
      // Get current pricing
      const pricing = await Pricing.findOne({ size: item.size });
      if (!pricing) {
        return res.status(400).json({ 
          message: `Pricing not found for ${item.size}` 
        });
      }
      
      const totalAmount = (item.trays * pricing.pricePerTray) + 
                         (item.pieces * pricing.pricePerPiece);
      
      processedItems.push({
        size: item.size,
        trays: item.trays,
        pieces: item.pieces,
        pricePerTray: pricing.pricePerTray,
        pricePerPiece: pricing.pricePerPiece,
        totalAmount
      });
      
      // Deduct from inventory
      inventory[item.size] -= totalPieces;
    }
    
    // Save updated inventory
    await inventory.save();
    
    // Create sale record
    const sale = new Sales({
      date: new Date(date),
      items: processedItems,
      notes: notes || ''
    });
    
    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get sale by ID
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete sale (and restore inventory)
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    // Restore inventory
    const inventory = await Inventory.findOne({ date: sale.date });
    if (inventory) {
      sale.items.forEach(item => {
        const totalPieces = (item.trays * 30) + item.pieces;
        inventory[item.size] += totalPieces;
      });
      await inventory.save();
    }
    
    await sale.deleteOne();
    res.json({ message: 'Sale deleted and inventory restored' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
