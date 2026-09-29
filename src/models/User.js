/**
 * ===================================================
 * Modelo: User
 * Responsable Asignado: Jhon
 * Descripción: Manejo de usuarios, administradores y autenticación
 * ===================================================
 */

const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Buscar usuario por correo electrónico
   * @param {string} email 
   */
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error en User.findByEmail:', error);
      throw error;
    }
  }

  /**
   * Buscar usuario por ID
   * @param {number|string} id 
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error en User.findById:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo usuario / administrador
   * @param {Object} userData { name, email, password, role }
   */
  static async create({ name, email, password, role = 'admin' }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      return { id: result.insertId, name, email, role };
    } catch (error) {
      console.error('Error en User.create:', error);
      throw error;
    }
  }

  /**
   * Listar todos los administradores (para módulo de configuración de Jhon)
   */
  static async getAllAdmins() {
    try {
      const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Error en User.getAllAdmins:', error);
      throw error;
    }
  }
}

module.exports = User;
