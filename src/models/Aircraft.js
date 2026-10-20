/**
 * ===================================================
 * Modelo: Aircraft
 * Responsable Asignado: Morao
 * Descripción: Manejo de inventario de aeronaves y piezas aeronáuticas
 * Base de Datos: skymaster_db
 * ===================================================
 */

const { pool } = require('../config/db');

class Aircraft {
  /**
   * Buscar vendedor por correo o insertar uno nuevo
   */
  static async findOrInsertVendedor(connection, vendedorData) {
    const { nombre, apellido, telefono, correo } = vendedorData;
    if (correo && correo.trim() !== '') {
      const [existing] = await connection.query(
        'SELECT id FROM vendedores WHERE correo = ? LIMIT 1',
        [correo.trim()]
      );
      if (existing.length > 0) {
        return existing[0].id;
      }
    }
    const [result] = await connection.query(
      'INSERT INTO vendedores (nombre, apellido, telefono, correo) VALUES (?, ?, ?, ?)',
      [nombre || 'Cliente', apellido || '', telefono || '', correo || '']
    );
    return result.insertId;
  }

  /**
   * Transacción SQL para registrar una Aeronave con sus documentos e imágenes
   */
  static async createAeronaveTransaction(data, files = {}) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const vendedorId = await this.findOrInsertVendedor(connection, {
        nombre: data.vendedor_nombre,
        apellido: data.vendedor_apellido,
        telefono: data.vendedor_telefono,
        correo: data.vendedor_correo
      });

      const randomNum = Math.floor(100 + Math.random() * 900);
      const codigoPublico = data.codigo_publico || `SKY-AER-${randomNum}`;

      let logBooksUrl = data.log_books_url || null;
      if (files.log_books_file && files.log_books_file[0]) {
        logBooksUrl = `/uploads/${files.log_books_file[0].filename}`;
      }

      let damageHistoryUrl = data.damage_history_url || null;
      if (files.damage_history_file && files.damage_history_file[0]) {
        damageHistoryUrl = `/uploads/${files.damage_history_file[0].filename}`;
      }

      const tieneLogBooks = (data.tiene_log_books === '1' || data.tiene_log_books === 1 || data.tiene_log_books === 'true') ? 1 : 0;
      const tieneDamageHistory = (data.tiene_damage_history === '1' || data.tiene_damage_history === 1 || data.tiene_damage_history === 'true') ? 1 : 0;

      const precioInterno = parseFloat(data.precio_interno) || 0.00;
      const precioPublico = (data.precio_publico && parseFloat(data.precio_publico) > 0) ? parseFloat(data.precio_publico) : null;
      const estado = data.estado || 'En Espera';

      const [aeronaveResult] = await connection.query(
        `INSERT INTO aeronaves (
          codigo_publico, vendedor_id, ubicacion_residencia, anio_fabricacion, 
          horas_totales, horas_motores, horas_turbinas, tiene_log_books, 
          log_books_url, tiene_damage_history, damage_history_url, 
          precio_interno, precio_publico, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          codigoPublico,
          vendedorId,
          data.ubicacion_residencia || '',
          data.anio_fabricacion || data.anio || null,
          data.horas_totales || data.horas_vuelo || null,
          data.horas_motores || null,
          data.horas_turbinas || null,
          tieneLogBooks,
          logBooksUrl,
          tieneDamageHistory,
          damageHistoryUrl,
          precioInterno,
          precioPublico,
          estado
        ]
      );

      const aeronaveId = aeronaveResult.insertId;

      // Insertar imágenes asociadas
      if (files.fotos_interior && files.fotos_interior.length > 0) {
        for (const file of files.fotos_interior) {
          await connection.query(
            'INSERT INTO imagenes (url, tipo, aeronave_id, pieza_id) VALUES (?, ?, ?, NULL)',
            [`/img/${file.filename}`, 'interior', aeronaveId]
          );
        }
      }

      if (files.fotos_exterior && files.fotos_exterior.length > 0) {
        for (const file of files.fotos_exterior) {
          await connection.query(
            'INSERT INTO imagenes (url, tipo, aeronave_id, pieza_id) VALUES (?, ?, ?, NULL)',
            [`/img/${file.filename}`, 'exterior', aeronaveId]
          );
        }
      }

      if (files.imagen && files.imagen[0]) {
        await connection.query(
          'INSERT INTO imagenes (url, tipo, aeronave_id, pieza_id) VALUES (?, ?, ?, NULL)',
          [`/img/${files.imagen[0].filename}`, 'general', aeronaveId]
        );
      }

      await connection.commit();
      return aeronaveId;
    } catch (error) {
      await connection.rollback();
      console.error('Error en Aircraft.createAeronaveTransaction:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Transacción SQL para registrar una Pieza con sus imágenes
   */
  static async createPiezaTransaction(data, files = {}) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const vendedorId = await this.findOrInsertVendedor(connection, {
        nombre: data.vendedor_nombre,
        apellido: data.vendedor_apellido,
        telefono: data.vendedor_telefono,
        correo: data.vendedor_correo
      });

      const rawPn = data.part_number || data.modelo || '';
      const partNumber = rawPn.toString().replace(/^(pieza\s*p\/n\s*:?|repuesto\s*p\/n\s*:?|p\/n\s*:?|part\s*number\s*:?)\s*/i, '').trim();
      const precioInterno = parseFloat(data.precio_interno || data.precio) || 0.00;
      const precioPublico = (data.precio_publico && parseFloat(data.precio_publico) > 0) ? parseFloat(data.precio_publico) : null;
      const estado = data.estado || 'En Espera';

      const [piezaResult] = await connection.query(
        `INSERT INTO piezas (
          part_number, vendedor_id, descripcion, precio_interno, precio_publico, estado
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          partNumber,
          vendedorId,
          data.descripcion || '',
          precioInterno,
          precioPublico,
          estado
        ]
      );

