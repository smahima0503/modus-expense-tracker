// server.js - Main Express Application for Modus Expense Tracker
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 1: CORS (Cross-Origin Resource Sharing)
// Allows frontend (React running on localhost:5173 or port 3000) to make API requests to this backend.
app.use(cors());

// Middleware 2: JSON Body Parser
// Parses incoming request payloads formatted as JSON (e.g. req.body in POST and PUT requests)
app.use(express.json());

// API Routes
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
  console.log(`Modus server is running on http://localhost:${PORT}`);
  await testConnection();
});

module.exports = app;
