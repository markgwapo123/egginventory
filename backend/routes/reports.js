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
        harvested: { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0, xlarge: 0, jumbo: 0, crack: 0 },
        beginningBalance: { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0, xlarge: 0, jumbo: 0, crack: 0 },
        endingBalance: { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0, xlarge: 0, jumbo: 0, crack: 0 }
      };
      
      todayProductions.forEach(prod => {
        todayProduction.totalEggs += prod.totalEggs || 0;
        todayProduction.totalTrays += prod.totalTrays || 0;
        ['peewee', 'pullets', 'small', 'medium', 'large', 'xlarge', 'jumbo', 'crack'].forEach(size => {
          todayProduction.harvested[size] += prod.harvested[size] || 0;
          todayProduction.beginningBalance[size] += prod.beginningBalance[size] || 0;
          todayProduction.endingBalance[size] += prod.endingBalance[size] || 0;
        });
      });
    }
    
    // Get today's sales with aggregation for better performance
    const [salesSummary, todaySalesCount] = await Promise.all([
      Sales.aggregate([
        { $match: { date: { $gte: today, $lte: endOfDay } } },
        {
          $facet: {
            totalIncome: [
              { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ],
            salesBySize: [
              { $unwind: '$items' },
              {
                $group: {
                  _id: '$items.size',
                  totalPieces: {
                    $sum: { $add: [{ $multiply: ['$items.trays', 30] }, '$items.pieces'] }
                  }
                }
              }
            ]
          }
        }
      ]),
      Sales.countDocuments({ date: { $gte: today, $lte: endOfDay } })
    ]);
    
    const todaySalesBySize = {
      peewee: 0, pullets: 0, small: 0, medium: 0, large: 0, xlarge: 0, jumbo: 0, crack: 0
    };
    
    let totalIncome = 0;
    if (salesSummary.length > 0) {
      if (salesSummary[0].totalIncome.length > 0) {
        totalIncome = salesSummary[0].totalIncome[0].total;
      }
      salesSummary[0].salesBySize.forEach(item => {
        todaySalesBySize[item._id] = item.totalPieces;
      });
    }
    
    // Get current inventory from latest production record and subtract ALL sales to date
    const latestProduction = await Production.findOne().sort({ date: -1, createdAt: -1 }).lean();
    
    let currentInventory = null;
    if (latestProduction) {
      // Use aggregation to calculate total sales by size since latest production
      const salesAgg = await Sales.aggregate([
        { $match: { date: { $gte: latestProduction.date } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.size',
            totalPieces: {
              $sum: { $add: [{ $multiply: ['$items.trays', 30] }, '$items.pieces'] }
            }
          }
        }
      ]);
      
      const totalSalesBySize = {
        peewee: 0, pullets: 0, small: 0, medium: 0, large: 0, xlarge: 0, jumbo: 0, crack: 0
      };
      
      salesAgg.forEach(item => {
        totalSalesBySize[item._id] = item.totalPieces;
      });
      
      const sizes = ['peewee', 'pullets', 'small', 'medium', 'large', 'xlarge', 'jumbo', 'crack'];
      
      // Calculate remaining stock: production ending balance - sales
      currentInventory = {
        peewee: Math.max(0, (latestProduction.endingBalance.peewee || 0) - totalSalesBySize.peewee),
        pullets: Math.max(0, (latestProduction.endingBalance.pullets || 0) - totalSalesBySize.pullets),
        small: Math.max(0, (latestProduction.endingBalance.small || 0) - totalSalesBySize.small),
        medium: Math.max(0, (latestProduction.endingBalance.medium || 0) - totalSalesBySize.medium),
        large: Math.max(0, (latestProduction.endingBalance.large || 0) - totalSalesBySize.large),
        xlarge: Math.max(0, (latestProduction.endingBalance.xlarge || 0) - totalSalesBySize.xlarge),
        jumbo: Math.max(0, (latestProduction.endingBalance.jumbo || 0) - totalSalesBySize.jumbo),
        crack: Math.max(0, (latestProduction.endingBalance.crack || 0) - totalSalesBySize.crack),
        date: latestProduction.date
      };
      
      // Calculate totals
      currentInventory.totalEggs = sizes.reduce((sum, size) => sum + currentInventory[size], 0);
      currentInventory.totalTrays = Math.floor(currentInventory.totalEggs / 30);
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
      todaySales: todaySalesCount,
      todayIncome: totalIncome,
      weeklyIncome,
      currentInventory: currentInventory || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
