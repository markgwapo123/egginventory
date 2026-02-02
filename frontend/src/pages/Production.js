import React, { useState, useEffect } from 'react';
import { productionAPI } from '../services/api';

const Production = () => {
  const [productions, setProductions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [harvested, setHarvested] = useState({
    peewee: '',
    pullets: '',
    small: '',
    medium: '',
    large: '',
    xlarge: '',
    jumbo: '',
    crack: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [expandedDates, setExpandedDates] = useState({});

  useEffect(() => {
    fetchProductions();
  }, []);

  const fetchProductions = async () => {
    try {
      const response = await productionAPI.getAll();
      setProductions(response.data);
    } catch (error) {
      console.error('Error fetching productions:', error);
    }
  };

  const handleInputChange = (size, value) => {
    setHarvested({ ...harvested, [size]: value === '' ? '' : parseInt(value) || 0 });
  };

  // Calculate totals
  const totalHarvested = Object.values(harvested).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  const totalTrays = Math.floor(totalHarvested / 30);
  const hasInput = Object.values(harvested).some(val => val !== '' && val !== 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const harvestedData = {
      peewee: parseInt(harvested.peewee) || 0,
      pullets: parseInt(harvested.pullets) || 0,
      small: parseInt(harvested.small) || 0,
      medium: parseInt(harvested.medium) || 0,
      large: parseInt(harvested.large) || 0,
      xlarge: parseInt(harvested.xlarge) || 0,
      jumbo: parseInt(harvested.jumbo) || 0,
      crack: parseInt(harvested.crack) || 0
    };

    try {
      await productionAPI.create({ date: selectedDate, harvested: harvestedData });
      setMessage({ text: '✓ Production recorded successfully!', type: 'success' });
      setHarvested({ peewee: '', pullets: '', small: '', medium: '', large: '', xlarge: '', jumbo: '', crack: '' });
      fetchProductions();
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Error recording production', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this production record?')) return;

    try {
      await productionAPI.delete(id);
      setMessage({ text: '✓ Record deleted', type: 'success' });
      fetchProductions();
    } catch (error) {
      setMessage({ text: 'Error deleting record', type: 'error' });
    }
  };

  // Group productions by date
  const groupedProductions = productions.reduce((acc, prod) => {
    const dateKey = new Date(prod.date).toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(prod);
    return acc;
  }, {});

  const toggleDateExpand = (dateKey) => {
    setExpandedDates(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };

  // Calculate totals for a date group
  const calculateDateTotals = (prods) => {
    const totals = {
      beginningBalance: { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0, xlarge: 0, jumbo: 0, crack: 0 },
      harvested: { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0, xlarge: 0, jumbo: 0, crack: 0 },
      endingBalance: { peewee: 0, pullets: 0, small: 0, medium: 0, large: 0, xlarge: 0, jumbo: 0, crack: 0 },
      totalEggs: 0,
      totalTrays: 0
    };

    prods.forEach(prod => {
      ['peewee', 'pullets', 'small', 'medium', 'large', 'xlarge', 'jumbo', 'crack'].forEach(size => {
        totals.beginningBalance[size] += prod.beginningBalance[size] || 0;
        totals.harvested[size] += prod.harvested[size] || 0;
        totals.endingBalance[size] += prod.endingBalance[size] || 0;
      });
      totals.totalEggs += prod.totalEggs || 0;
      totals.totalTrays += prod.totalTrays || 0;
    });

    return totals;
  };

  const eggSizes = [
    { key: 'peewee', label: 'Peewee', icon: '🥚' },
    { key: 'pullets', label: 'Pullets', icon: '🥚' },
    { key: 'small', label: 'Small', icon: '🥚' },
    { key: 'medium', label: 'Medium', icon: '🥚' },
    { key: 'large', label: 'Large', icon: '🥚' },
    { key: 'xlarge', label: 'Xlarge', icon: '🥚' },
    { key: 'jumbo', label: 'Jumbo', icon: '🥚' },
    { key: 'crack', label: 'Crack', icon: '🥚' }
  ];

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50', fontSize: '2rem' }}>
        🥚 Egg Production
      </h1>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
          {message.text}
        </div>
      )}

      {/* SECTION A: Record Daily Production */}
      <div className="card" style={{ 
        marginBottom: '2.5rem',
        border: '2px solid #3498db',
        boxShadow: '0 4px 16px rgba(52, 152, 219, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2rem' }}>📝</span>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#2c3e50' }}>
            Record Daily Production
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Date Selection */}
          <div style={{ marginBottom: '1.5rem', maxWidth: '300px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#495057',
              fontSize: '0.95rem'
            }}>
              📅 Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            />
          </div>

          {/* Egg Size Inputs */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '1rem', 
              fontWeight: '600',
              color: '#495057',
              fontSize: '0.95rem'
            }}>
              Harvested Eggs (by size)
            </label>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem'
            }}>
              {eggSizes.map(({ key, label, icon }) => (
                <div key={key}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#6c757d',
                    marginBottom: '0.5rem',
                    textAlign: 'center'
                  }}>
                    {icon} {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={harvested[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3498db'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Live Calculation Display */}
          <div style={{
            background: '#f8f9fa',
            padding: '1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                  Total Eggs
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e67e22' }}>
                  {totalHarvested}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                  Trays
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9b59b6' }}>
                  {totalTrays}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading || !hasInput}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              backgroundColor: hasInput ? '#27ae60' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: hasInput ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: hasInput ? '0 4px 12px rgba(39, 174, 96, 0.3)' : 'none'
            }}
            onMouseOver={(e) => {
              if (hasInput) e.target.style.backgroundColor = '#229954';
            }}
            onMouseOut={(e) => {
              if (hasInput) e.target.style.backgroundColor = '#27ae60';
            }}
          >
            {loading ? '⏳ Saving...' : '✓ Save Production Record'}
          </button>
        </form>
      </div>

      {/* SECTION B: Production History */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2rem' }}>📊</span>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#2c3e50' }}>
            Production History
          </h2>
        </div>

        {productions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#95a5a6' }}>
            📭 No production records found
          </div>
        ) : (
          <div className="production-history">
            {Object.entries(groupedProductions).map(([dateKey, prods]) => {
              const isExpanded = expandedDates[dateKey];
              const hasMultiple = prods.length > 1;
              const totals = calculateDateTotals(prods);

              return (
                <div key={dateKey} className="production-day-card">
                  {/* Date Header */}
                  <div 
                    className={`production-day-header ${hasMultiple ? 'clickable' : ''}`}
                    onClick={() => hasMultiple && toggleDateExpand(dateKey)}
                  >
                    <div className="date-info">
                      <span className="date-icon">📅</span>
                      <span className="date-text">{dateKey}</span>
                      {hasMultiple && (
                        <span className="entry-badge">{prods.length} entries</span>
                      )}
                    </div>
                    <div className="day-summary">
                      <span className="summary-item">
                        <span className="summary-label">Harvested:</span>
                        <span className="summary-value">{totals.totalTrays} trays</span>
                      </span>
                      {hasMultiple && (
                        <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>
                          ▼
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Production Details */}
                  <div className={`production-details ${(!hasMultiple || isExpanded) ? 'visible' : 'hidden'}`}>
                    {prods.map((prod, index) => (
                      <div key={prod._id} className="production-entry">
                        {hasMultiple && (
                          <div className="entry-number">Entry {index + 1}</div>
                        )}
                        
                        <div className="egg-sections">
                          {/* Beginning Stock */}
                          <div className="egg-section beginning-section">
                            <h4 className="section-title">📥 Beginning Stock</h4>
                            <div className="egg-grid">
                              {eggSizes.map(({ key, label }) => (
                                <div key={key} className="egg-item">
                                  <span className="egg-label">{label}</span>
                                  <span className="egg-value">{prod.beginningBalance[key]}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Harvested Today */}
                          <div className="egg-section harvest-section">
                            <h4 className="section-title">🌅 Harvested Today</h4>
                            <div className="egg-grid">
                              {eggSizes.map(({ key, label }) => (
                                <div key={key} className="egg-item">
                                  <span className="egg-label">{label}</span>
                                  <span className="egg-value highlight">{prod.harvested[key]}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Ending Stock */}
                          <div className="egg-section ending-section">
                            <h4 className="section-title">📦 Ending Stock</h4>
                            <div className="egg-grid">
                              {eggSizes.map(({ key, label }) => (
                                <div key={key} className="egg-item">
                                  <span className="egg-label">{label}</span>
                                  <span className="egg-value">{prod.endingBalance[key]}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="production-actions">
                          <div className="total-info">
                            Total: <strong>{prod.totalTrays} trays</strong>
                          </div>
                          <button 
                            className="btn btn-danger" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(prod._id);
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Production;
