-- Modus Expense Tracker Database Schema
-- Database Name: modus_db

CREATE DATABASE IF NOT EXISTS modus_db;
USE modus_db;

-- Expenses table without notes field
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Starter sample data to test SQL queries and dashboard
INSERT INTO expenses (title, amount, category, date) VALUES
('Organic Groceries', 64.50, 'Food & Dining', '2026-08-01'),
('Monthly Metro Pass', 45.00, 'Transport', '2026-08-03'),
('Soft Linen Cushion Cover', 28.00, 'Shopping', '2026-08-05'),
('Electricity & Water Bill', 82.30, 'Utilities', '2026-08-08'),
('Indie Cinema Ticket', 14.50, 'Entertainment', '2026-08-10'),
('Matcha Latte & Pastry', 12.00, 'Food & Dining', '2026-08-12'),
('Skincare Refill', 34.00, 'Personal Care', '2026-08-14');
