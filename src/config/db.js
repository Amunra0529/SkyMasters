/**
 * ===================================================
 * Configuración de Conexión a Base de Datos (MySQL)
 * Proyecto: SkyMaster Aviation System
 * ===================================================
 * Compatible con cPanel / Hostinger MySQL Database
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skymaster_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función de verificación de conexión inicial
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ [Database] Conexión exitosa a la base de datos MySQL.');
    connection.release();
  } catch (error) {
    console.warn('⚠️ [Database] Advertencia: No se pudo conectar a la base de datos MySQL:', error.message);
    console.warn('ℹ️ [Database] Verifica tus credenciales en el archivo .env');
  }
}

module.exports = {
  pool,
  testConnection
};
