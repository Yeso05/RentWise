const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');   // ADD THIS

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const propertiesRoutes = require('./routes/properties');
const tenantsRoutes = require('./routes/tenants');
const paymentsRoutes = require('./routes/payments');
const maintenanceRoutes = require('./routes/maintenance');
const leaseRoutes = require('./routes/leases');
const authRoutes = require('./routes/auth');
const notificationRoutes = require('./routes/notifications');


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/notifications', notificationRoutes);


// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'RentWise API is running smoothly'
  });
});

// DB TEST ROUTE ADD THIS
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    details: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});