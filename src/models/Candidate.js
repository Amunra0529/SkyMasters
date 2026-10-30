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
      let {
        first_name,
        last_name,
        full_name,
        email,
        phone,
        position,
        country,
        city,
        has_license,
        languages,
        has_passport,
        resume_url
      } = data;

      if (!full_name) {
        full_name = [first_name, last_name].filter(Boolean).join(' ').trim();
      }
      if (!first_name && full_name) {
        const parts = full_name.trim().split(' ');
        first_name = parts[0] || '';
        last_name = parts.slice(1).join(' ') || '';
      }

      const [result] = await pool.query(
        `INSERT INTO candidates 
         (first_name, last_name, full_name, email, phone, position, country, city, has_license, languages, has_passport, resume_url, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name || null,
          last_name || null,
          full_name || 'Candidato',
          email,
          phone || null,
          position,
          country || null,
          city || null,
          has_license || 'No',
          languages || null,
          has_passport || 'No',
          resume_url || null,
          'in_review'
        ]
      );

      return { id: result.insertId, ...data, full_name, status: 'in_review' };
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
      let {
        first_name,
        last_name,
        full_name,
        email,
        phone,
        position,
        country,
        city,
        has_license,
        languages,
        has_passport
      } = data;

      if (!full_name && (first_name || last_name)) {
        full_name = [first_name, last_name].filter(Boolean).join(' ').trim();
      }

      await pool.query(
        `UPDATE candidates 
         SET first_name = COALESCE(?, first_name),
             last_name = COALESCE(?, last_name),
             full_name = COALESCE(?, full_name),
             email = COALESCE(?, email),
             phone = COALESCE(?, phone),
             position = COALESCE(?, position),
             country = COALESCE(?, country),
             city = COALESCE(?, city),
             has_license = COALESCE(?, has_license),
             languages = COALESCE(?, languages),
             has_passport = COALESCE(?, has_passport)
         WHERE id = ?`,
        [
          first_name || null,
          last_name || null,
          full_name || null,
          email || null,
          phone || null,
          position || null,
          country || null,
          city || null,
          has_license || null,
          languages || null,
          has_passport || null,
          id
        ]
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

  /**
   * Verificar si ya existe una postulación reciente (menos de 24h)
   * usando el mismo email o teléfono para evitar envios duplicados.
   * @param {string} email
   * @param {string} phone
   * @returns {Object|null} Candidato existente o null
   */
  static async checkRecentSubmission(email, phone) {
    try {
      const [rows] = await pool.query(
        `SELECT id, email, phone, created_at FROM candidates
         WHERE (email = ? OR phone = ?)
           AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
         ORDER BY created_at DESC
         LIMIT 1`,
        [email || null, phone || null]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error en Candidate.checkRecentSubmission:', error);
      throw error;
    }
  }
}

module.exports = Candidate;
