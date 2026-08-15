// routes/expenseRoutes.js - Express Router for Expense CRUD & Summary Analytics
// Protected by requireAuth middleware to enforce strict user data isolation.

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// Apply requireAuth middleware to ALL expense endpoints
router.use(requireAuth);

// -------------------------------------------------------------
// 1. GET /api/expenses - Retrieve expenses for logged-in user
// Supports optional category filter: ?category=Food%20%26%20Dining
// -------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const userId = req.userId;

    let query = 'SELECT id, user_id, title, amount, category, date, created_at FROM expenses WHERE user_id = ?';
    const queryParams = [userId];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      queryParams.push(category);
    }

    query += ' ORDER BY date DESC, id DESC';

    const [rows] = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    res.status(500).json({ error: 'Failed to retrieve expenses.' });
  }
});

// -------------------------------------------------------------
// 2. GET /api/expenses/summary - Spending summary & category breakdown for logged-in user
// Uses SQL Aggregation SUM(), COUNT(), and GROUP BY
// -------------------------------------------------------------
router.get('/summary', async (req, res) => {
  try {
    const userId = req.userId;

    // Query 1: Total spending amount & total transaction count for logged-in user
    const [overallResult] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS totalAmount, COUNT(id) AS totalCount FROM expenses WHERE user_id = ?',
      [userId]
    );

    // Query 2: Category-wise spending breakdown for logged-in user
    const [categoryResult] = await pool.query(
      `SELECT category, SUM(amount) AS total, COUNT(id) AS count 
       FROM expenses 
       WHERE user_id = ? 
       GROUP BY category 
       ORDER BY total DESC`,
      [userId]
    );

    const totalAmount = parseFloat(overallResult[0].totalAmount) || 0;
    const totalCount = parseInt(overallResult[0].totalCount, 10) || 0;
    const topCategory = categoryResult.length > 0 ? categoryResult[0].category : 'None';

    res.json({
      totalAmount,
      totalCount,
      topCategory,
      categoryBreakdown: categoryResult.map(row => ({
        category: row.category,
        total: parseFloat(row.total),
        count: parseInt(row.count, 10)
      }))
    });
  } catch (error) {
    console.error('Error fetching summary:', error.message);
    res.status(500).json({ error: 'Failed to calculate summary.' });
  }
});

// -------------------------------------------------------------
// 3. POST /api/expenses - Add a new expense for logged-in user
// Body: { title, amount, category, date }
// -------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: 'Please provide title, amount, category, and date.' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a valid positive number.' });
    }

    // Parameterized INSERT query including user_id
    const [result] = await pool.query(
      'INSERT INTO expenses (user_id, title, amount, category, date) VALUES (?, ?, ?, ?, ?)',
      [userId, title.trim(), numericAmount, category.trim(), date]
    );

    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      title: title.trim(),
      amount: numericAmount,
      category: category.trim(),
      date
    });
  } catch (error) {
    console.error('Error adding expense:', error.message);
    res.status(500).json({ error: 'Failed to create expense.' });
  }
});

// -------------------------------------------------------------
// 4. PUT /api/expenses/:id - Update an expense (enforcing user ownership)
// Body: { title, amount, category, date }
// -------------------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: 'Please provide title, amount, category, and date.' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a valid positive number.' });
    }

    // UPDATE scoped by both expense id AND user_id
    const [result] = await pool.query(
      'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ? AND user_id = ?',
      [title.trim(), numericAmount, category.trim(), date, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found or access denied.' });
    }

    res.json({
      id: parseInt(id, 10),
      user_id: userId,
      title: title.trim(),
      amount: numericAmount,
      category: category.trim(),
      date
    });
  } catch (error) {
    console.error('Error updating expense:', error.message);
    res.status(500).json({ error: 'Failed to update expense.' });
  }
});

// -------------------------------------------------------------
// 5. DELETE /api/expenses/:id - Delete an expense (enforcing user ownership)
// -------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // DELETE scoped by both expense id AND user_id
    const [result] = await pool.query(
      'DELETE FROM expenses WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found or access denied.' });
    }

    res.json({ message: 'Expense deleted successfully.', id: parseInt(id, 10) });
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
});

module.exports = router;
