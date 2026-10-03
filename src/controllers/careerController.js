/**
 * ===================================================
 * Controlador: careerController
 * Responsable Asignado: Osuna
 * Tareas:
 *  - Portal Publico: Bolsa de trabajo y formulario de postulacion (careers.ejs)
 *  - Portal Admin: Gestion de postulantes y curriculums (admin/candidatos.ejs)
 *  - Manejo de estados de seleccion de candidatos (En revision, Entrevista, Aceptado)
 * ===================================================
 */

const Candidate = require('../models/Candidate');
const multer    = require('multer');
const path      = require('path');

// Configuracion Multer para subida de CVs en PDF (max 5 MB)
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/cv'));
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `cv_${Date.now()}_${safeName}`);
  }
});

const cvUpload = multer({
  storage: cvStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Solo se permiten archivos PDF'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Mostrar portal publico de bolsa de trabajo y vacantes
const showPublicCareers = async (req, res, next) => {
  try {
    const vacancies = [
      { id: 1, title: 'Capitan / Primer Oficial - Flota Jet Ejecutivo', department: 'Operaciones de Vuelo', location: 'Base Principal' },
      { id: 2, title: 'Tecnico de Mantenimiento Aeronautico (TMA)', department: 'Mantenimiento & Hangares', location: 'Hangar Central' },
      { id: 3, title: 'Tripulante de Cabina Corporativo / VIP', department: 'Servicio a Bordo', location: 'Base Principal' }
    ];
    let successMessage = null;
    let errorMessage = null;
    if (req.query.success === 'true') {
      successMessage = '¡Gracias por postularte a SkyMaster! Tu información y CV han sido recibidos con éxito por Recursos Humanos.';
    }
    if (req.query.error === 'upload') {
      errorMessage = 'Ocurrió un error al subir el CV. Verifica que sea un PDF menor a 5MB.';
    }
    res.render('careers', { title: 'Bolsa de Trabajo y Carreras | SkyMaster', vacancies, successMessage, errorMessage });
  } catch (error) { next(error); }
};

// Procesar postulacion publica
const submitApplication = (req, res, next) => {
  const upload = cvUpload.single('cv_file');
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error al subir CV público:', err);
      return res.redirect('/careers?error=upload');
    }

    try {
      const data = { ...req.body };
      if (req.file) {
        data.resume_url = `/uploads/cv/${req.file.filename}`;
      }
      
      await Candidate.create(data);

      res.redirect('/careers?success=true');
    } catch (error) {
      next(error);
    }
  });
};

// Mostrar panel administrativo de candidatos
const showAdminCandidates = async (req, res, next) => {
  try {
    const { q, status } = req.query;
    let candidates = await Candidate.getAll();
    if (status) candidates = candidates.filter(c => c.status === status);
    if (q) {
      const search = q.toLowerCase();
      candidates = candidates.filter(c =>
        c.full_name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search)
      );
    }
    let successMessage = null;
    if (req.query.success === 'added') successMessage = 'Candidato agregado correctamente.';
    if (req.query.success === 'edited') successMessage = 'Candidato actualizado correctamente.';
    if (req.query.success === 'deleted') successMessage = 'Candidato eliminado correctamente.';
    if (req.query.success === 'status') successMessage = 'Estado del candidato actualizado.';

    res.render('admin/candidatos', {
      title: 'Gestion de Postulantes | SkyMaster Admin',
      candidates, statusFilter: status || '', query: q || '', successMessage
    });
  } catch (error) { next(error); }
};

// Actualizar estado de postulacion
const updateCandidateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['in_review', 'interview', 'accepted', 'rejected'];
    if (validStatuses.includes(status)) await Candidate.updateStatus(id, status);
    res.redirect('/admin/candidatos?success=status');
  } catch (error) { next(error); }
};

// Anadir candidato manualmente con subida opcional de CV PDF
const addCandidate = (req, res, next) => {
  cvUpload.single('resume_file')(req, res, async (err) => {
    try {
      if (err) console.error('[Multer] Error subiendo CV:', err.message);
      const data = { ...req.body };
      if (req.file) data.resume_url = `/uploads/cv/${req.file.filename}`;
      await Candidate.create(data);
      res.redirect('/admin/candidatos?success=added');
    } catch (error) { next(error); }
  });
};

// Editar candidato existente
const editCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Candidate.update(id, req.body);
    res.redirect('/admin/candidatos?success=edited');
  } catch (error) { next(error); }
};

// Eliminar candidato
const deleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Candidate.delete(id);
    res.redirect('/admin/candidatos?success=deleted');
  } catch (error) { next(error); }
};

// [Osuna] Servir CV en linea para el visor del modal
const viewCv = (req, res, next) => {
  try {
    const fileParam = req.query.file;
    if (!fileParam) return res.status(400).send('Archivo no especificado');
    
    // Convertir la ruta web /uploads/cv/... a ruta absoluta del sistema de archivos
    const fileName = path.basename(fileParam);
    const filePath = path.join(__dirname, '../../public/uploads/cv', fileName);
    
    res.sendFile(filePath, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline' // <-- ESTO ES CLAVE PARA QUE NO SE DESCARGUE
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showPublicCareers,
  submitApplication,
  showAdminCandidates,
  updateCandidateStatus,
  addCandidate,
  editCandidate,
  deleteCandidate,
  viewCv
};
