/**
 * ===================================================
 * Rutas: charterRoutes
 * Responsable Asignado: Jesus
 * Módulos: Alquiler, cotizaciones charter y operaciones de vuelos
 * ===================================================
 */

const express = require('express');
const router = express.Router();
const charterController = require('../controllers/charterController');

// Rutas Públicas (Cotizador y Servicios Charter)
router.get('/', charterController.showPublicCharters);
router.post('/solicitar', charterController.requestCharter);

// Rutas Administrativas (Gestión de Operaciones Charters)
router.get('/admin/operaciones', charterController.showAdminOperations);
router.post('/admin/operaciones/:id/status', charterController.updateFlightStatus);

module.exports = router;
