import React, { useState, useEffect } from 'react';
import { salesAPI, pricingAPI, inventoryAPI } from '../services/api';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([
    { size: 'peewee', trays: 0, pieces: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchInitialData();
  }, [selectedDate]);

  const fetchInitialData = async () => {
    try {
      const [pricingRes, inventoryRes, salesRes] = await Promise.all([
        pricingAPI.getAll(),
        inventoryAPI.getByDate(selectedDate),
        salesAPI.getByDate(selectedDate)
      ]);
      setPricing(pricingRes.data);
      setInventory(inventoryRes.data);
      setSales(salesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setInventory(null);
    }
  };

  const addItem = () => {
    setItems([...items, { size: 'peewee', trays: 0, pieces: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'size' ? value : parseInt(value) || 0;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = pricing.find(p => p.size === item.size);
      if (!price) return total;
      return total + (item.trays * price.pricePerTray) + (item.pieces * price.pricePerPiece);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await salesAPI.create({ date: selectedDate, items, notes });
      setMessage({ text: 'Sale recorded successfully!', type: 'success' });
      setItems([{ size: 'peewee', trays: 0, pieces: 0 }]);
      setNotes('');
      fetchInitialData();
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Error recording sale', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;

    try {
      await salesAPI.delete(id);
      setMessage({ text: 'Sale deleted successfully!', type: 'success' });
      fetchInitialData();
    } catch (error) {
      setMessage({ text: 'Error deleting sale', type: 'error' });
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Sales Management</h1>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h2>New Sale</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          {!inventory && (
            <div className="alert alert-error">
              No inventory available for this date. Please record production first.
            </div>
          )}

          {inventory && (
            <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '4px', marginBottom: '1rem' }}>
              <strong>Available Stock:</strong> Peewee: {inventory.peewee} | Pullets: {inventory.pullets} | 
              Small: {inventory.small} | Medium: {inventory.medium} | Large: {inventory.large}
            </div>
          )}

          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Sale Items</h3>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Size</label>
                <select
                  value={item.size}
                  onChange={(e) => updateItem(index, 'size', e.target.value)}
                  required
                >
                  <option value="peewee">Peewee</option>
                  <option value="pullets">Pullets</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Trays</label>
                <input
                  type="number"
                  min="0"
                  value={item.trays}
                  onChange={(e) => updateItem(index, 'trays', e.target.value)}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Pieces</label>
                <input
                  type="number"
                  min="0"
                  max="29"
                  value={item.pieces}
                  onChange={(e) => updateItem(index, 'pieces', e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={addItem}>
            Add Item
          </button>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>Total Amount: ₱{calculateTotal().toFixed(2)}</h3>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              placeholder="Add any notes about this sale..."
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading || !inventory}>
            {loading ? 'Recording...' : 'Record Sale'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Sales for {new Date(selectedDate).toLocaleDateString()}</h2>
        {sales.length === 0 ? (
          <p className="alert alert-info">No sales recorded for this date</p>
        ) : (
          <div>
            {sales.map((sale) => (
              <div key={sale._id} style={{ padding: '1rem', background: '#f8f9fa', marginBottom: '1rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p><strong>Time:</strong> {new Date(sale.createdAt).toLocaleTimeString()}</p>
                    <p><strong>Total:</strong> ₱{sale.totalAmount.toFixed(2)}</p>
                    {sale.notes && <p><strong>Notes:</strong> {sale.notes}</p>}
                    <div style={{ marginTop: '0.5rem' }}>
                      {sale.items.map((item, idx) => (
                        <span key={idx} style={{ marginRight: '1rem', fontSize: '0.9rem' }}>
                          {item.size}: {item.trays} trays + {item.pieces} pcs
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(sale._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
