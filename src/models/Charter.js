/**
 * ===================================================
 * Modelo: Charter
 * Responsable Asignado: Jesus
 * Descripción: Manejo de cotizaciones, vuelos y operaciones charters
 * ===================================================
 */

const { pool } = require('../config/db');

class Charter {
  /**
   * Obtener todas las solicitudes u operaciones de vuelos charter
   */
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM charters ORDER BY flight_date DESC, created_at DESC');
      return rows;
    } catch (error) {
      console.error('Error en Charter.getAll:', error);
      throw error;
    }
  }

  /**
   * Obtener una operación charter por ID
   * @param {number|string} id 
   */
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM charters WHERE id = ? LIMIT 1', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error en Charter.getById:', error);
      throw error;
    }
  }

  /**
   * Crear nueva solicitud de vuelo charter
   * @param {Object} data 
   */
  static async create(data) {
    try {
      const {
        client_name,
        client_email,
        client_phone,
        origin,
        destination,
        flight_date,
        passengers,
        aircraft_type,
        notes
      } = data;

      const [result] = await pool.query(
        `INSERT INTO charters 
         (client_name, client_email, client_phone, origin, destination, flight_date, passengers, aircraft_type, notes, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [client_name, client_email, client_phone, origin, destination, flight_date, passengers, aircraft_type, notes, 'pending']
      );

      return { id: result.insertId, ...data, status: 'pending' };
    } catch (error) {
      console.error('Error en Charter.create:', error);
      throw error;
    }
  }

  /**
   * Actualizar estado o detalles de una operación charter
   * @param {number|string} id 
   * @param {string} status ('pending', 'confirmed', 'in_flight', 'completed', 'cancelled')
   */
  static async updateStatus(id, status) {
    try {
      await pool.query('UPDATE charters SET status = ? WHERE id = ?', [status, id]);
      return { id, status };
    } catch (error) {
      console.error('Error en Charter.updateStatus:', error);
      throw error;
    }
  }
}

module.exports = Charter;
