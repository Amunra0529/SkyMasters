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

// [Morao] Mostrar catálogo público de aeronaves y piezas
const showPublicCatalog = async (req, res, next) => {
  try {
    // TODO: [Morao] Consultar aeronaves disponibles desde la base de datos
    const mockAircrafts = [
      { id: 1, model: 'Gulfstream G650ER', category: 'Jet Pesado', manufacturer: 'Gulfstream', year: 2021, price: 65000000, hours: 850, image_url: '/img/placeholder-jet.jpg' },
      { id: 2, model: 'Cessna Citation Latitude', category: 'Jet Mediano', manufacturer: 'Textron Aviation', year: 2020, price: 16500000, hours: 1200, image_url: '/img/placeholder-jet.jpg' },
      { id: 3, model: 'Turbina Pratt & Whitney PT6A', category: 'Piezas & Motores', manufacturer: 'Pratt & Whitney', year: 2022, price: 420000, hours: 0, image_url: '/img/placeholder-jet.jpg' }
    ];
    res.render('sales', {
      title: 'Venta de Aeronaves y Piezas | SkyMaster',
      aircrafts: mockAircrafts
    });
  } catch (error) {
    next(error);
  }
};

// [Morao] Ver detalle de una aeronave específica
const getAircraftDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: [Morao] Buscar aeronave por ID usando Aircraft.getById(id)
    res.json({ message: `Detalle de aeronave ID ${id} (Placeholder de Morao)` });
  } catch (error) {
    next(error);
  }
};

// [Morao] Mostrar vista administrativa del inventario
const showAdminInventory = async (req, res, next) => {
  try {
    // TODO: [Morao] Obtener listado completo de inventario para el panel de administración
    res.render('admin/inventario', {
      title: 'Manejo de Inventario | SkyMaster Admin',
      inventory: []
    });
  } catch (error) {
    next(error);
  }
};

// [Morao] Registrar nueva aeronave o pieza en el inventario
const createAircraft = async (req, res, next) => {
  try {
    // TODO: [Morao] Recibir datos del formulario y guardar en BD usando Aircraft.create(req.body)
    res.redirect('/admin/inventario');
  } catch (error) {
    next(error);
  }
};

// [Morao] Actualizar datos de aeronave o pieza
const updateAircraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: [Morao] Actualizar registro en BD usando Aircraft.update(id, req.body)
    res.redirect('/admin/inventario');
  } catch (error) {
    next(error);
  }
};

// [Morao] Eliminar aeronave o pieza del inventario
const deleteAircraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: [Morao] Eliminar registro en BD usando Aircraft.delete(id)
    res.redirect('/admin/inventario');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showPublicCatalog,
  getAircraftDetail,
  showAdminInventory,
  createAircraft,
  updateAircraft,
  deleteAircraft
};
