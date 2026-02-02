const mongoose = require('mongoose');
require('dotenv').config();

// User Schema
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  role: String,
  status: String,
  avatar: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createDefaultAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@mbfarm.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Password: admin123');
      mongoose.connection.close();
      return;
    }

    // Create default admin user
    const adminUser = new User({
      fullName: 'Admin User',
      email: 'admin@mbfarm.com',
      password: 'admin123', // In production, this should be hashed
      role: 'Admin',
      status: 'Active',
      avatar: ''
    });

    await adminUser.save();
    
    console.log('\n✅ Default admin user created successfully!');
    console.log('-----------------------------------');
    console.log('Email: admin@mbfarm.com');
    console.log('Password: admin123');
    console.log('-----------------------------------');
    console.log('\nPlease log in with these credentials and change the password immediately.');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.connection.close();
  }
}

createDefaultAdmin();
