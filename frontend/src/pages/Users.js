import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Staff'
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    setCurrentUser(userData);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await usersAPI.create(formData);
      setMessage('User created successfully!');
      setShowAddForm(false);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: 'Staff'
      });
      fetchUsers();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await usersAPI.toggleStatus(userId);
      setMessage('User status updated successfully!');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error toggling user status:', err);
      setError('Failed to update user status');
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'Admin';

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>User Management</h1>
        {isAdmin && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕ Cancel' : '+ Add User'}
          </button>
        )}
      </div>

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

      {!isAdmin && (
        <div className="alert alert-info">
          ℹ️ Only administrators can add or manage users.
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && isAdmin && (
        <div className="card">
          <h3>Add New User</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
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
                value={formData.role}
                onChange={handleChange}
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
                  setShowAddForm(false);
                  setFormData({
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
        </div>
      )}

      {/* Users List */}
      <div className="card">
        <h3>All Users ({users.length})</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? "6" : "5"} style={{ textAlign: 'center' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-small">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} />
                          ) : (
                            user.fullName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span>{user.fullName}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    {isAdmin && (
                      <td>
                        <button
                          className={`btn btn-small ${user.status === 'Active' ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => handleToggleStatus(user._id)}
                          disabled={user._id === currentUser?.id}
                        >
                          {user.status === 'Active' ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
