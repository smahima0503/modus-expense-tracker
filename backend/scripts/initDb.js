// scripts/initDb.js - Database Initializer & Seeder Script
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function initDb() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'modus_db';

  console.log(`Connecting to MySQL server at ${host} as ${user}...`);

  try {
    // 1. Connect without selecting a database
    const connection = await mysql.createConnection({ host, user, password });
    
    // 2. Create Database if it does not exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database "${dbName}" created or verified.`);
    
    // 3. Switch to modus_db
    await connection.query(`USE \`${dbName}\`;`);

    // 4. Create expenses table (without notes field)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createTableQuery);
    console.log('Table "expenses" created or verified.');

    // 5. Check if sample data exists
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM expenses');
    if (rows[0].count === 0) {
      console.log('Inserting initial sample expenses...');
      const sampleData = [
        ['Organic Groceries', 64.50, 'Food & Dining', '2026-08-01'],
        ['Monthly Metro Pass', 45.00, 'Transport', '2026-08-03'],
        ['Soft Linen Cushion Cover', 28.00, 'Shopping', '2026-08-05'],
        ['Electricity & Water Bill', 82.30, 'Utilities', '2026-08-08'],
        ['Indie Cinema Ticket', 14.50, 'Entertainment', '2026-08-10'],
        ['Matcha Latte & Pastry', 12.00, 'Food & Dining', '2026-08-12'],
        ['Skincare Refill', 34.00, 'Personal Care', '2026-08-14']
      ];

      for (const item of sampleData) {
        await connection.query(
          'INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)',
          item
        );
      }
      console.log(`Inserted ${sampleData.length} sample expenses.`);
    } else {
      console.log(`Database already contains ${rows[0].count} expenses.`);
    }

    await connection.end();
    console.log('Database initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('Error during database initialization:', error.message);
    return false;
  }
}

if (require.main === module) {
  initDb();
}

module.exports = initDb;
