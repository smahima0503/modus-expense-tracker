// routes/expenseRoutes.js - Express Router for Expense CRUD and SQL Summary Analytics
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// -------------------------------------------------------------
// 1. GET /api/expenses - Retrieve all expenses (with optional category filter)
// Query params: ?category=Food%20%26%20Dining
// -------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = 'SELECT * FROM expenses';
    const queryParams = [];

    // Parameterized filter to prevent SQL injection
    if (category && category !== 'All') {
      query += ' WHERE category = ?';
      queryParams.push(category);
    }

    query += ' ORDER BY date DESC, id DESC';

    const [rows] = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    res.status(500).json({ error: 'Failed to retrieve expenses from database.' });
  }
});

// -------------------------------------------------------------
// 2. GET /api/expenses/summary - Get spending totals & category breakdown using SQL Aggregation
// Uses SUM(), COUNT(), and GROUP BY
// -------------------------------------------------------------
router.get('/summary', async (req, res) => {
  try {
    // Query 1: Total spending amount and total transaction count
    const [overallResult] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS totalAmount, COUNT(id) AS totalCount FROM expenses'
    );

    // Query 2: Category breakdown using GROUP BY, SUM(), and COUNT()
    const [categoryResult] = await pool.query(
      `SELECT category, SUM(amount) AS total, COUNT(id) AS count 
       FROM expenses 
       GROUP BY category 
       ORDER BY total DESC`
    );

    const totalAmount = parseFloat(overallResult[0].totalAmount) || 0;
    const totalCount = parseInt(overallResult[0].totalCount, 10) || 0;
    
    // Determine top category (first item in breakdown because ORDER BY total DESC)
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
    res.status(500).json({ error: 'Failed to calculate summary statistics.' });
  }
});

// -------------------------------------------------------------
// 3. POST /api/expenses - Add a new expense
// Body: { title, amount, category, date }
// -------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Basic input validation
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: 'Please provide title, amount, category, and date.' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a valid positive number.' });
    }

    // Parameterized INSERT query
    const [result] = await pool.query(
      'INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)',
      [title.trim(), numericAmount, category.trim(), date]
    );

    // Return the newly created expense object with status 201 Created
    res.status(201).json({
      id: result.insertId,
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
// 4. PUT /api/expenses/:id - Update an existing expense
// Body: { title, amount, category, date }
// -------------------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: 'Please provide title, amount, category, and date.' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a valid positive number.' });
    }

    // Parameterized UPDATE query
    const [result] = await pool.query(
      'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?',
      [title.trim(), numericAmount, category.trim(), date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    res.json({
      id: parseInt(id, 10),
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
// 5. DELETE /api/expenses/:id - Delete an expense
// -------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Parameterized DELETE query
    const [result] = await pool.query('DELETE FROM expenses WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    res.json({ message: 'Expense deleted successfully.', id: parseInt(id, 10) });
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
});

module.exports = router;
