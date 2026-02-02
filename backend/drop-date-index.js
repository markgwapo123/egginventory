const mongoose = require('mongoose');
require('dotenv').config();

async function dropDateIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('productions');
    
    // Drop the unique index on date field
    try {
      await collection.dropIndex('date_1');
      console.log('Successfully dropped the unique index on date field');
    } catch (error) {
      if (error.code === 27) {
        console.log('Index does not exist or already dropped');
      } else {
        throw error;
      }
    }
    
    // List remaining indexes
    const indexes = await collection.indexes();
    console.log('Remaining indexes:', indexes);
    
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

dropDateIndex();
