/**
 * ===================================================
 * Rutas: authRoutes
 * Responsable Asignado: Jhon
 * Módulos: Autenticación, Login, Logout y Configuración
 * ===================================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de inicio y cierre de sesión
router.get('/login', authController.showLoginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Rutas de configuración y respaldos (Portal Admin)
router.get('/configuracion', authController.showConfiguration);
router.post('/configuracion/backup', authController.backupDatabase);

module.exports = router;
