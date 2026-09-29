/**
 * ===================================================
 * Controlador: charterController
 * Responsable Asignado: Jesus
 * Tareas:
 *  - Portal Público: Servicios de vuelos privados y cotizador charter (charters.ejs)
 *  - Portal Admin: Gestión de operaciones de vuelos charter (admin/operaciones.ejs)
 *  - Monitoreo de estado de vuelos (Programado, Confirmado, En Vuelo, Completado)
 * ===================================================
 */

const Charter = require('../models/Charter');

// [Jesus] Mostrar portal público de vuelos charter y cotizaciones
const showPublicCharters = async (req, res, next) => {
  try {
    res.render('charters', {
      title: 'Vuelos Charter y Alquiler de Jets | SkyMaster'
    });
  } catch (error) {
    next(error);
  }
};

// [Jesus] Procesar nueva solicitud de vuelo charter
const requestCharter = async (req, res, next) => {
  try {
    // TODO: [Jesus] Guardar la solicitud en la base de datos usando Charter.create(req.body)
    res.render('charters', {
      title: 'Vuelos Charter | SkyMaster',
      successMessage: 'Tu solicitud de vuelo charter ha sido recibida con éxito. Un asesor de operaciones te contactará a la brevedad.'
    });
  } catch (error) {
    next(error);
  }
};

// [Jesus] Mostrar panel de operaciones de vuelos charter (Portal Admin)
const showAdminOperations = async (req, res, next) => {
  try {
    // TODO: [Jesus] Obtener todas las operaciones de vuelos programadas
    res.render('admin/operaciones', {
      title: 'Gestión de Operaciones Charters | SkyMaster Admin',
      flights: []
    });
  } catch (error) {
    next(error);
  }
};

// [Jesus] Actualizar el estado de una operación charter
const updateFlightStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // TODO: [Jesus] Actualizar estado usando Charter.updateStatus(id, status)
    res.redirect('/admin/operaciones');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showPublicCharters,
  requestCharter,
  showAdminOperations,
  updateFlightStatus
};
