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
router.get('/view-cv', careerController.viewCv);

// Rutas Administrativas (Gestión de Candidatos)
router.get('/admin/candidatos', careerController.showAdminCandidates);
router.post('/admin/candidatos/:id/status', careerController.updateCandidateStatus);
router.post('/admin/candidatos/add', careerController.addCandidate);
router.post('/admin/candidatos/:id/edit', careerController.editCandidate);
router.post('/admin/candidatos/:id/delete', careerController.deleteCandidate);

module.exports = router;
