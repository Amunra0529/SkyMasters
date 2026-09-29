/**
 * ===================================================
 * Modelo: Aircraft
 * Responsable Asignado: Morao
 * Descripción: Manejo de inventario de aeronaves y piezas aeronáuticas
 * ===================================================
 */

const { pool } = require('../config/db');

class Aircraft {
  /**
   * Obtener todas las aeronaves disponibles para venta o catálogo
   */
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM aircrafts ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Error en Aircraft.getAll:', error);
      throw error;
    }
  }

  /**
   * Obtener aeronave o pieza por ID
   * @param {number|string} id 
   */
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM aircrafts WHERE id = ? LIMIT 1', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error en Aircraft.getById:', error);
      throw error;
    }
  }

  /**
   * Crear nueva aeronave o pieza en el inventario
   * @param {Object} data 
   */
  static async create(data) {
    try {
      const { model, category, manufacturer, year, price, hours, status, image_url, description } = data;
      const [result] = await pool.query(
        `INSERT INTO aircrafts (model, category, manufacturer, year, price, hours, status, image_url, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [model, category, manufacturer, year, price, hours, status || 'available', image_url, description]
      );
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('Error en Aircraft.create:', error);
      throw error;
    }
  }

  /**
   * Actualizar una aeronave o pieza
   * @param {number|string} id 
   * @param {Object} data 
   */
  static async update(id, data) {
    try {
      const { model, category, manufacturer, year, price, hours, status, image_url, description } = data;
      await pool.query(
        `UPDATE aircrafts 
         SET model = ?, category = ?, manufacturer = ?, year = ?, price = ?, hours = ?, status = ?, image_url = ?, description = ? 
         WHERE id = ?`,
        [model, category, manufacturer, year, price, hours, status, image_url, description, id]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error en Aircraft.update:', error);
      throw error;
    }
  }

  /**
   * Eliminar una aeronave del inventario
   * @param {number|string} id 
   */
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM aircrafts WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en Aircraft.delete:', error);
      throw error;
    }
  }
}

module.exports = Aircraft;
