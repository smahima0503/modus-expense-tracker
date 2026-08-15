// config/db.js - MySQL Connection Pool Configuration (Local & Railway Production Support)
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Supports standard environment variables and Railway MySQL variables (MYSQLHOST, MYSQLUSER, etc.)
const host = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306', 10);
const user = process.env.MYSQLUSER || process.env.DB_USER || 'root';
const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '';
const database = process.env.MYSQLDATABASE || process.env.DB_NAME || 'modus_db';
const useSSL = process.env.DB_SSL === 'true' || (process.env.MYSQLHOST && process.env.MYSQLHOST !== 'localhost');

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined
});

// Helper function to test active connection to MySQL server
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`Connected successfully to MySQL database "${database}" at ${host}:${port}.`);
    connection.release();
    return true;
  } catch (error) {
    console.error(`MySQL Connection Error: Unable to connect to MySQL server at ${host}:${port}.`);
    console.error(`Details: ${error.message}`);
    return false;
  }
}

module.exports = { pool, testConnection };
