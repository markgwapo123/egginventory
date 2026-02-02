import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await reportsAPI.getDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50', fontSize: '2rem' }}>Dashboard</h1>

      {/* Key Metrics - Most Important First */}
      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card" style={{ 
          background: 'white',
          color: '#2c3e50',
          border: '2px solid #3498db',
          boxShadow: '0 4px 12px rgba(52, 152, 219, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>💰</span>
            <h3 style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>Today's Income</h3>
          </div>
          <div className="stat-value" style={{ color: '#27ae60', fontSize: '2.5rem' }}>
            ₱{dashboard?.todayIncome?.toFixed(2) || '0.00'}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#95a5a6', marginTop: '0.5rem' }}>
            {dashboard?.todaySales || 0} transactions
          </p>
        </div>

        <div className="stat-card" style={{ 
          background: 'white',
          color: '#2c3e50',
          border: '2px solid #9b59b6',
          boxShadow: '0 4px 12px rgba(155, 89, 182, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>📦</span>
            <h3 style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>Current Stock</h3>
          </div>
          <div className="stat-value" style={{ color: '#9b59b6', fontSize: '2.5rem' }}>
            {dashboard?.currentInventory?.totalEggs || 0}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#95a5a6', marginTop: '0.5rem' }}>
            eggs ({dashboard?.currentInventory?.totalTrays || 0} trays)
          </p>
        </div>

        <div className="stat-card" style={{ 
          background: 'white',
          color: '#2c3e50',
          border: '2px solid #e67e22',
          boxShadow: '0 4px 12px rgba(230, 126, 34, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🥚</span>
            <h3 style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>Today's Harvest</h3>
          </div>
          <div className="stat-value" style={{ color: '#e67e22', fontSize: '2.5rem' }}>
            {dashboard?.todayProduction?.harvested 
              ? Object.values(dashboard.todayProduction.harvested).reduce((a, b) => a + b, 0)
              : 0}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#95a5a6', marginTop: '0.5rem' }}>
            eggs collected
          </p>
        </div>
      </div>

      {/* Secondary Metric */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>📈 Weekly Income</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
              ₱{dashboard?.weeklyIncome?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div style={{ fontSize: '3rem', opacity: 0.2 }}>💵</div>
        </div>
      </div>

      {/* Detailed Information - Expandable Sections */}
      <div className="grid grid-2">
        {/* Inventory Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Stock by Size</h2>
          </div>
          {dashboard?.currentInventory ? (
            <div style={{ 
              display: 'grid', 
              gap: '0.75rem'
            }}>
              {[
                { name: 'Peewee', value: dashboard.currentInventory.peewee, emoji: '🥚' },
                { name: 'Pullets', value: dashboard.currentInventory.pullets, emoji: '🥚' },
                { name: 'Small', value: dashboard.currentInventory.small, emoji: '🥚' },
                { name: 'Medium', value: dashboard.currentInventory.medium, emoji: '🥚' },
                { name: 'Large', value: dashboard.currentInventory.large, emoji: '🥚' },
                { name: 'Xlarge', value: dashboard.currentInventory.xlarge, emoji: '🥚' },
                { name: 'Jumbo', value: dashboard.currentInventory.jumbo, emoji: '🥚' },
                { name: 'Crack', value: dashboard.currentInventory.crack, emoji: '🥚' }
              ].map(item => (
                <div key={item.name} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <span style={{ fontWeight: '500', color: '#495057' }}>
                    {item.emoji} {item.name}
                  </span>
                  <span style={{ 
                    fontWeight: '700', 
                    fontSize: '1.1rem',
                    color: '#2c3e50'
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#95a5a6', padding: '2rem' }}>
              No inventory data
            </p>
          )}
        </div>

        {/* Today's Production Summary */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🌅</span>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Today's Production</h2>
          </div>
          {dashboard?.todayProduction ? (
            <div>
              <div style={{ 
                background: '#fff3cd',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid #ffc107'
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#856404', marginBottom: '0.25rem' }}>
                  Total Production
                </p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#856404' }}>
                  {dashboard.todayProduction.totalEggs} eggs
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem'
              }}>
                {[
                  { name: 'Peewee', value: dashboard.todayProduction.harvested.peewee },
                  { name: 'Pullets', value: dashboard.todayProduction.harvested.pullets },
                  { name: 'Small', value: dashboard.todayProduction.harvested.small },
                  { name: 'Medium', value: dashboard.todayProduction.harvested.medium },
                  { name: 'Large', value: dashboard.todayProduction.harvested.large },
                  { name: 'Xlarge', value: dashboard.todayProduction.harvested.xlarge },
                  { name: 'Jumbo', value: dashboard.todayProduction.harvested.jumbo },
                  { name: 'Crack', value: dashboard.todayProduction.harvested.crack }
                ].map(item => (
                  <div key={item.name} style={{ 
                    padding: '0.5rem',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ color: '#6c757d' }}>{item.name}</div>
                    <div style={{ fontWeight: '700', color: '#2c3e50', fontSize: '1.1rem' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#95a5a6', padding: '2rem' }}>
              No production today
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
