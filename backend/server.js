const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

// Import routes
const productionRoutes = require('./routes/production');
const pricingRoutes = require('./routes/pricing');
const salesRoutes = require('./routes/sales');
const inventoryRoutes = require('./routes/inventory');
const reportsRoutes = require('./routes/reports');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/production', productionRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Egg Inventory Management System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
