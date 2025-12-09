//server/config/db.js

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
const testConnection = async () => {
    try {
        const conn = await pool.getConnection();
        console.log('Kết nối MySQL thành công!');
        conn.release();
    } catch (err) {
        console.error('Lỗi kết nối MySQL:', err.message);
    }
};

testConnection();

export default pool;