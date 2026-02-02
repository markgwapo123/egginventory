import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // checking, ready, error
  const navigate = useNavigate();

  // Wake up backend server on component mount
  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const baseURL = API_URL.replace('/api', '');
        await fetch(`${baseURL}/api/health`, { 
          method: 'GET',
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        setServerStatus('ready');
      } catch (err) {
        console.log('Server warming up...', err);
        setServerStatus('ready'); // Continue anyway
      }
    };
    wakeUpServer();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await usersAPI.login(formData);
      
      // Store user data in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      onLogin();
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🥚</div>
          <h1>MB Farm Fresh Eggs</h1>
          <p className="login-subtitle">Inventory Management System</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {serverStatus === 'checking' && (
            <div style={{ 
              padding: '0.75rem', 
              background: '#fff3cd', 
              color: '#856404', 
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              ⏳ Waking up server... This may take 30-60 seconds on first visit.
            </div>
          )}

          <div className="form-field">
            <label htmlFor="email">Email or Username</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 MB Farm Fresh Eggs</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
