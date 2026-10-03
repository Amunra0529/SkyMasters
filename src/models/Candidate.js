/**
 * ===================================================
 * Modelo: Candidate
 * Responsable Asignado: Osuna
 * Descripción: Manejo de bolsa de trabajo, vacantes y postulantes
 * ===================================================
 */

const { pool } = require('../config/db');

class Candidate {
  /**
   * Obtener todos los candidatos postulados
   */
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM candidates ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Error en Candidate.getAll:', error);
      throw error;
    }
  }

  /**
   * Obtener un candidato por ID
   * @param {number|string} id 
   */
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM candidates WHERE id = ? LIMIT 1', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error en Candidate.getById:', error);
      throw error;
    }
  }

  /**
   * Registrar una nueva postulación
   * @param {Object} data 
   */
  static async create(data) {
    try {
      const {
        full_name,
        email,
        phone,
        position,
        experience_years,
        flight_hours,
        resume_url,
        cover_letter
      } = data;

      const [result] = await pool.query(
        `INSERT INTO candidates 
         (full_name, email, phone, position, experience_years, flight_hours, resume_url, cover_letter, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [full_name, email, phone, position, experience_years || 0, flight_hours || 0, resume_url, cover_letter, 'in_review']
      );

      return { id: result.insertId, ...data, status: 'in_review' };
    } catch (error) {
      console.error('Error en Candidate.create:', error);
      throw error;
    }
  }

  /**
   * Actualizar el estado de la postulación
   * @param {number|string} id 
   * @param {string} status ('in_review', 'interview', 'accepted', 'rejected')
   */
  static async updateStatus(id, status) {
    try {
      await pool.query('UPDATE candidates SET status = ? WHERE id = ?', [status, id]);
      return { id, status };
    } catch (error) {
      console.error('Error en Candidate.updateStatus:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { full_name, email, phone, position, experience_years, flight_hours } = data;
      await pool.query(
        `UPDATE candidates 
         SET full_name = ?, email = ?, phone = ?, position = ?, experience_years = ?, flight_hours = ? 
         WHERE id = ?`,
        [full_name, email, phone, position, experience_years || 0, flight_hours || 0, id]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error en Candidate.update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await pool.query('DELETE FROM candidates WHERE id = ?', [id]);
      return { id };
    } catch (error) {
      console.error('Error en Candidate.delete:', error);
      throw error;
    }
  }
}

module.exports = Candidate;
