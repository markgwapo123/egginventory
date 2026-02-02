# Egg Inventory, Pricing & Sales System

A complete full-stack web application for managing egg production, inventory, pricing, and sales tracking built with MongoDB, Node.js, Express, and React.

## Features

### 1. Egg Production Module
- Record daily egg production per size (Peewee, Pullets, Small, Medium, Large)
- Automatically calculate total eggs and trays (30 eggs per tray)
- Carry over previous day's ending balance
- Compute ending balance after harvest

### 2. Inventory Management
- Real-time inventory tracking
- Convert eggs to trays automatically
- Prevent negative inventory
- View inventory history

### 3. Pricing Module
- Set price per tray and per piece for each egg size
- Prices editable anytime
- Old sales retain original prices

### 4. Sales Module
- Record sales by tray or per piece
- Auto-calculate total amount
- Deduct sold eggs from inventory
- Prevent selling more than available stock
- Delete sales and restore inventory

### 5. Reports & Dashboard
- Daily production report
- Daily sales report with income summary
- Inventory balance report
- Dashboard with key metrics

## Technology Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

**Frontend:**
- React.js
- React Router for navigation
- Axios for API calls
- Modern CSS styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Clone or Navigate to the Project Directory
```bash
cd d:\egg
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
copy .env.example .env

# Edit .env file with your MongoDB connection string
# Default: mongodb://localhost:27017/egg_inventory
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ..\frontend

# Install dependencies
npm install
```

## Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service, it should already be running)
# Otherwise start it manually:
mongod
```

### 2. Start Backend Server

```bash
# From the backend directory
cd d:\egg\backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Start Frontend Development Server

```bash
# From the frontend directory (open a new terminal)
cd d:\egg\frontend
npm start
```

The React app will start on `http://localhost:3000` and automatically open in your browser.

## API Endpoints

### Production
- `GET /api/production` - Get all production records
- `GET /api/production/date/:date` - Get production by date
- `POST /api/production` - Create production record
- `PUT /api/production/:id` - Update production record
- `DELETE /api/production/:id` - Delete production record

### Pricing
- `GET /api/pricing` - Get all pricing
- `GET /api/pricing/:size` - Get pricing by size
- `POST /api/pricing` - Create or update pricing
- `PUT /api/pricing/:size` - Update pricing
- `POST /api/pricing/initialize` - Initialize default pricing

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/date/:date` - Get sales by date
- `POST /api/sales` - Create new sale
- `GET /api/sales/:id` - Get sale by ID
- `DELETE /api/sales/:id` - Delete sale

### Inventory
- `GET /api/inventory` - Get all inventory records
- `GET /api/inventory/current` - Get current inventory
- `GET /api/inventory/date/:date` - Get inventory by date

### Reports
- `GET /api/reports/production/:date` - Production report
- `GET /api/reports/sales/:date` - Sales report
- `GET /api/reports/inventory/:date` - Inventory report
- `GET /api/reports/dashboard` - Dashboard summary

## Usage Guide

### First Time Setup

1. **Initialize Pricing:**
   - Go to the Pricing page
   - Default prices will be initialized automatically
   - You can edit them as needed

2. **Record Production:**
   - Go to Production page
   - Select today's date
   - Enter harvested eggs for each size
   - Click "Save Production"

3. **Make a Sale:**
   - Go to Sales page
   - Select date (must have inventory for that date)
   - Add items (size, trays, pieces)
   - Click "Record Sale"

4. **View Reports:**
   - Go to Reports page
   - Select report type and date
   - Click "Generate Report"

## Default Pricing

The system initializes with these default prices (editable):
- Peewee: ₱100/tray, ₱4/piece
- Pullets: ₱120/tray, ₱5/piece
- Small: ₱140/tray, ₱5/piece
- Medium: ₱160/tray, ₱6/piece
- Large: ₱180/tray, ₱7/piece

## Important Notes

- 1 tray = 30 eggs
- Production must be recorded before making sales
- Sales are deducted from inventory automatically
- Deleting a sale restores the inventory
- Each day's production carries over the previous day's ending balance
- Changing prices only affects new sales, not existing ones

## Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check the MONGODB_URI in the .env file
- Verify MongoDB is accessible on the specified port

**CORS Error:**
- Backend includes CORS middleware
- Frontend proxy is configured in package.json

**Port Already in Use:**
- Backend: Change PORT in .env file
- Frontend: It will prompt you to use a different port

## MVP Limitations

- Single admin user (no authentication)
- Cash sales only
- No customer records
- No online payments
- Local deployment only

## Future Enhancements

- User authentication
- Customer management
- Multiple payment methods
- Email receipts
- Advanced analytics
- Mobile app
- Cloud deployment

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
