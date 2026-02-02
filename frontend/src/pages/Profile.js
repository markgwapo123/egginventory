import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    avatar: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Staff'
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userDataStr = localStorage.getItem('userData');
      
      if (!userDataStr) {
        setError('No user data found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const userData = JSON.parse(userDataStr);
      
      if (!userData.id) {
        setError('Invalid user data. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await usersAPI.getById(userData.id);
      setUser(response.data);
      setFormData({
        fullName: response.data.fullName,
        email: response.data.email,
        avatar: response.data.avatar || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleNewUserChange = (e) => {
    setNewUserData({
      ...newUserData,
      [e.target.name]: e.target.value
    });
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUserData({ ...newUserData, password });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await usersAPI.create(newUserData);
      setMessage('User created successfully!');
      setShowAddUserForm(false);
      setNewUserData({
        fullName: '',
        email: '',
        password: '',
        role: 'Staff'
      });
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await usersAPI.update(user._id, formData);
      setUser(response.data);
      
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.fullName = response.data.fullName;
      userData.email = response.data.email;
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setMessage('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await usersAPI.changePassword(user._id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage('Password changed successfully!');
      setPasswordMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Profile not found</h2>
          {error && <p className="alert alert-error">{error}</p>}
          <p>Please <a href="/login" style={{color: '#2c5f2d', fontWeight: 'bold'}}>log in</a> to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Profile</h1>

      {message && (
        <div className="alert alert-success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      <div className="profile-layout">
        {/* Profile Card */}
        <div className="card profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} />
              ) : (
                <div className="avatar-placeholder">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2>{user.fullName}</h2>
              <p className="profile-email">{user.email}</p>
              <span className={`role-badge ${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${user.status.toLowerCase()}`}>
                {user.status}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Member Since:</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {!editMode && !passwordMode && (
            <div className="profile-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setEditMode(true)}
              >
                ✏️ Edit Profile
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setPasswordMode(true)}
              >
                🔒 Change Password
              </button>
            </div>
          )}
        </div>

        {/* Add User Section - Admin Only */}
        {user.role === 'Admin' && !editMode && !passwordMode && (
          <div className="card">
            <div className="admin-section-header">
              <h3>👥 User Management</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddUserForm(!showAddUserForm)}
              >
                {showAddUserForm ? '✕ Cancel' : '+ Add New User'}
              </button>
            </div>

            {showAddUserForm && (
              <form onSubmit={handleAddUser} className="add-user-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={newUserData.fullName}
                    onChange={handleNewUserChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleNewUserChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label>Temporary Password *</label>
                  <div className="password-input-group">
                    <input
                      type="text"
                      name="password"
                      value={newUserData.password}
                      onChange={handleNewUserChange}
                      required
                      placeholder="Enter temporary password"
                    />
                    <button 
                      type="button"
                      className="btn btn-secondary"
                      onClick={generatePassword}
                    >
                      Generate
                    </button>
                  </div>
                  <small className="form-hint">
                    User can change this password after first login
                  </small>
                </div>

                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="role"
                    value={newUserData.role}
                    onChange={handleNewUserChange}
                    required
                  >
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save User
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddUserForm(false);
                      setNewUserData({
                        fullName: '',
                        email: '',
                        password: '',
                        role: 'Staff'
                      });
                      setError('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!showAddUserForm && (
              <p className="section-hint">
                As an admin, you can add new users to the system. Click "Add New User" to get started.
              </p>
            )}
          </div>
        )}

        {/* Edit Profile Form */}
        {editMode && (
          <div className="card">
            <h3>Edit Profile</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Avatar URL (Optional)</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditMode(false);
                    setError('');
                    setFormData({
                      fullName: user.fullName,
                      email: user.email,
                      avatar: user.avatar || ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Change Password Form */}
        {passwordMode && (
          <div className="card">
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setPasswordMode(false);
                    setError('');
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
