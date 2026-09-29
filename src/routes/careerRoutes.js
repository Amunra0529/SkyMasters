/**
 * ===================================================
 * Rutas: careerRoutes
 * Responsable Asignado: Osuna
 * Módulos: Bolsa de trabajo para postulantes y gestión de candidatos
 * ===================================================
 */

const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');

// Rutas Públicas (Bolsa de trabajo y postulación)
router.get('/', careerController.showPublicCareers);
router.post('/postular', careerController.submitApplication);

// Rutas Administrativas (Gestión de Candidatos)
router.get('/admin/candidatos', careerController.showAdminCandidates);
router.post('/admin/candidatos/:id/status', careerController.updateCandidateStatus);

module.exports = router;
