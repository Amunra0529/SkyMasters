# ✈️ SkyMaster - Sistema Web Corporativo de Aviación & Charters

Sistema integral de gestión para aviación ejecutiva, venta de aeronaves, operaciones de vuelos charter y bolsa de talento aeronáutico, estructurado bajo el patrón **Modelo-Vista-Controlador (MVC)** con **Node.js**, **Express**, **EJS** y base de datos **MySQL**, preparado para su posterior despliegue en **Hostinger**.

---

## 👥 1. Asignación de Roles y Responsabilidades del Equipo

Para permitir un desarrollo paralelo y colaborativo sin conflictos de fusión (*merge conflicts*), cada integrante del equipo tiene asignados archivos y módulos específicos:

| Integrante | Rol / Módulo | Rutas (`/src/routes`) | Controlador (`/src/controllers`) | Modelo (`/src/models`) | Vistas (`/views`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Jean** | Líder de Proyecto / Landing | `src/app.js` (`/`) | Integrado en `app.js` | N/A | `views/index.ejs`, `views/partials/navbar.ejs`, `views/partials/footer.ejs` |
| **Jhon** | Autenticación, Seguridad & Configuración | `src/routes/authRoutes.js` | `src/controllers/authController.js` | `src/models/User.js` | `views/admin/login.ejs`, `views/admin/configuracion.ejs`, `src/middlewares/authMiddleware.js` |
| **Morao** | Venta de Naves & Inventario | `src/routes/salesRoutes.js` | `src/controllers/salesController.js` | `src/models/Aircraft.js` | `views/sales.ejs`, `views/admin/inventario.ejs` |
| **Jesus** | Alquiler & Operaciones Charters | `src/routes/charterRoutes.js` | `src/controllers/charterController.js` | `src/models/Charter.js` | `views/charters.ejs`, `views/admin/operaciones.ejs` |
| **Osuna** | Bolsa de Trabajo & Postulantes | `src/routes/careerRoutes.js` | `src/controllers/careerController.js` | `src/models/Candidate.js` | `views/careers.ejs`, `views/admin/candidatos.ejs` |
| **Cardona** | Información Institucional & Contacto | `src/app.js` (`/about`, `/contact`) | Integrado en `app.js` | N/A | `views/about.ejs`, `views/contact.ejs` |
| **Dionkel** | Dashboard de Control, Métricas & PDFs | `src/routes/adminRoutes.js` | `src/controllers/adminController.js` | N/A | `views/admin/dashboard.ejs` |

---

## 📂 2. Estructura de Archivos del Proyecto

```text
/SkyMaster
├── /src
│   ├── /config
│   │   └── db.js                       # Configuración y pool de conexión MySQL
│   ├── /controllers
│   │   ├── authController.js           # Jhon: Login y autenticación
│   │   ├── salesController.js          # Morao: Venta de naves e inventario
│   │   ├── charterController.js        # Jesus: Alquiler y operaciones charters
│   │   ├── careerController.js         # Osuna: Bolsa de trabajo y postulantes
│   │   └── adminController.js          # Dionkel: Dashboard de métricas y PDFs
│   ├── /models
│   │   ├── User.js                     # Jhon: Modelo de usuarios y administradores
│   │   ├── Aircraft.js                 # Morao: Modelo de aeronaves y piezas
│   │   ├── Charter.js                  # Jesus: Modelo de vuelos charter
│   │   └── Candidate.js                # Osuna: Modelo de candidatos a vacantes
│   ├── /routes
│   │   ├── authRoutes.js               # Jhon: Rutas de autenticación
│   │   ├── salesRoutes.js              # Morao: Rutas de catálogo e inventario
│   │   ├── charterRoutes.js            # Jesus: Rutas de charter y operaciones
│   │   ├── careerRoutes.js             # Osuna: Rutas de bolsa de trabajo
│   │   └── adminRoutes.js              # Dionkel: Rutas del panel y reportes PDF
│   ├── /middlewares
│   │   └── authMiddleware.js           # Protección de rutas administrativas
│   └── app.js                          # Servidor principal Express y montaje de rutas
│
├── /public
│   ├── /css
│   │   └── styles.css                  # Hoja de estilos global y responsiva
│   ├── /js
│   │   └── main.js                     # Scripts del lado del cliente
│   ├── /uploads                        # Almacenamiento de archivos (CVs, PDFs)
│   └── /img                            # Imágenes corporativas y de flota
│
├── /views
│   ├── /partials
│   │   ├── navbar.ejs                  # Barra de navegación (Jean)
│   │   └── footer.ejs                  # Pie de página corporativo (Jean)
│   ├── index.ejs                       # Landing page / Home (Jean)
│   ├── sales.ejs                       # Catálogo de aeronaves en venta (Morao)
│   ├── charters.ejs                    # Cotizador de vuelos charter (Jesus)
│   ├── careers.ejs                     # Bolsa de trabajo y postulación (Osuna)
│   ├── about.ejs                       # Nosotros y certificaciones (Cardona)
│   ├── contact.ejs                     # Contacto y bases operativas (Cardona)
│   └── /admin
│       ├── login.ejs                   # Portal de login de administradores (Jhon)
│       ├── dashboard.ejs               # Dashboard con KPIs y reportes PDF (Dionkel)
│       ├── inventario.ejs              # Gestión de inventario (Morao)
│       ├── operaciones.ejs             # Gestión de vuelos charters (Jesus)
│       ├── candidatos.ejs              # Auditoría de postulantes (Osuna)
│       └── configuracion.ejs           # Respaldos y administradores (Jhon)
│
├── .env.example                        # Plantilla de variables de entorno
├── .gitignore                          # Exclusión de node_modules y .env
├── package.json                        # Dependencias y scripts de Node.js
└── README.md                           # Guía de contribución para el equipo
```

---

## 🚀 3. Instrucciones de Instalación y Ejecución Local

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/SkyMaster.git
cd SkyMaster
```

### Paso 2: Instalar las dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno
Crea tu archivo `.env` a partir de `.env.example`:
```bash
cp .env.example .env
```
Edita `.env` con los datos de tu base de datos local:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=skymaster_db
DB_PORT=3306
SESSION_SECRET=mi_clave_secreta_local
```

### Paso 4: Iniciar el servidor
- En modo desarrollo (con recarga automática):
  ```bash
  npm run dev
  ```
- En modo estándar:
  ```bash
  npm start
  ```

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## 🌿 4. Guía de Contribución y Flujo de Git

Para evitar conflictos al trabajar simultáneamente:
1. **Nunca trabajes directamente sobre la rama `main`**.
2. Cada desarrollador debe crear una rama con su nombre o módulo:
   ```bash
   git checkout -b feature/morao-ventas
   git checkout -b feature/jesus-charters
   git checkout -b feature/osuna-postulantes
   git checkout -b feature/jhon-auth
   git checkout -b feature/dionkel-dashboard
   git checkout -b feature/cardona-about-contact
   ```
3. Trabaja únicamente en los archivos que te fueron asignados.
4. Antes de enviar cambios, actualiza tu rama con `main`:
   ```bash
   git pull origin main
   ```
5. Realiza tus commits con mensajes claros:
   ```bash
   git add .
   git commit -m "feat(ventas): implementa consulta de aeronaves en salesController"
   git push origin feature/morao-ventas
   ```
6. Abre un **Pull Request (PR)** para que el Líder de Proyecto (**Jean**) lo revise e integre a `main`.

---

## 🌐 5. Despliegue en Hostinger (Guía Paso a Paso)

El backend de SkyMaster está 100% preparado para servidores de Hostinger (cPanel / hPanel):

1. **Crear la Base de Datos MySQL en Hostinger**:
   - Entra a tu panel de Hostinger &rarr; **Bases de datos MySQL**.
   - Crea una base de datos (ej. `u123456_skymaster`) y un usuario con permisos totales.
2. **Configurar Node.js Selector**:
   - Ve a **Avanzado** &rarr; **Node.js** (o Administrador de Aplicaciones Node.js).
   - Versión de Node: Selecciona **v20.x o superior**.
   - Modo de Aplicación: **Production**.
   - Raíz de la Aplicación: `/public_html` o la carpeta asignada.
   - Archivo de Inicio de la Aplicación: `src/app.js`.
3. **Subir los Archivos**:
   - Sube todos los archivos del proyecto (excepto la carpeta `node_modules` y tu `.env` local).
   - En el panel de Hostinger, pulsa el botón **"Instalar dependencias"** (o ejecuta `npm install` vía terminal SSH).
4. **Configurar el `.env` de Producción**:
   - Crea un archivo `.env` en la raíz de Hostinger con las credenciales exactas de la base de datos de Hostinger (`DB_HOST=localhost`, `DB_USER=u123456_user`, `DB_PASSWORD=...`, `DB_NAME=u123456_skymaster`).
5. **Iniciar / Reiniciar la Aplicación**:
   - Pulsa **"Restart Application"** en el selector de Node.js.
   - ¡Tu sistema SkyMaster estará en línea!
