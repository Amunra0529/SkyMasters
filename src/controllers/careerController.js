/**
 * ===================================================
 * Controlador: careerController
 * Responsable Asignado: Osuna
 * Tareas:
 *  - Portal Público: Bolsa de trabajo y formulario de postulación (careers.ejs)
 *  - Portal Admin: Gestión de postulantes y currículums (admin/candidatos.ejs)
 *  - Manejo de estados de selección de candidatos (En revisión, Entrevista, Aceptado)
 * ===================================================
 */

const Candidate = require('../models/Candidate');

// [Osuna] Mostrar portal público de bolsa de trabajo y vacantes
const showPublicCareers = async (req, res, next) => {
  try {
    // Vacantes disponibles de muestra
    const vacancies = [
      { id: 1, title: 'Capitán / Primer Oficial - Flota Jet Ejecutivo', department: 'Operaciones de Vuelo', location: 'Base Principal' },
      { id: 2, title: 'Técnico de Mantenimiento Aeronáutico (TMA)', department: 'Mantenimiento & Hangares', location: 'Hangar Central' },
      { id: 3, title: 'Tripulante de Cabina Corporativo / VIP', department: 'Servicio a Bordo', location: 'Base Principal' }
    ];

    res.render('careers', {
      title: 'Bolsa de Trabajo y Carreras | SkyMaster',
      vacancies,
      successMessage: null
    });
  } catch (error) {
    next(error);
  }
};

// [Osuna] Procesar postulación y envío de currículum
const submitApplication = async (req, res, next) => {
  try {
    // TODO: [Osuna] Guardar datos y archivo PDF en public/uploads/ con Candidate.create(req.body)
    res.render('careers', {
      title: 'Bolsa de Trabajo y Carreras | SkyMaster',
      vacancies: [],
      successMessage: '¡Gracias por postularte a SkyMaster! Tu información ha sido enviada al departamento de Recursos Humanos.'
    });
  } catch (error) {
    next(error);
  }
};

// [Osuna] Mostrar panel administrativo de candidatos recibidos
const showAdminCandidates = async (req, res, next) => {
  try {
    // TODO: [Osuna] Obtener postulaciones desde la base de datos usando Candidate.getAll()
    res.render('admin/candidatos', {
      title: 'Gestión de Postulantes | SkyMaster Admin',
      candidates: []
    });
  } catch (error) {
    next(error);
  }
};

// [Osuna] Actualizar estado de postulación (En revisión, Entrevista, Aceptado, Rechazado)
const updateCandidateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // TODO: [Osuna] Actualizar estado con Candidate.updateStatus(id, status)
    res.redirect('/admin/candidatos');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showPublicCareers,
  submitApplication,
  showAdminCandidates,
  updateCandidateStatus
};
