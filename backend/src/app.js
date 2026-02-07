// Main Express application setup
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { initVeramo } = require('./config/veramo');

const didRoutes = require('./routes/did.routes');
const credentialRoutes = require('./routes/credential.routes');
const blockchainRoutes = require('./routes/blockchain.routes');

const app = express();

// Middleware - CORS for all frontend origins (Wallet, Issuer, Verifier)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002', 'http://127.0.0.1:3003'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/did', didRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API info for frontend coordination
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'IdentiX API',
    version: '1.0',
    endpoints: {
      did: '/api/did',
      credentials: '/api/credentials',
      blockchain: '/api/blockchain',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

module.exports = app;
