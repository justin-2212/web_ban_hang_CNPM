//server/config/db.js

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ✅ THÊM: Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'apple_store',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // ✅ THÊM: Timeout settings
  connectTimeout: 10000, // 10 seconds
};

const pool = mysql.createPool(poolConfig);

// ✅ THÊM: Test connection với retry
const testConnection = async (retries = MAX_RETRIES) => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error(`❌ Database connection failed (attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES}):`, error.message);
    
    if (retries > 0) {
      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return testConnection(retries - 1);
    }
    
    console.error('❌ Failed to connect to database after multiple attempts');
    console.error('Please check:');
    console.error('  1. MySQL server is running');
    console.error('  2. Database credentials in .env are correct');
    console.error('  3. Database \'apple_store\' exists');
    throw error;
  }
};

// Test khi khởi động
testConnection().catch(err => {
  console.error('Fatal database error:', err);
  process.exit(1);
});

export default pool;