/**
 * ===================================================
 * Controlador: authController
 * Responsable Asignado: Jhon
 * Tareas:
 *  - Login y autenticación de administradores
 *  - Cierre de sesión (Logout)
 *  - Configuración del sistema (Respaldo BD y gestión de usuarios administradores)
 * ===================================================
 */

const User = require('../models/User');

// [Jhon] Renderizar formulario de login administrativo
const showLoginForm = async (req, res, next) => {
  try {
    // Si ya está autenticado, redirigir al dashboard
    if (req.session && req.session.user) {
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { 
      title: 'Iniciar Sesión | SkyMaster Admin', 
      error: req.query.error || null 
    });
  } catch (error) {
    next(error);
  }
};

// [Jhon] Procesar inicio de sesión
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // TODO: [Jhon] Validar credenciales contra la BD con bcrypt
    // Placeholder de sesión para pruebas iniciales
    req.session.user = { id: 1, name: 'Administrador Demo', email: email || 'admin@skymaster.com', role: 'admin' };
    return res.redirect('/admin/dashboard');
  } catch (error) {
    next(error);
  }
};

// [Jhon] Cerrar sesión
const logout = async (req, res, next) => {
  try {
    // TODO: [Jhon] Destruir la sesión activa
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  } catch (error) {
    next(error);
  }
};

// [Jhon] Mostrar panel de configuración y respaldos (Portal Admin)
const showConfiguration = async (req, res, next) => {
  try {
    // TODO: [Jhon] Obtener lista de administradores y estado del respaldo
    res.render('admin/configuracion', {
      title: 'Configuración y Respaldos | SkyMaster Admin',
      admins: []
    });
  } catch (error) {
    next(error);
  }
};

// [Jhon] Generar respaldo de la base de datos
const backupDatabase = async (req, res, next) => {
  try {
    // TODO: [Jhon] Implementar lógica de volcado SQL (mysqldump / export)
    res.json({ success: true, message: 'Respaldo generado con éxito (Placeholder)' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showLoginForm,
  login,
  logout,
  showConfiguration,
  backupDatabase
};
