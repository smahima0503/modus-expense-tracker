// scripts/initDb.js - Database Initializer & Migration Script
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
    const connection = await mysql.createConnection({ host, user, password });
    
    // 1. Create Database if it does not exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database "${dbName}" created or verified.`);
    
    // 2. Switch to modus_db
    await connection.query(`USE \`${dbName}\`;`);

    // 3. Create users table
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createUsersTableQuery);
    console.log('Table "users" created or verified.');

    // 4. Ensure expenses table has user_id column
    // Check if expenses table exists and if user_id column exists
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'expenses' AND COLUMN_NAME = 'user_id'
    `, [dbName]);

    if (columns.length === 0) {
      // If table exists without user_id, drop legacy table so schema updates cleanly
      console.log('Migrating expenses table to support user_id foreign key...');
      await connection.query('DROP TABLE IF EXISTS expenses;');
    }

    // Create expenses table with user_id foreign key
    const createExpensesTableQuery = `
      CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    await connection.query(createExpensesTableQuery);
    console.log('Table "expenses" created or verified with user_id foreign key.');

    await connection.end();
    console.log('Database schema initialization completed successfully! Zero seed data created.');
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
