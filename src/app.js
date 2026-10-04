/**
 * ==============================================================================
 * SKYMASTER - SISTEMA CORPORATIVO DE AVIACIÓN Y VUELOS CHARTER
 * Servidor Principal de Express (Backend MVC)
 * Compatible con Despliegue en Hostinger (Node.js Selector)
 * ==============================================================================
 */

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
require('dotenv').config();

const { testConnection } = require('./config/db');

// Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// ==============================================================================
// 1. CONFIGURACIÓN DEL MOTOR DE PLANTILLAS Y ARCHIVOS ESTÁTICOS
// ==============================================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Servir archivos estáticos (CSS, JS, Imágenes, Uploads)
app.use(express.static(path.join(__dirname, '../public')));

// ==============================================================================
// 2. MIDDLEWARES GLOBALES
// ==============================================================================
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'skymaster_secret_dev_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
  })
);

// Middleware para variables globales en vistas EJS
app.use((req, res, next) => {
  res.locals.currentUser = req.session ? req.session.user : null;
  res.locals.currentPath = req.path;
  next();
});

// ==============================================================================
// 3. IMPORTACIÓN DE RUTAS POR INTEGRANTE
// ==============================================================================
const authRoutes = require('./routes/authRoutes');       // Jhon: Login y autenticación
const salesRoutes = require('./routes/salesRoutes');     // Morao: Venta de naves e inventario
const charterRoutes = require('./routes/charterRoutes'); // Jesus: Alquiler y operaciones charters
const careerRoutes = require('./routes/careerRoutes');   // Osuna: Bolsa de trabajo y postulantes
const adminRoutes = require('./routes/adminRoutes');     // Dionkel: Dashboard de métricas y PDFs

// ==============================================================================
// 4. REGISTRO DE RUTAS
// ==============================================================================

// Rutas Públicas Principales
// Jean (Líder) - Landing Page / Home
app.get('/', (req, res) => {
  res.render('index', {
    title: 'SkyMaster | Aviación Ejecutiva & Vuelos Charter Privados'
  });
});

// Cardona - About Us (Nosotros)
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'Sobre Nosotros & Historia | SkyMaster Aviation'
  });
});

// Cardona - Contact Us (Contacto)
app.get('/contact', (req, res) => {
  const success = req.query.success === '1';
  res.render('contact', {
    title: 'Contacto & Hangares | SkyMaster Aviation',
    successMessage: success ? '¡Gracias por contactarnos! Tu mensaje ha sido enviado exitosamente. Un asesor ejecutivo de SkyMaster se pondrá en contacto a la brevedad.' : null
  });
});

// Cardona - Procesamiento de Formulario de Contacto
app.post('/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  console.log(`📩 [Contacto - Cardona] Solicitud recibida:`, { name, email, phone, subject, message });
  res.redirect('/contact?success=1');
});

// Acceso directo a login
app.get('/login', (req, res) => res.redirect('/auth/login'));

// Módulos por Integrante
app.use('/auth', authRoutes);       // Jhon
app.use('/sales', salesRoutes);     // Morao
app.use('/charters', charterRoutes);// Jesus
app.use('/careers', careerRoutes);   // Osuna
app.use('/admin', adminRoutes);     // Dionkel

// ==============================================================================
// 5. MANEJO DE ERRORES (404 Y 500)
// ==============================================================================
// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).render('index', {
    title: 'Página No Encontrada (404) | SkyMaster',
    errorMessage: 'La ruta solicitada no existe o se encuentra en mantenimiento.'
  });
});

// Manejador global de excepciones (500)
app.use((err, req, res, next) => {
  console.error('❌ Error no controlado en la aplicación:', err.stack);
  res.status(500).send('Ocurrió un error interno en el servidor de SkyMaster.');
});

// ==============================================================================
// 6. INICIO DEL SERVIDOR
// ==============================================================================
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 SkyMaster Aviation System - Servidor Iniciado`);
  console.log(`📡 URL Local: http://localhost:${PORT}`);
  console.log(`⚙️  Entorno:   ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
  // Verificar conexión a base de datos de manera asíncrona
  await testConnection();
});

module.exports = app;
