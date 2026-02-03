import React, { useState, useEffect } from 'react';
import { pricingAPI } from '../services/api';

const Pricing = () => {
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const eggSizes = ['peewee', 'pullets', 'small', 'medium', 'large', 'xlarge', 'jumbo', 'crack'];

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const response = await pricingAPI.getAll();
      if (response.data.length === 0) {
        await pricingAPI.initialize();
        const newResponse = await pricingAPI.getAll();
        setPricing(newResponse.data);
      } else {
        setPricing(response.data);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (size) => {
    const priceData = pricing.find(p => p.size === size);
    setEditing({
      size,
      pricePerTray: priceData?.pricePerTray || 0,
      pricePerPiece: priceData?.pricePerPiece || 0
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Check if pricing exists for this size
      const existingPrice = pricing.find(p => p.size === editing.size);
      
      if (existingPrice) {
        // Update existing
        await pricingAPI.update(editing.size, {
          pricePerTray: parseFloat(editing.pricePerTray),
          pricePerPiece: parseFloat(editing.pricePerPiece)
        });
      } else {
        // Create new
        await pricingAPI.createOrUpdate({
          size: editing.size,
          pricePerTray: parseFloat(editing.pricePerTray),
          pricePerPiece: parseFloat(editing.pricePerPiece)
        });
      }
      
      setMessage({ text: 'Pricing updated successfully!', type: 'success' });
      setEditing(null);
      fetchPricing();
    } catch (error) {
      setMessage({ text: 'Error updating pricing', type: 'error' });
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Pricing Management</h1>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h2>Egg Prices</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>
          Set prices per tray (30 eggs) and per piece for each egg size
        </p>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Egg Size</th>
                <th>Price per Tray (₱)</th>
                <th>Price per Piece (₱)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eggSizes.map(size => {
                const priceData = pricing.find(p => p.size === size);
                const isEditing = editing && editing.size === size;

                return (
                  <tr key={size}>
                    <td style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{size}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editing.pricePerTray}
                          onChange={(e) => setEditing({...editing, pricePerTray: e.target.value})}
                          style={{ width: '120px', padding: '0.5rem' }}
                        />
                      ) : (
                        `₱${priceData?.pricePerTray?.toFixed(2) || '0.00'}`
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editing.pricePerPiece}
                          onChange={(e) => setEditing({...editing, pricePerPiece: e.target.value})}
                          style={{ width: '120px', padding: '0.5rem' }}
                        />
                      ) : (
                        `₱${priceData?.pricePerPiece?.toFixed(2) || '0.00'}`
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <>
                          <button onClick={handleUpdate} className="btn btn-success">Save</button>
                          <button onClick={() => setEditing(null)} className="btn btn-secondary">Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => handleEdit(size)} className="btn btn-primary">Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
          <strong>Note:</strong> Changing prices here will only affect new sales. Existing sales records will retain their original prices.
        </div>
      </div>
    </div>
  );
};

export default Pricing;
