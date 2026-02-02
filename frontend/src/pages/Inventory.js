import React, { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [currentInventory, setCurrentInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const [allResponse, currentResponse] = await Promise.all([
        inventoryAPI.getAll(),
        inventoryAPI.getCurrent()
      ]);
      setInventory(allResponse.data);
      setCurrentInventory(currentResponse.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory record?')) return;

    try {
      await inventoryAPI.delete(id);
      setMessage({ text: '✓ Inventory record deleted successfully!', type: 'success' });
      fetchInventory();
    } catch (error) {
      setMessage({ text: 'Error deleting inventory record', type: 'error' });
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Inventory Management</h1>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
          {message.text}
        </div>
      )}

      {currentInventory && (
        <div className="card">
          <h2>Current Inventory Summary</h2>
          <div className="grid grid-5">
            <div style={{ textAlign: 'center', padding: '1rem', background: '#ecf0f1', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#7f8c8d' }}>Peewee</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>{currentInventory.peewee}</p>
              <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
                {Math.floor(currentInventory.peewee / 30)} trays
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#ecf0f1', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#7f8c8d' }}>Pullets</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>{currentInventory.pullets}</p>
              <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
                {Math.floor(currentInventory.pullets / 30)} trays
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#ecf0f1', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#7f8c8d' }}>Small</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>{currentInventory.small}</p>
              <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
                {Math.floor(currentInventory.small / 30)} trays
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#ecf0f1', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#7f8c8d' }}>Medium</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>{currentInventory.medium}</p>
              <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
                {Math.floor(currentInventory.medium / 30)} trays
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#ecf0f1', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#7f8c8d' }}>Large</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>{currentInventory.large}</p>
              <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
                {Math.floor(currentInventory.large / 30)} trays
              </p>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#3498db', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Total: {currentInventory.totalEggs} eggs ({currentInventory.totalTrays} trays)</h3>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Inventory History</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Peewee</th>
                <th>Pullets</th>
                <th>Small</th>
                <th>Medium</th>
                <th>Large</th>
                <th>Total Eggs</th>
                <th>Total Trays</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>No inventory records found</td>
                </tr>
              ) : (
                inventory.map((inv) => (
                  <tr key={inv._id}>
                    <td>{new Date(inv.date).toLocaleDateString()}</td>
                    <td>{inv.peewee}</td>
                    <td>{inv.pullets}</td>
                    <td>{inv.small}</td>
                    <td>{inv.medium}</td>
                    <td>{inv.large}</td>
                    <td>{inv.totalEggs}</td>
                    <td>{inv.totalTrays}</td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(inv._id)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
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

export default Inventory;
