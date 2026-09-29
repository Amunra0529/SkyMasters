/**
 * ===================================================
 * Rutas: adminRoutes
 * Responsable Asignado: Dionkel
 * Módulos: Dashboard central de métricas, reportes y generación de PDFs
 * ===================================================
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const salesController = require('../controllers/salesController');
const charterController = require('../controllers/charterController');
const careerController = require('../controllers/careerController');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Dashboard principal de métricas y analíticas (Dionkel)
router.get('/', (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', adminController.showDashboard);

// Generación de Reportes PDF (Dionkel)
router.get('/reportes/pdf/:reportType', adminController.generateReportPDF);
router.get('/api/metrics', adminController.getMetricsSummary);

// Módulos integrados del panel administrativo para navegación unificada:
// Manejo de Inventario (Morao)
router.get('/inventario', salesController.showAdminInventory);

// Operaciones Charters (Jesus)
router.get('/operaciones', charterController.showAdminOperations);

// Gestión de Postulantes (Osuna)
router.get('/candidatos', careerController.showAdminCandidates);

// Configuración y Respaldos (Jhon)
router.get('/configuracion', authController.showConfiguration);

module.exports = router;
