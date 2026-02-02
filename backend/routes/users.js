const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if user is active
    if (user.status === 'Disabled') {
      return res.status(403).json({ message: 'Account is disabled. Please contact administrator.' });
    }
    
    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Return user data (excluding password)
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar
    };
    
    res.json({ 
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user (in production, hash password with bcrypt)
    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password, // In production: await bcrypt.hash(password, 10)
      role: role || 'Staff'
    });
    
    await newUser.save();
    
    // Return user data (excluding password)
    const userData = {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      avatar: newUser.avatar
    };
    
    res.status(201).json(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { fullName, email, role, status, avatar } = req.body;
    
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email.toLowerCase();
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (avatar !== undefined) updateData.avatar = avatar;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Change password
router.put('/:id/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    if (user.password !== currentPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password (in production, hash with bcrypt)
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

// Toggle user status (Enable/Disable)
router.put('/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.status = user.status === 'Active' ? 'Disabled' : 'Active';
    await user.save();
    
    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ message: 'Error toggling user status' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
