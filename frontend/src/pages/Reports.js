import React, { useState } from 'react';
import { reportsAPI } from '../services/api';

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('sales');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let response;
      switch (reportType) {
        case 'production':
          response = await reportsAPI.getProductionReport(selectedDate);
          break;
        case 'sales':
          response = await reportsAPI.getSalesReport(selectedDate);
          break;
        case 'inventory':
          response = await reportsAPI.getInventoryReport(selectedDate);
          break;
        default:
          return;
      }
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderProductionReport = () => (
    <div>
      <h3>Production Details</h3>
      <div className="grid grid-2">
        <div>
          <h4>Beginning Balance</h4>
          <ul>
            <li>Peewee: {reportData.beginningBalance.peewee}</li>
            <li>Pullets: {reportData.beginningBalance.pullets}</li>
            <li>Small: {reportData.beginningBalance.small}</li>
            <li>Medium: {reportData.beginningBalance.medium}</li>
            <li>Large: {reportData.beginningBalance.large}</li>
          </ul>
        </div>
        <div>
          <h4>Harvested</h4>
          <ul>
            <li>Peewee: {reportData.harvested.peewee}</li>
            <li>Pullets: {reportData.harvested.pullets}</li>
            <li>Small: {reportData.harvested.small}</li>
            <li>Medium: {reportData.harvested.medium}</li>
            <li>Large: {reportData.harvested.large}</li>
          </ul>
        </div>
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#3498db', color: 'white', borderRadius: '4px' }}>
        <h3>Total: {reportData.totalEggs} eggs ({reportData.totalTrays} trays)</h3>
      </div>
    </div>
  );

  const renderSalesReport = () => (
    <div>
      <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#27ae60', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Total Income</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₱{reportData.totalIncome?.toFixed(2) || '0.00'}</div>
      </div>

      <h3>Sales by Size</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Size</th>
              <th>Trays Sold</th>
              <th>Pieces Sold</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(reportData.salesBySize).map(([size, data]) => (
              <tr key={size}>
                <td style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{size}</td>
                <td>{data.trays}</td>
                <td>{data.pieces}</td>
                <td>₱{data.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reportData.transactions && reportData.transactions.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Transaction Details</h3>
          {reportData.transactions.map((transaction, idx) => (
            <div key={idx} style={{ padding: '1rem', background: '#f8f9fa', marginBottom: '1rem', borderRadius: '4px' }}>
              <p><strong>Time:</strong> {new Date(transaction.createdAt).toLocaleTimeString()}</p>
              <p><strong>Amount:</strong> ₱{transaction.totalAmount.toFixed(2)}</p>
              {transaction.notes && <p><strong>Notes:</strong> {transaction.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInventoryReport = () => (
    <div>
      <h3>Inventory Balance</h3>
      <div className="grid grid-5">
        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#ecf0f1', borderRadius: '8px' }}>
          <h4>Peewee</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>{reportData.peewee}</p>
          <p style={{ color: '#7f8c8d' }}>{Math.floor(reportData.peewee / 30)} trays</p>
        </div>
        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#ecf0f1', borderRadius: '8px' }}>
          <h4>Pullets</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>{reportData.pullets}</p>
          <p style={{ color: '#7f8c8d' }}>{Math.floor(reportData.pullets / 30)} trays</p>
        </div>
        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#ecf0f1', borderRadius: '8px' }}>
          <h4>Small</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>{reportData.small}</p>
          <p style={{ color: '#7f8c8d' }}>{Math.floor(reportData.small / 30)} trays</p>
        </div>
        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#ecf0f1', borderRadius: '8px' }}>
          <h4>Medium</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>{reportData.medium}</p>
          <p style={{ color: '#7f8c8d' }}>{Math.floor(reportData.medium / 30)} trays</p>
        </div>
        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#ecf0f1', borderRadius: '8px' }}>
          <h4>Large</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>{reportData.large}</p>
          <p style={{ color: '#7f8c8d' }}>{Math.floor(reportData.large / 30)} trays</p>
        </div>
      </div>
      <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#3498db', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
        <h3>Total: {reportData.totalEggs} eggs ({reportData.totalTrays} trays)</h3>
      </div>
    </div>
  );

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Reports</h1>

      <div className="card">
        <h2>Generate Report</h2>
        <div className="grid grid-3">
          <div className="form-group">
            <label>Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="sales">Sales Report</option>
              <option value="production">Production Report</option>
              <option value="inventory">Inventory Report</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>&nbsp;</label>
            <button onClick={fetchReport} className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {reportData && (
        <div className="card">
          <h2>
            {reportType === 'sales' && 'Sales Report'}
            {reportType === 'production' && 'Production Report'}
            {reportType === 'inventory' && 'Inventory Report'}
            {' - '}
            {new Date(selectedDate).toLocaleDateString()}
          </h2>
          {reportType === 'production' && renderProductionReport()}
          {reportType === 'sales' && renderSalesReport()}
          {reportType === 'inventory' && renderInventoryReport()}
        </div>
      )}

      {!reportData && !loading && (
        <div className="card">
          <p className="alert alert-info">Select a report type and date, then click "Generate Report"</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
