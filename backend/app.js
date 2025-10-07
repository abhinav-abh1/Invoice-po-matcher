const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const invoiceRoutes = require('./routes/invoices');
const poRoutes = require('./routes/pos');
const matchRoutes = require('./routes/match');

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory globals (use Redis/DB in prod for persistence/scalability)
app.locals.invoices = [];
app.locals.pos = [];

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/pos', poRoutes);
app.use('/api/match', matchRoutes);

// 404 Handler (after routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler (after 404)
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown (after server is defined)
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});