      const piezaId = piezaResult.insertId;

      if (files.fotos && files.fotos.length > 0) {
        for (const file of files.fotos) {
          await connection.query(
            'INSERT INTO imagenes (url, tipo, aeronave_id, pieza_id) VALUES (?, ?, NULL, ?)',
            [`/img/${file.filename}`, 'pieza', piezaId]
          );
        }
      }

      if (files.imagen && files.imagen[0]) {
        await connection.query(
          'INSERT INTO imagenes (url, tipo, aeronave_id, pieza_id) VALUES (?, ?, NULL, ?)',
          [`/img/${files.imagen[0].filename}`, 'pieza', piezaId]
        );
      }

      await connection.commit();
      return piezaId;
    } catch (error) {
      await connection.rollback();
      console.error('Error en Aircraft.createPiezaTransaction:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener catálogo público (estado = 'En Venta')
   */
  static async getPublicCatalog() {
    try {
      const [aeronaves] = await pool.query(
        `SELECT a.*, v.nombre as vendedor_nombre, v.apellido as vendedor_apellido, v.telefono as vendedor_telefono, v.correo as vendedor_correo,
         (SELECT GROUP_CONCAT(url SEPARATOR ',') FROM imagenes WHERE aeronave_id = a.id) as imagenes_list,
         (SELECT GROUP_CONCAT(url SEPARATOR ',') FROM imagenes WHERE aeronave_id = a.id AND tipo = 'interior') as imagenes_interior_list,
         (SELECT GROUP_CONCAT(url SEPARATOR ',') FROM imagenes WHERE aeronave_id = a.id AND tipo = 'exterior') as imagenes_exterior_list
         FROM aeronaves a
         LEFT JOIN vendedores v ON a.vendedor_id = v.id
         WHERE a.estado = 'En Venta'
         ORDER BY a.id DESC`
      );

      const [piezas] = await pool.query(
        `SELECT p.*, v.nombre as vendedor_nombre, v.apellido as vendedor_apellido, v.telefono as vendedor_telefono, v.correo as vendedor_correo,
         (SELECT GROUP_CONCAT(url SEPARATOR ',') FROM imagenes WHERE pieza_id = p.id) as imagenes_list
         FROM piezas p
         LEFT JOIN vendedores v ON p.vendedor_id = v.id
         WHERE p.estado = 'En Venta'
         ORDER BY p.id DESC`
      );

      const aeronaveItems = aeronaves.map(a => {
        const imgs = a.imagenes_list ? a.imagenes_list.split(',').filter(Boolean) : [];
        const imgsInterior = a.imagenes_interior_list ? a.imagenes_interior_list.split(',').filter(Boolean) : [];
        const imgsExterior = a.imagenes_exterior_list ? a.imagenes_exterior_list.split(',').filter(Boolean) : [];
        return {
          id: a.id,
          category: 'aircraft',
          item_type: 'aircraft',
          codigo_publico: a.codigo_publico,
          model: a.codigo_publico,
          manufacturer: 'Aeronave Executive',
          year: a.anio_fabricacion,
          hours: a.horas_totales,
          horas_motores: a.horas_motores,
          horas_turbinas: a.horas_turbinas,
          price: a.precio_publico || a.precio_interno || 0,
          ubicacion: a.ubicacion_residencia,
          image_url: imgs[0] || '/img/card_sales.jpg',
          imagenes: imgs.length > 0 ? imgs : ['/img/card_sales.jpg'],
          fotos_interior: imgsInterior,
          fotos_exterior: imgsExterior,
          log_books_url: null, // Confidencial: nunca expuesto en catálogo público
          damage_history_url: a.damage_history_url,
          vendedor_nombre: a.vendedor_nombre,
          vendedor_apellido: a.vendedor_apellido,
          vendedor_telefono: a.vendedor_telefono,
          vendedor_correo: a.vendedor_correo,
          tiene_log_books: a.tiene_log_books,
          tiene_damage_history: a.tiene_damage_history,
          estado: a.estado
        };
      });

      const piezaItems = piezas.map(p => {
        const imgs = p.imagenes_list ? p.imagenes_list.split(',').filter(Boolean) : [];
        const cleanPN = (p.part_number || '').toString().replace(/^(pieza\s*p\/n\s*:?|repuesto\s*p\/n\s*:?|p\/n\s*:?|part\s*number\s*:?)\s*/i, '').trim();
        return {
          id: p.id,
          category: 'part',
          item_type: 'part',
          codigo_publico: cleanPN,
          part_number: cleanPN,
          model: cleanPN,
          manufacturer: 'Componente Certificado',
          year: 'N/A',
          hours: 0,
          descripcion: p.descripcion,
          price: p.precio_publico || p.precio_interno || 0,
          has_images: imgs.length > 0,
          image_url: imgs[0] || null,
          imagenes: imgs,
          vendedor_nombre: p.vendedor_nombre,
          vendedor_apellido: p.vendedor_apellido,
          vendedor_telefono: p.vendedor_telefono,
          vendedor_correo: p.vendedor_correo,
          estado: p.estado
        };
      });

      return [...aeronaveItems, ...piezaItems];
    } catch (error) {
      console.error('Error en Aircraft.getPublicCatalog:', error);
      throw error;
    }
  }

  /**
   * Obtener inventario completo para el panel de administración
   */
  static async getAllForAdmin() {
    try {
      const [aeronaves] = await pool.query(
        `SELECT a.*, v.nombre as vendedor_nombre, v.apellido as vendedor_apellido, v.telefono as vendedor_telefono, v.correo as vendedor_correo,
         (SELECT GROUP_CONCAT(url SEPARATOR ',') FROM imagenes WHERE aeronave_id = a.id) as imagenes_list,
         (SELECT COUNT(*) FROM imagenes WHERE aeronave_id = a.id) as fotos_count
         FROM aeronaves a
         LEFT JOIN vendedores v ON a.vendedor_id = v.id
         ORDER BY a.id DESC`
      );

      const [piezas] = await pool.query(
        `SELECT p.*, v.nombre as vendedor_nombre, v.apellido as vendedor_apellido, v.telefono as vendedor_telefono, v.correo as vendedor_correo,
         (SELECT GROUP_CONCAT(url SEPARATOR ',') FROM imagenes WHERE pieza_id = p.id) as imagenes_list,
         (SELECT COUNT(*) FROM imagenes WHERE pieza_id = p.id) as fotos_count
         FROM piezas p
         LEFT JOIN vendedores v ON p.vendedor_id = v.id
         ORDER BY p.id DESC`
      );

      const aeronavesList = aeronaves.map(a => {
        let pdfsCount = 0;
        if (a.log_books_url) pdfsCount++;
        if (a.damage_history_url) pdfsCount++;

        const imgs = a.imagenes_list ? a.imagenes_list.split(',').filter(Boolean) : [];
        const precioPub = a.precio_publico !== null && a.precio_publico !== undefined ? Number(a.precio_publico) : null;
        const precioInt = Number(a.precio_interno || 0);

        return {
          uid: `aircraft_${a.id}`,
          id: a.id,
          tipo: 'aircraft',
          item_type: 'aircraft',
          codigo_publico: a.codigo_publico || `SKY-AER-${a.id}`,
          modelo: a.codigo_publico || `SKY-AER-${a.id}`,
          solicitante: `${a.vendedor_nombre || ''} ${a.vendedor_apellido || ''}`.trim() || 'Cliente',
          vendedor_nombre: a.vendedor_nombre || '',
          vendedor_apellido: a.vendedor_apellido || '',
          contacto: a.vendedor_telefono || a.vendedor_correo || 'N/A',
          vendedor_telefono: a.vendedor_telefono || '',
          vendedor_correo: a.vendedor_correo || '',
          anio: a.anio_fabricacion,
          horas_vuelo: a.horas_totales,
          horas_motores: a.horas_motores,
          horas_turbinas: a.horas_turbinas,
          ubicacion: a.ubicacion_residencia,
          tiene_log_books: a.tiene_log_books,
          log_books_url: a.log_books_url,
          tiene_damage_history: a.tiene_damage_history,
          damage_history_url: a.damage_history_url,
          precio_interno: precioInt,
          precio_publico: precioPub,
          ganancia: precioPub !== null ? Number((precioPub - precioInt).toFixed(2)) : null,
          estado: a.estado || 'En Espera',
          imagen_url: imgs[0] || '/img/card_sales.jpg',
          imagenes: imgs.length > 0 ? imgs : ['/img/card_sales.jpg'],
          has_custom_images: imgs.length > 0,
          fotos_count: a.fotos_count || imgs.length || 0,
          pdfs_count: pdfsCount
        };
      });

      const piezasList = piezas.map(p => {
        const imgs = p.imagenes_list ? p.imagenes_list.split(',').filter(Boolean) : [];
        const precioPub = p.precio_publico !== null && p.precio_publico !== undefined ? Number(p.precio_publico) : null;
        const precioInt = Number(p.precio_interno || 0);

        const cleanPN = (p.part_number || '').toString().replace(/^(pieza\s*p\/n\s*:?|repuesto\s*p\/n\s*:?|p\/n\s*:?|part\s*number\s*:?)\s*/i, '').trim();

        return {
          uid: `part_${p.id}`,
          id: p.id,
          tipo: 'part',
          item_type: 'part',
          codigo_publico: cleanPN || `SKY-PAR-${p.id}`,
          part_number: cleanPN,
          modelo: cleanPN || `SKY-PAR-${p.id}`,
          solicitante: `${p.vendedor_nombre || ''} ${p.vendedor_apellido || ''}`.trim() || 'Cliente',
          vendedor_nombre: p.vendedor_nombre || '',
          vendedor_apellido: p.vendedor_apellido || '',
          contacto: p.vendedor_telefono || p.vendedor_correo || 'N/A',
          vendedor_telefono: p.vendedor_telefono || '',
          vendedor_correo: p.vendedor_correo || '',
          descripcion: p.descripcion,
          precio_interno: precioInt,
          precio_publico: precioPub,
          ganancia: precioPub !== null ? Number((precioPub - precioInt).toFixed(2)) : null,
          estado: p.estado || 'En Espera',
          imagen_url: imgs[0] || null,
          imagenes: imgs,
          has_custom_images: imgs.length > 0,
          fotos_count: p.fotos_count || imgs.length || 0,
          pdfs_count: 0
        };
      });

      return [...aeronavesList, ...piezasList];
    } catch (error) {
      console.error('Error en Aircraft.getAllForAdmin:', error);
      throw error;
    }
  }

  /**
   * Verificar si un registro tiene precio público válido mayor a 0
   */
  static async hasPublicPrice(tipo, id) {
    try {
      const table = (tipo === 'part' || tipo === 'pieza') ? 'piezas' : 'aeronaves';
      const [rows] = await pool.query(`SELECT precio_publico FROM ${table} WHERE id = ? LIMIT 1`, [id]);
      if (rows.length === 0) return false;
      return rows[0].precio_publico !== null && rows[0].precio_publico !== undefined && parseFloat(rows[0].precio_publico) > 0;
    } catch (error) {
      console.error('Error en Aircraft.hasPublicPrice:', error);
      return false;
    }
  }

  /**
   * Actualizar estado comercial con validación estricta de Precio Público
   */
  static async updateStatus(tipo, id, newStatus) {
    try {
      const table = (tipo === 'part' || tipo === 'pieza') ? 'piezas' : 'aeronaves';
      if (newStatus === 'En Venta') {
        const [rows] = await pool.query(`SELECT precio_publico FROM ${table} WHERE id = ? LIMIT 1`, [id]);
        if (!rows.length || rows[0].precio_publico === null || parseFloat(rows[0].precio_publico) <= 0) {
          throw new Error('No se puede publicar en venta sin antes asignar un Precio Público.');
        }
      }
      await pool.query(`UPDATE ${table} SET estado = ? WHERE id = ?`, [newStatus, id]);
      return true;
    } catch (error) {
      console.error('Error en Aircraft.updateStatus:', error);
      throw error;
    }
  }

  /**
   * Actualizar precio público asignado por el Administrador
   */
  static async updatePrecioPublico(tipo, id, precioPublico) {
    try {
      const table = (tipo === 'part' || tipo === 'pieza') ? 'piezas' : 'aeronaves';
      const val = (precioPublico !== null && precioPublico !== undefined && precioPublico !== '') ? parseFloat(precioPublico) : null;
      await pool.query(`UPDATE ${table} SET precio_publico = ? WHERE id = ?`, [val, id]);
      return true;
    } catch (error) {
      console.error('Error en Aircraft.updatePrecioPublico:', error);
      throw error;
    }
  }

  /**
   * Actualizar registro existente (aeronave o pieza) de forma completa y profesional
   */
  static async updateItem(id, data, files = {}) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (data.tipo === 'pieza' || data.tipo === 'part') {
        const rawPn = data.part_number || data.modelo || `SKY-PAR-${id}`;
        const pn = rawPn.toString().replace(/^(pieza\s*p\/n\s*:?|repuesto\s*p\/n\s*:?|p\/n\s*:?|part\s*number\s*:?)\s*/i, '').trim();
        const pPub = (data.precio_publico !== undefined && data.precio_publico !== '' && data.precio_publico !== null) ? parseFloat(data.precio_publico) : null;
        const pInt = parseFloat(data.precio_interno) || 0;
        const estado = data.estado || 'En Espera';

        // Validación estricta: No publicar si no tiene precio público
        if (estado === 'En Venta' && (pPub === null || pPub <= 0)) {
          throw new Error('No se puede publicar una pieza sin asignar un Precio Público.');
        }

        await connection.query(
          `UPDATE piezas SET part_number = ?, descripcion = ?, precio_interno = ?, precio_publico = ?, estado = ? WHERE id = ?`,
          [pn, data.descripcion || '', pInt, pPub, estado, id]
        );

        // Actualizar datos del vendedor si se enviaron
        const [pzRows] = await connection.query('SELECT vendedor_id FROM piezas WHERE id = ?', [id]);
        if (pzRows.length > 0 && pzRows[0].vendedor_id) {
          await connection.query(
            `UPDATE vendedores SET nombre = ?, apellido = ?, telefono = ?, correo = ? WHERE id = ?`,
            [data.vendedor_nombre || '', data.vendedor_apellido || '', data.vendedor_telefono || '', data.vendedor_correo || '', pzRows[0].vendedor_id]
          );
        }

        // Subir nuevas fotos si fueron provistas
        if (files && files.fotos && files.fotos.length > 0) {
          for (const file of files.fotos) {
            await connection.query(
              'INSERT INTO imagenes (url, tipo, aeronave_id, pieza_id) VALUES (?, ?, NULL, ?)',
              [`/img/${file.filename}`, 'pieza', id]
            );
          }
        }
        if (files && files.imagen && files.imagen[0]) {
          await connection.query(
            'INSERT INTO imagenes (url, tipo, aeronave_id, pieza_id) VALUES (?, ?, NULL, ?)',
            [`/img/${files.imagen[0].filename}`, 'pieza', id]
          );
        }
      } else {
        const pPub = (data.precio_publico !== undefined && data.precio_publico !== '' && data.precio_publico !== null) ? parseFloat(data.precio_publico) : null;
        const pInt = parseFloat(data.precio_interno) || 0;
        const estado = data.estado || 'En Espera';

        // Validación estricta: No publicar si no tiene precio público
        if (estado === 'En Venta' && (pPub === null || pPub <= 0)) {
          throw new Error('No se puede publicar una aeronave sin asignar un Precio Público.');
        }

        let updateSql = `UPDATE aeronaves SET 
          codigo_publico = ?, 
          anio_fabricacion = ?, 
          horas_totales = ?, 
          horas_motores = ?, 
          horas_turbinas = ?, 
          ubicacion_residencia = ?, 
          precio_interno = ?, 
          precio_publico = ?, 
          estado = ?`;
        const params = [
          data.modelo || data.codigo_publico,
          data.anio || data.anio_fabricacion || null,
          data.horas_vuelo || data.horas_totales || null,
          data.horas_motores || null,
          data.horas_turbinas || null,
          data.ubicacion || data.ubicacion_residencia || '',
          pInt,
          pPub,
          estado
        ];

        if (files && files.log_books_file && files.log_books_file[0]) {
          updateSql += `, log_books_url = ?, tiene_log_books = 1`;
          params.push(`/uploads/${files.log_books_file[0].filename}`);
        }
        if (files && files.damage_history_file && files.damage_history_file[0]) {
          updateSql += `, damage_history_url = ?, tiene_damage_history = 1`;
          params.push(`/uploads/${files.damage_history_file[0].filename}`);
        }

        updateSql += ` WHERE id = ?`;
        params.push(id);

        await connection.query(updateSql, params);

        // Actualizar datos del vendedor si se enviaron
        const [aeroRows] = await connection.query('SELECT vendedor_id FROM aeronaves WHERE id = ?', [id]);
        if (aeroRows.length > 0 && aeroRows[0].vendedor_id) {
          await connection.query(
            `UPDATE vendedores SET nombre = ?, apellido = ?, telefono = ?, correo = ? WHERE id = ?`,
            [data.vendedor_nombre || '', data.vendedor_apellido || '', data.vendedor_telefono || '', data.vendedor_correo || '', aeroRows[0].vendedor_id]
          );
        }

        // Subir nuevas fotos si fueron provistas
        if (files && files.imagen && files.imagen[0]) {
          await connection.query(
            'INSERT INTO imagenes (url, tipo, aeronave_id, pieza_id) VALUES (?, ?, ?, NULL)',
            [`/img/${files.imagen[0].filename}`, 'general', id]
          );
        }
        if (files && files.fotos_interior && files.fotos_interior.length > 0) {
          for (const file of files.fotos_interior) {
            await connection.query(
              'INSERT INTO imagenes (url, tipo, aeronave_id, pieza_id) VALUES (?, ?, ?, NULL)',
              [`/img/${file.filename}`, 'interior', id]
            );
          }
        }
        if (files && files.fotos_exterior && files.fotos_exterior.length > 0) {
          for (const file of files.fotos_exterior) {
            await connection.query(
              'INSERT INTO imagenes (url, tipo, aeronave_id, pieza_id) VALUES (?, ?, ?, NULL)',
              [`/img/${file.filename}`, 'exterior', id]
            );
          }
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('Error en Aircraft.updateItem:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Eliminar registro del inventario
   */
  static async deleteItem(tipo, id) {
    try {
      if (tipo === 'part' || tipo === 'pieza') {
        await pool.query('DELETE FROM imagenes WHERE pieza_id = ?', [id]);
        const [res] = await pool.query('DELETE FROM piezas WHERE id = ?', [id]);
        return res.affectedRows > 0;
      } else {
        await pool.query('DELETE FROM imagenes WHERE aeronave_id = ?', [id]);
        const [res] = await pool.query('DELETE FROM aeronaves WHERE id = ?', [id]);
        return res.affectedRows > 0;
      }
    } catch (error) {
      console.error('Error en Aircraft.deleteItem:', error);
      throw error;
    }
  }

  // Métodos estáticos de compatibilidad
  static async getAll() { return this.getPublicCatalog(); }
  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM aeronaves WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }
  static async create(data) { return this.createAeronaveTransaction(data); }
  static async update(id, data) { return this.updateItem(id, data); }
  static async delete(id) { return this.deleteItem('aircraft', id); }
}

module.exports = Aircraft;


