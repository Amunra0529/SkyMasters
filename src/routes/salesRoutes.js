/**
 * ===================================================
 * Rutas: salesRoutes
 * Responsable Asignado: Morao
 * Módulos: Venta de aeronaves, catálogo público y gestión de inventario
 * ===================================================
 */

const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Rutas Públicas (Catálogo)
router.get('/', salesController.showPublicCatalog);
router.get('/detalle/:id', salesController.getAircraftDetail);

// Rutas Administrativas (Gestión de Inventario)
router.get('/admin/inventario', salesController.showAdminInventory);
router.post('/admin/inventario', salesController.createAircraft);
router.post('/admin/inventario/:id/edit', salesController.updateAircraft);
router.post('/admin/inventario/:id/delete', salesController.deleteAircraft);

module.exports = router;
