const express = require('express');
const router = express.Router();
const Production = require('../models/Production');
const Sales = require('../models/Sales');
const Inventory = require('../models/Inventory');

// Daily production report
router.get('/production/:date', async (req, res) => {
  try {
    const production = await Production.findOne({ 
      date: new Date(req.params.date) 
    });
    
    if (!production) {
      return res.status(404).json({ message: 'No production data for this date' });
    }
    
    res.json(production);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Daily sales report
router.get('/sales/:date', async (req, res) => {
  try {
    const startOfDay = new Date(req.params.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(req.params.date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const sales = await Sales.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });
    
    // Calculate summary
    const summary = {
      date: req.params.date,
      totalIncome: 0,
      salesBySize: {
        peewee: { trays: 0, pieces: 0, amount: 0 },
        pullets: { trays: 0, pieces: 0, amount: 0 },
        small: { trays: 0, pieces: 0, amount: 0 },
        medium: { trays: 0, pieces: 0, amount: 0 },
        large: { trays: 0, pieces: 0, amount: 0 }
      },
      transactions: sales
    };
    
    sales.forEach(sale => {
      summary.totalIncome += sale.totalAmount;
      sale.items.forEach(item => {
        summary.salesBySize[item.size].trays += item.trays;
        summary.salesBySize[item.size].pieces += item.pieces;
        summary.salesBySize[item.size].amount += item.totalAmount;
      });
    });
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Inventory balance report
router.get('/inventory/:date', async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ 
      date: new Date(req.params.date) 
    });
    
    if (!inventory) {
      return res.status(404).json({ message: 'No inventory data for this date' });
    }
    
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard summary
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's production - aggregate all records for today
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const todayProductions = await Production.find({
      date: { $gte: today, $lte: endOfDay }
    });
    
    // Aggregate all production for today
    let todayProduction = null;
    if (todayProductions.length > 0) {
      todayProduction = {
        totalEggs: 0,
        totalTrays: 0,
        harvested: { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0 },
        beginningBalance: { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0 },
        endingBalance: { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0 }
      };
      
      todayProductions.forEach(prod => {
        todayProduction.totalEggs += prod.totalEggs || 0;
        todayProduction.totalTrays += prod.totalTrays || 0;
        ['peewee', 'pullets', 'small', 'medium', 'large'].forEach(size => {
          todayProduction.harvested[size] += prod.harvested[size] || 0;
          todayProduction.beginningBalance[size] += prod.beginningBalance[size] || 0;
          todayProduction.endingBalance[size] += prod.endingBalance[size] || 0;
        });
      });
    }
    
    // Get today's sales
    const todaySales = await Sales.find({
      date: { $gte: today, $lte: endOfDay }
    });
    
    const totalIncome = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    // Get current inventory from latest production record
    const latestProduction = await Production.findOne().sort({ date: -1, createdAt: -1 });
    
    let currentInventory = null;
    if (latestProduction) {
      const sizes = ['peewee', 'pullets', 'small', 'medium', 'large'];
      const totalEggs = sizes.reduce((sum, size) => sum + (latestProduction.endingBalance[size] || 0), 0);
      
      currentInventory = {
        peewee: latestProduction.endingBalance.peewee || 0,
        pullets: latestProduction.endingBalance.pullets || 0,
        small: latestProduction.endingBalance.small || 0,
        medium: latestProduction.endingBalance.medium || 0,
        large: latestProduction.endingBalance.large || 0,
        totalEggs: totalEggs,
        totalTrays: Math.floor(totalEggs / 30),
        date: latestProduction.date
      };
    }
    
    // Get current inventory from Inventory collection as fallback
    if (!currentInventory) {
      const inventoryRecord = await Inventory.findOne().sort({ date: -1 });
      currentInventory = inventoryRecord;
    }
    
    // Get weekly sales
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklySales = await Sales.find({
      date: { $gte: weekAgo, $lte: endOfDay }
    });
    
    const weeklyIncome = weeklySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    res.json({
      todayProduction: todayProduction || null,
      todaySales: todaySales.length,
      todayIncome: totalIncome,
      weeklyIncome,
      currentInventory: currentInventory || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
