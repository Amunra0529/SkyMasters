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
router.get('/', salesController.showPublicCatalog); // Mostrar catálogo público de aeronaves y piezas
router.get('/detalle/:id', salesController.getAircraftDetail); // Ver detalle de una aeronave específica

// Rutas Administrativas (Gestión de Inventario)
router.get('/admin/inventario', salesController.showAdminInventory); // Mostrar inventario
router.post('/admin/inventario', salesController.createAircraft);  // Crear aeronave o pieza
router.post('/admin/inventario/:id/edit', salesController.updateAircraft); // Actualizar aeronave o pieza
router.post('/admin/inventario/:id/delete', salesController.deleteAircraft); // Eliminar aeronave o pieza

module.exports = router;
