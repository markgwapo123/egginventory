const mongoose = require('mongoose');
require('dotenv').config();

console.log('Attempting to connect with:');
console.log('URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ Connection Failed:');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Full error:', error);
    process.exit(1);
  });
