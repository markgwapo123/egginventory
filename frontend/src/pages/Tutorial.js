import React, { useState } from 'react';

const Tutorial = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>
          🥚 MB Farm Fresh Eggs Tutorial
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: '0.95' }}>
          Your complete guide to managing egg inventory like a pro!
        </p>
        <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', opacity: '0.9' }}>
          Follow this step-by-step tutorial to master the system in minutes.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="card" style={{ marginBottom: '2rem', background: '#f8f9fa' }}>
        <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>📑 Quick Navigation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
          {['overview', 'login', 'production', 'inventory', 'sales', 'pricing', 'reports', 'users', 'tips'].map(section => (
            <button
              key={section}
              onClick={() => {
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                padding: '0.75rem',
                background: 'white',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: System Overview */}
      <div id="overview" className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #3498db' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          🎯 What is MB Farm Fresh Eggs System?
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555' }}>
          MB Farm Fresh Eggs is a complete inventory management system designed specifically for egg farms. 
          It helps you track production, manage stock, record sales, and generate reports—all in one place.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem', 
          marginTop: '1.5rem' 
        }}>
          <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
            <strong style={{ color: '#1976d2' }}>✅ Track Production</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              Record daily egg harvests from your farm
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
            <strong style={{ color: '#7b1fa2' }}>📦 Manage Inventory</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              Monitor stock levels in real-time
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
            <strong style={{ color: '#388e3c' }}>💰 Record Sales</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              Process transactions and track revenue
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
            <strong style={{ color: '#f57c00' }}>📊 Generate Reports</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              Analyze your farm's performance
            </p>
          </div>
        </div>

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: '#fff9c4', 
          borderLeft: '4px solid #fbc02d',
          borderRadius: '4px'
        }}>
          <strong>💡 Key Feature:</strong> The system supports 8 egg sizes: 
          <strong> Peewee, Pullets, Small, Medium, Large, Xlarge, Jumbo, and Crack</strong>
        </div>
      </div>

      {/* Section 2: Login & Dashboard */}
      <div id="login" className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #9b59b6' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          🔐 Getting Started: Login & Dashboard
        </h2>
        
        <h3 style={{ color: '#555', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '1rem' }}>
          Step 1: How to Log In
        </h3>
        <ol style={{ lineHeight: '2', fontSize: '1.05rem' }}>
          <li>Open your web browser and go to the system URL</li>
          <li>You'll see the <strong>Login Page</strong> with two fields</li>
          <li>Enter your <strong>Username</strong> (provided by your admin)</li>
          <li>Enter your <strong>Password</strong></li>
          <li>Click the <strong>"Login"</strong> button</li>
          <li>If credentials are correct, you'll be redirected to the Dashboard</li>
        </ol>

        <div style={{ 
          padding: '1rem', 
          background: '#ffebee', 
          borderRadius: '8px', 
          marginTop: '1rem',
          borderLeft: '4px solid #e74c3c'
        }}>
          <strong>⚠️ Important:</strong> Keep your password secure. If you forget it, contact your system administrator.
        </div>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem' }}>
          Step 2: Understanding the Dashboard
        </h3>
        <p style={{ lineHeight: '1.8', color: '#555' }}>
          Once logged in, you'll see the <strong>Dashboard</strong> - your command center! Here's what you'll find:
        </p>

        <div style={{ marginTop: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong>📊 Summary Cards</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              Shows total eggs in stock, today's production, and sales at a glance
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong>🔝 Navigation Menu</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              Use the top menu to access: Dashboard, Production, Inventory, Pricing, Sales, Reports, Users, Profile
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <strong>📈 Quick Stats</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              View current inventory levels for each egg size
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Production Module */}
      <div id="production" className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #27ae60' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          🐔 Recording Daily Production
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '1.5rem' }}>
          This is where you record how many eggs your farm produces each day. Production automatically updates your inventory!
        </p>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginBottom: '1rem' }}>
          Step-by-Step: Adding Daily Production
        </h3>
        <ol style={{ lineHeight: '2', fontSize: '1.05rem' }}>
          <li><strong>Click "Production"</strong> in the top navigation menu</li>
          <li>You'll see the <strong>"Record Daily Production"</strong> form</li>
          <li><strong>Select the Date</strong> - usually today's date</li>
          <li><strong>Enter the harvested eggs</strong> for each size:
            <ul style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <li>Peewee - smallest eggs</li>
              <li>Pullets - from young hens</li>
              <li>Small, Medium, Large - standard sizes</li>
              <li>Xlarge, Jumbo - premium sizes</li>
              <li>Crack - damaged eggs (sold at discount)</li>
            </ul>
          </li>
          <li>Enter the <strong>number of eggs</strong> (not trays) for each size</li>
          <li>The system will automatically calculate:
            <ul style={{ marginTop: '0.5rem' }}>
              <li>Total eggs harvested</li>
              <li>Number of trays (30 eggs = 1 tray)</li>
            </ul>
          </li>
          <li>Click <strong>"Save Production"</strong></li>
          <li>✅ Success! Your inventory is now updated</li>
        </ol>

        <div style={{ 
          padding: '1.5rem', 
          background: '#e8f5e9', 
          borderRadius: '8px', 
          marginTop: '1.5rem',
          borderLeft: '4px solid #27ae60'
        }}>
          <strong>💡 Pro Tip:</strong> Record production daily, preferably in the morning after egg collection. 
          This keeps your inventory accurate and helps track patterns.
        </div>

        <div style={{ 
          padding: '1rem', 
          background: '#fff3cd', 
          borderRadius: '8px', 
          marginTop: '1rem',
          borderLeft: '4px solid #ffc107'
        }}>
          <strong>📝 Note:</strong> You can edit or delete production records if you make a mistake. 
          Just click the "Edit" or "Delete" button next to any record in the history table.
        </div>
      </div>

      {/* Section 4: Inventory Module */}
      <div id="inventory" className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #e67e22' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          📦 Managing Inventory
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '1.5rem' }}>
          The Inventory page shows your current stock levels. The system updates this automatically when you 
          record production or make sales—<strong>no manual entry needed!</strong>
        </p>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginBottom: '1rem' }}>
          How to Check Current Stock
        </h3>
        <ol style={{ lineHeight: '2', fontSize: '1.05rem' }}>
          <li><strong>Click "Inventory"</strong> in the navigation menu</li>
          <li>You'll see a <strong>"Current Inventory Summary"</strong> card showing:
            <ul style={{ marginTop: '0.5rem' }}>
              <li>Number of eggs for each size</li>
              <li>Number of trays (calculated automatically)</li>
              <li>Total eggs and trays across all sizes</li>
            </ul>
          </li>
          <li>Scroll down to see <strong>"Inventory History"</strong> - a daily record of your stock</li>
        </ol>

        <div style={{ 
          padding: '1.5rem', 
          background: '#e3f2fd', 
          borderRadius: '8px', 
          marginTop: '1.5rem'
        }}>
          <strong>🔍 Understanding the Display:</strong>
          <div style={{ marginTop: '1rem' }}>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Example:</strong> "Medium: 394 eggs (13 trays)"
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', color: '#555' }}>
              This means you have 394 medium eggs in stock, which equals 13 full trays (13 × 30 = 390 eggs) 
              plus 4 loose pieces.
            </p>
          </div>
        </div>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem' }}>
          How Inventory is Updated
        </h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div style={{ padding: '1rem', background: '#d4edda', borderRadius: '8px', borderLeft: '4px solid #28a745' }}>
            <strong>➕ Increases When:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
              <li>You record daily production</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', background: '#f8d7da', borderRadius: '8px', borderLeft: '4px solid #dc3545' }}>
            <strong>➖ Decreases When:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
              <li>You record a sale</li>
              <li>Inventory is automatically deducted</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          padding: '1rem', 
          background: '#fff3cd', 
          borderRadius: '8px', 
          marginTop: '1.5rem',
          borderLeft: '4px solid #ffc107'
        }}>
          <strong>⚠️ Important:</strong> You don't manually add inventory. The system calculates it automatically 
          based on production and sales. This prevents errors and keeps data accurate.
        </div>
      </div>

      {/* Section 5: Sales Module */}
      <div id="sales" className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #e74c3c' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          💰 Recording Sales
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '1.5rem' }}>
          When you sell eggs, record it here. The system will automatically reduce your inventory 
          and calculate the total price based on current pricing.
        </p>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginBottom: '1rem' }}>
          Step-by-Step: Creating a Sale
        </h3>
        <ol style={{ lineHeight: '2', fontSize: '1.05rem' }}>
          <li><strong>Click "Sales"</strong> in the navigation menu</li>
          <li><strong>Select the Date</strong> of the sale</li>
          <li>Check the <strong>"Available Stock"</strong> display (green box) to see what you have</li>
          <li><strong>Add Sale Items:</strong>
            <ul style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <li>Select <strong>Egg Size</strong> from dropdown (Peewee, Pullets, Small, etc.)</li>
              <li>Enter number of <strong>Trays</strong> (1 tray = 30 eggs)</li>
              <li>Enter number of <strong>Pieces</strong> (loose eggs)</li>
              <li>The price is calculated automatically</li>
            </ul>
          </li>
          <li>Click <strong>"Add Item"</strong> to add more sizes to the same sale</li>
          <li>Add <strong>Notes</strong> (optional) - customer name, payment method, etc.</li>
          <li>Review the <strong>Total Amount</strong></li>
          <li>Click <strong>"Record Sale"</strong></li>
          <li>✅ Done! Inventory is automatically reduced</li>
        </ol>

        <div style={{ 
          padding: '1.5rem', 
          background: '#ffe6e6', 
          borderRadius: '8px', 
          marginTop: '1.5rem',
          borderLeft: '4px solid #e74c3c'
        }}>
          <strong>🚫 Stock Validation:</strong> The system won't let you sell more eggs than you have in stock. 
          If you try to sell 100 eggs but only have 50, you'll get an error message.
        </div>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem' }}>
          Understanding Trays vs Pieces
        </h3>
        <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>1 Tray = 30 eggs</strong> (standard measure)
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', color: '#555' }}>
            <strong>Example:</strong> If a customer buys 2 trays + 5 pieces of Large eggs:
          </p>
          <ul style={{ fontSize: '0.95rem', color: '#555', marginTop: '0.5rem' }}>
            <li>2 trays = 60 eggs</li>
            <li>5 pieces = 5 eggs</li>
            <li><strong>Total = 65 eggs</strong></li>
          </ul>
        </div>

        <div style={{ 
          padding: '1rem', 
          background: '#e8f5e9', 
          borderRadius: '8px', 
          marginTop: '1rem',
          borderLeft: '4px solid #27ae60'
        }}>
          <strong>💡 Pro Tip:</strong> You can delete a sale if recorded by mistake. 
          The system will restore the inventory automatically!
        </div>
      </div>

      {/* Section 6: Pricing Module */}
      <div id="pricing" className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #f39c12' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          💵 Managing Egg Prices
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '1.5rem' }}>
          Set prices for each egg size. Prices can be different for trays (30 eggs) and individual pieces.
        </p>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginBottom: '1rem' }}>
          How to Update Prices
        </h3>
        <ol style={{ lineHeight: '2', fontSize: '1.05rem' }}>
          <li><strong>Click "Pricing"</strong> in the navigation menu</li>
          <li>You'll see a table with all egg sizes and current prices</li>
          <li>Click the <strong>"Edit"</strong> button next to the size you want to update</li>
          <li>Enter the new <strong>Price per Tray</strong> (in Pesos ₱)</li>
          <li>Enter the new <strong>Price per Piece</strong></li>
          <li>Click <strong>"Save"</strong></li>
          <li>✅ Price updated! New sales will use this price</li>
        </ol>

        <div style={{ 
          padding: '1.5rem', 
          background: '#fff3cd', 
          borderRadius: '8px', 
          marginTop: '1.5rem',
          borderLeft: '4px solid #ffc107'
        }}>
          <strong>📌 Important Note:</strong> Changing prices here only affects <strong>future sales</strong>. 
          Past sales records keep their original prices—they won't change.
        </div>

        <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginTop: '1rem' }}>
          <strong>💰 Default Pricing Guide:</strong>
          <ul style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
            <li>Peewee: ₱150/tray, ₱7/piece</li>
            <li>Pullets: ₱120/tray, ₱5/piece</li>
            <li>Small: ₱140/tray, ₱5/piece</li>
            <li>Medium: ₱160/tray, ₱6/piece</li>
            <li>Large: ₱180/tray, ₱7/piece</li>
            <li>Xlarge: ₱200/tray, ₱8/piece</li>
            <li>Jumbo: ₱220/tray, ₱9/piece</li>
            <li>Crack: ₱80/tray, ₱3/piece (discounted)</li>
          </ul>
        </div>
      </div>

      {/* Section 7: Reports */}
      <div id="reports" className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #9b59b6' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          📊 Viewing Reports & History
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '1.5rem' }}>
          Reports help you analyze your farm's performance, track trends, and make better business decisions.
        </p>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginBottom: '1rem' }}>
          Available Reports
        </h3>

        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
            <strong>📈 Production Report</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              Shows daily egg production by size, total eggs harvested, and trends over time.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
            <strong>💰 Sales Report</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              View sales transactions, revenue by egg size, total income, and customer activity.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
            <strong>📦 Inventory Report</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              Track stock levels over time, identify fast-moving sizes, and spot trends.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
            <strong>🎯 Dashboard Summary</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              Get a quick overview of key metrics: total stock, today's production, recent sales.
            </p>
          </div>
        </div>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginBottom: '1rem' }}>
          How to Generate Reports
        </h3>
        <ol style={{ lineHeight: '2', fontSize: '1.05rem' }}>
          <li><strong>Click "Reports"</strong> in the navigation menu</li>
          <li>Choose the report type you want to view</li>
          <li>Select the <strong>date or date range</strong></li>
          <li>Click <strong>"Generate Report"</strong></li>
          <li>Review the data displayed in tables and charts</li>
          <li>Use this information for planning and decision-making</li>
        </ol>

        <div style={{ 
          padding: '1.5rem', 
          background: '#e8f5e9', 
          borderRadius: '8px', 
          marginTop: '1.5rem',
          borderLeft: '4px solid #27ae60'
        }}>
          <strong>💡 Best Practice:</strong> Review reports weekly to identify:
          <ul style={{ marginTop: '0.5rem' }}>
            <li>Which egg sizes sell fastest</li>
            <li>Days with highest production</li>
            <li>Low stock situations before they become critical</li>
            <li>Revenue trends and patterns</li>
          </ul>
        </div>
      </div>

      {/* Section 8: User Management */}
      <div id="users" className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #34495e' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          👥 User Management (Admin Only)
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '1.5rem' }}>
          If you're an administrator, you can add new users, manage permissions, and control who has access to the system.
        </p>

        <div style={{ 
          padding: '1rem', 
          background: '#fff3cd', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          borderLeft: '4px solid #ffc107'
        }}>
          <strong>🔒 Note:</strong> This section is only accessible to users with Admin privileges.
        </div>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginBottom: '1rem' }}>
          How to Add a New User
        </h3>
        <ol style={{ lineHeight: '2', fontSize: '1.05rem' }}>
          <li><strong>Click "Users"</strong> in the navigation menu</li>
          <li>Click the <strong>"Add New User"</strong> button</li>
          <li>Fill in the required information:
            <ul style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <li>Full Name</li>
              <li>Username (for login)</li>
              <li>Email Address</li>
              <li>Password (user should change it after first login)</li>
              <li>Role (Admin, Manager, or Staff)</li>
            </ul>
          </li>
          <li>Click <strong>"Create User"</strong></li>
          <li>✅ New user can now log in with their credentials</li>
        </ol>

        <h3 style={{ color: '#555', fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem' }}>
          Managing Existing Users
        </h3>
        <ul style={{ lineHeight: '2', fontSize: '1.05rem' }}>
          <li><strong>Edit User:</strong> Update user details, change roles</li>
          <li><strong>Change Password:</strong> Reset user password if they forget</li>
          <li><strong>Deactivate User:</strong> Temporarily disable access without deleting</li>
          <li><strong>Delete User:</strong> Permanently remove user account</li>
        </ul>

        <div style={{ 
          padding: '1.5rem', 
          background: '#ffebee', 
          borderRadius: '8px', 
          marginTop: '1.5rem',
          borderLeft: '4px solid #e74c3c'
        }}>
          <strong>⚠️ Security Best Practices:</strong>
          <ul style={{ marginTop: '0.5rem' }}>
            <li>Use strong passwords (mix of letters, numbers, symbols)</li>
            <li>Never share login credentials</li>
            <li>Deactivate accounts for staff who leave</li>
            <li>Review user access regularly</li>
          </ul>
        </div>
      </div>

      {/* Section 9: Tips & Best Practices */}
      <div id="tips" className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #16a085' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          ✨ Tips & Best Practices
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '1.5rem' }}>
          Follow these guidelines to get the most out of the system and maintain accurate records.
        </p>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #27ae60' }}>
            <h3 style={{ marginTop: 0, color: '#27ae60' }}>🌅 Daily Routine</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Record production immediately after morning egg collection</li>
              <li>Update sales throughout the day as transactions happen</li>
              <li>Check inventory levels at the end of the day</li>
              <li>Review dashboard before closing</li>
            </ul>
          </div>

          <div style={{ padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
            <h3 style={{ marginTop: 0, color: '#2196f3' }}>✅ Data Accuracy</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Double-check egg counts before saving</li>
              <li>Use the correct date—don't backdate entries unless necessary</li>
              <li>Be consistent with egg size classification</li>
              <li>If you make a mistake, edit or delete and re-enter correctly</li>
            </ul>
          </div>

          <div style={{ padding: '1.5rem', background: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
            <h3 style={{ marginTop: 0, color: '#ff9800' }}>📊 Smart Inventory Management</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Monitor which sizes sell fastest and adjust production focus</li>
              <li>Keep an eye on crack eggs—high numbers may indicate handling issues</li>
              <li>Plan sales promotions for slow-moving sizes</li>
              <li>Review inventory reports weekly to spot trends</li>
            </ul>
          </div>

          <div style={{ padding: '1.5rem', background: '#f3e5f5', borderRadius: '8px', borderLeft: '4px solid #9c27b0' }}>
            <h3 style={{ marginTop: 0, color: '#9c27b0' }}>💰 Financial Management</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Update prices regularly based on market conditions</li>
              <li>Generate sales reports monthly for accounting</li>
              <li>Track revenue per egg size to optimize pricing</li>
              <li>Keep notes on large sales for customer relationship management</li>
            </ul>
          </div>

          <div style={{ padding: '1.5rem', background: '#ffebee', borderRadius: '8px', borderLeft: '4px solid #f44336' }}>
            <h3 style={{ marginTop: 0, color: '#f44336' }}>🚨 Preventing Common Mistakes</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li><strong>Don't skip days:</strong> Record production daily, even if it's zero</li>
              <li><strong>Don't round numbers:</strong> Enter exact egg counts</li>
              <li><strong>Don't use the wrong date:</strong> Always verify the date before saving</li>
              <li><strong>Don't delete without thinking:</strong> Deleting a production record affects inventory</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 10: Help & Support */}
      <div className="card" style={{ 
        marginBottom: '3rem', 
        borderLeft: '4px solid #e74c3c',
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%)'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          🆘 Need Help?
        </h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#555', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Common Issues & Quick Fixes
          </h3>
          
          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong>❌ "Cannot record sale - insufficient stock"</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              <strong>Solution:</strong> Check your current inventory. You're trying to sell more eggs than you have in stock. 
              Reduce the quantity or record today's production first.
            </p>
          </div>

          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong>❌ "Inventory numbers look wrong"</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              <strong>Solution:</strong> Check production and sales records for that date. 
              Make sure all entries are correct. If needed, delete incorrect entries and re-enter.
            </p>
          </div>

          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong>❌ "Forgot my password"</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              <strong>Solution:</strong> Contact your system administrator. They can reset your password.
            </p>
          </div>

          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong>❌ "I made a mistake in yesterday's records"</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              <strong>Solution:</strong> Go to the relevant module (Production/Sales), find the record in the history table, 
              and click "Edit" or "Delete" to fix it.
            </p>
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '2px solid #3498db' }}>
          <h3 style={{ color: '#3498db', marginTop: 0 }}>📞 Contact Support</h3>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            If you encounter technical issues or need assistance:
          </p>
          <ul style={{ lineHeight: '1.8', color: '#555' }}>
            <li><strong>System Administrator:</strong> Contact your farm's designated admin</li>
            <li><strong>Technical Support:</strong> Report bugs or system errors to IT support</li>
            <li><strong>Training:</strong> Request additional training if needed</li>
          </ul>
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#e3f2fd', 
            borderRadius: '8px' 
          }}>
            <strong>💡 Before contacting support:</strong>
            <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              <li>Note the exact error message</li>
              <li>Remember what you were trying to do</li>
              <li>Check if the issue happens repeatedly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        background: '#2c3e50',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>🎉 You're Ready to Go!</h3>
        <p style={{ fontSize: '1.05rem', opacity: '0.95', lineHeight: '1.8' }}>
          You now have everything you need to manage your egg farm inventory like a pro. 
          Start with recording today's production, check your inventory, and explore the reports.
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.95rem', opacity: '0.9' }}>
          Remember: The more consistently you use the system, the more valuable the data becomes!
        </p>
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '8px' 
        }}>
          <strong>📚 Bookmark this tutorial page for quick reference anytime!</strong>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
