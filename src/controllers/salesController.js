/**
 * ===================================================
 * Controlador: salesController
 * Responsable Asignado: Morao
 * Tareas:
 *  - Portal Público: Catálogo de venta de aeronaves y piezas aeronáuticas (sales.ejs)
 *  - Portal Admin: Gestión de inventario (admin/inventario.ejs)
 *  - CRUD de inventario (Crear, editar, eliminar aeronaves y repuestos)
 * ===================================================
 */

const Aircraft = require('../models/Aircraft');

// [Morao] Mostrar catálogo público de aeronaves y piezas (estado = 'En Venta')
const showPublicCatalog = async (req, res, next) => {
  try {
    const aircrafts = await Aircraft.getPublicCatalog();

    res.render('sales', {
      title: 'Venta de Aeronaves y Piezas | SkyMaster',
      aircrafts: aircrafts || []
    });
  } catch (error) {
    console.error('Error en showPublicCatalog:', error);
    next(error);
  }
};

// [Morao] Ver detalle de una aeronave específica
const getAircraftDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const aircraft = await Aircraft.getById(id);
    if (!aircraft) {
      return res.status(404).render('404', { title: 'Aeronave No Encontrada | SkyMaster' });
    }
    res.json({ success: true, data: aircraft });
  } catch (error) {
    next(error);
  }
};

// [Morao] Mostrar vista administrativa del inventario
const showAdminInventory = async (req, res, next) => {
  try {
    const inventory = await Aircraft.getAllForAdmin();

    res.render('admin/inventario', {
      title: 'Manejo de Inventario | SkyMaster Admin',
      inventory: inventory || []
    });
  } catch (error) {
    console.error('Error en showAdminInventory:', error);
    next(error);
  }
};

// [Morao] Registrar nueva aeronave solicitada desde cliente público
const createAircraft = async (req, res, next) => {
  try {
    await Aircraft.createAeronaveTransaction(req.body, req.files);
    res.redirect('/sales?success=1');
  } catch (error) {
    console.error('Error en createAircraft:', error);
    next(error);
  }
};

// [Morao] Registrar nueva pieza solicitada desde cliente público
const createPart = async (req, res, next) => {
  try {
    await Aircraft.createPiezaTransaction(req.body, req.files);
    res.redirect('/sales?success=1');
  } catch (error) {
    console.error('Error en createPart:', error);
    next(error);
  }
};

// [Morao] Registrar item desde Admin (Aeronave o Pieza)
const createAdminItem = async (req, res, next) => {
  try {
    const tipo = req.body.tipo || req.body.tipo_select || req.body.modalTipo;
    const precioPub = parseFloat(req.body.precio_publico);
    // Validación estricta: No se puede registrar como 'En Venta' sin precio público
    if (req.body.estado === 'En Venta' && (isNaN(precioPub) || precioPub <= 0)) {
      req.body.estado = 'En Espera';
    }

    if (tipo === 'pieza' || tipo === 'part') {
      await Aircraft.createPiezaTransaction(req.body, req.files);
    } else {
      await Aircraft.createAeronaveTransaction(req.body, req.files);
    }
    res.redirect('/admin/inventario');
  } catch (error) {
    console.error('Error en createAdminItem:', error);
    next(error);
  }
};

// [Morao] Actualizar datos de aeronave o pieza
const updateAircraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    const precioPub = parseFloat(req.body.precio_publico);
    // Validación estricta: No se puede actualizar a 'En Venta' sin precio público
    if (req.body.estado === 'En Venta' && (isNaN(precioPub) || precioPub <= 0)) {
      req.body.estado = 'En Espera';
    }
    await Aircraft.updateItem(id, req.body, req.files);
    res.redirect('/admin/inventario');
  } catch (error) {
    console.error('Error en updateAircraft:', error);
    next(error);
  }
};

// [Morao] Actualizar precio público asignado por Administrador
const updatePrecioPublico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tipo, precio_publico } = req.body;
    await Aircraft.updatePrecioPublico(tipo, id, precio_publico);
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.json({ success: true, message: 'Precio público actualizado correctamente' });
    }
    res.redirect('/admin/inventario');
  } catch (error) {
    console.error('Error en updatePrecioPublico:', error);
    next(error);
  }
};

// [Morao] Actualizar estado comercial (En Espera, En Venta, Vendido) con validación estricta
const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tipo, estado } = req.body;

    // Validación estricta: Bloquear cambio a 'En Venta' si no tiene precio público
    if (estado === 'En Venta') {
      const hasPrice = await Aircraft.hasPublicPrice(tipo, id);
      if (!hasPrice) {
        if (req.xhr || req.headers.accept?.includes('json')) {
          return res.status(400).json({
            success: false,
            message: 'Acción bloqueada: Ninguna aeronave o pieza puede publicarse si no tiene asignado un Precio Público.'
          });
        }
        return res.redirect('/admin/inventario?error=precio_requerido');
      }
    }

    await Aircraft.updateStatus(tipo, id, estado);
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.json({ success: true, message: 'Estado comercial actualizado correctamente' });
    }
    res.redirect('/admin/inventario');
  } catch (error) {
    console.error('Error en updateStatus:', error);
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(400).json({ success: false, message: error.message || 'Error al actualizar estado' });
    }
    next(error);
  }
};

// [Morao] Eliminar aeronave o pieza del inventario
const deleteAircraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tipo = req.body.tipo || req.query.tipo || 'aircraft';
    await Aircraft.deleteItem(tipo, id);
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.json({ success: true, message: 'Registro eliminado correctamente' });
    }
    res.redirect('/admin/inventario');
  } catch (error) {
    console.error('Error en deleteAircraft:', error);
    next(error);
  }
};

module.exports = {
  showPublicCatalog,
  getAircraftDetail,
  showAdminInventory,
  createAircraft,
  createPart,
  createAdminItem,
  updateAircraft,
  updatePrecioPublico,
  updateStatus,
  deleteAircraft
};


