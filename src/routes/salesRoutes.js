/**
 * ===================================================
 * Rutas: salesRoutes
 * Responsable Asignado: Morao
 * Módulos: Venta de aeronaves, catálogo público y gestión de inventario
 * ===================================================
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const salesController = require('../controllers/salesController');

// Asegurar existencia de directorios de almacenamiento
const uploadsDir = path.join(__dirname, '../../public/uploads');
const imgDir = path.join(__dirname, '../../public/img');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Configuración de Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'log_books_file' || file.fieldname === 'damage_history_file') {
      cb(null, uploadsDir);
    } else {
      cb(null, imgDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();

    if (file.fieldname === 'log_books_file' || file.fieldname === 'damage_history_file') {
      const docType = file.fieldname.replace('_file', '');
      cb(null, `${docType}-${timestamp}${ext}`);
    } else {
      const codigoRaw = req.body.codigo_publico || req.body.part_number || req.body.modelo || 'ITEM';
      const cleanCodigo = codigoRaw.toString().trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      let tipo = 'general';
      if (file.fieldname === 'fotos_interior') tipo = 'interior';
      else if (file.fieldname === 'fotos_exterior') tipo = 'exterior';
      else if (file.fieldname === 'fotos') tipo = 'pieza';

      cb(null, `${cleanCodigo}-${tipo}-${timestamp}${ext}`);
    }
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

const uploadFields = upload.fields([
  { name: 'log_books_file', maxCount: 1 },
  { name: 'damage_history_file', maxCount: 1 },
  { name: 'fotos_interior', maxCount: 10 },
  { name: 'fotos_exterior', maxCount: 10 },
  { name: 'fotos', maxCount: 10 },
  { name: 'imagen', maxCount: 1 }
]);

// Rutas Públicas (Catálogo y Solicitudes)
router.get('/', salesController.showPublicCatalog);
router.get('/sales', salesController.showPublicCatalog);
router.get('/detalle/:id', salesController.getAircraftDetail);
router.post('/vender-aeronave', uploadFields, salesController.createAircraft);
router.post('/vender-pieza', uploadFields, salesController.createPart);

// Rutas Administrativas (Gestión de Inventario)
router.get('/admin/inventario', salesController.showAdminInventory);
router.post('/admin/inventario', uploadFields, salesController.createAdminItem);
router.post('/admin/inventario/guardar', uploadFields, salesController.createAdminItem);
router.post('/admin/inventario/:id/edit', uploadFields, salesController.updateAircraft);
router.post('/admin/inventario/:id/precio_publico', express.json(), express.urlencoded({ extended: true }), salesController.updatePrecioPublico);
router.post('/admin/inventario/:id/status', express.json(), express.urlencoded({ extended: true }), salesController.updateStatus);
router.post('/admin/inventario/:id/delete', express.json(), express.urlencoded({ extended: true }), salesController.deleteAircraft);

module.exports = router;


