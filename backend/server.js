// server.js - Main Express Application for Modus Expense Tracker
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Enable trust proxy for Render / hosted reverse proxies (Required for secure HTTPS cookies)
app.set('trust proxy', 1);

// Allowed origins for CORS (Development & Production Vercel domain)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

// Middleware 2: JSON Body Parser
app.use(express.json());

// Middleware 3: Express Session (Cookie settings adjusted for production HTTPS cross-origin)
app.use(session({
  secret: process.env.SESSION_SECRET || 'modus_secret_key_2026',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: isProduction, // Requires HTTPS in production
    sameSite: isProduction ? 'none' : 'lax', // Cross-site cookies between Vercel and Render in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // Session valid for 24 hours
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Modus Backend API is running cleanly.' });
});

// 404 Route handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Requested API endpoint not found.' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error.' });
});

// Start Server and test database pool connection
app.listen(PORT, async () => {
  console.log(`Modus server is running on port ${PORT}`);
  await testConnection();
});

module.exports = app;
