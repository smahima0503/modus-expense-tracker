// config/db.js - MySQL Connection Pool Configuration
// Uses mysql2/promise for clean async/await database operations.

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a pool of MySQL connections using environment variables
// host: process.env.DB_HOST (default: localhost)
// user: process.env.DB_USER (default: root)
// password: process.env.DB_PASSWORD (default: empty)
// database: process.env.DB_NAME (default: modus_db)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'modus_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to test active connection to MySQL server
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`Connected successfully to MySQL database "${process.env.DB_NAME || 'modus_db'}".`);
    connection.release(); // Return connection to pool
    return true;
  } catch (error) {
    console.error(`MySQL Connection Error: Unable to connect to MySQL server at ${process.env.DB_HOST || 'localhost'}.`);
    console.error(`Details: ${error.message}`);
    console.error('Please ensure local MySQL service (e.g. MySQL Server / XAMPP) is started and credentials in .env are correct.');
    return false;
  }
}

module.exports = { pool, testConnection };
