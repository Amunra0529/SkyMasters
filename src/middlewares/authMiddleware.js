/**
 * ===================================================
 * Middleware de Autenticación y Control de Acceso
 * Responsable: Jhon (Autenticación y Seguridad)
 * ===================================================
 */

/**
 * Middleware para proteger rutas que requieren inicio de sesión activo
 */
const requireAuth = (req, res, next) => {
  // Verifica si existe la sesión de usuario autenticado
  if (req.session && req.session.user) {
    return next();
  }

  // Redirige al login si no está autenticado
  return res.redirect('/auth/login?error=unauthorized');
};

/**
 * Middleware para verificar si el usuario tiene rol de Administrador
 */
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }

  return res.status(403).render('admin/login', {
    title: 'Acceso Denegado',
    error: 'No tienes permisos de administrador para acceder a este recurso.'
  });
};

module.exports = {
  requireAuth,
  requireAdmin
};
