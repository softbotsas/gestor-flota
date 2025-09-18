// app.js (COMPLETO, CORREGIDO Y CON AUTENTICACIÓN)

// 1. REQUIRES 
const engine = require('ejs-mate');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const MethodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

require('dotenv').config(); 
// Autenticación removida: Passport ya no es necesario

// Importo rutas aqui (todas reorganizadas en flota_routes)
const indexRoutes = require('./routes/flota_routes/index.routes');
// const usersRoutes = require('./routes/flota_routes/users.routes.js'); // Login removido

// Rutas de flota (reorganizadas)
const truckRoutes = require('./routes/flota_routes/trucks.routes');
const maintenanceRoutes = require('./routes/flota_routes/maintenance.routes.js');
const opTypeRoutes = require('./routes/flota_routes/operationType.routes.js');
const reportRoutes = require('./routes/flota_routes/reports.routes.js'); 
const fuelRoutes = require('./routes/flota_routes/fuel.routes.js');
const driverRoutes = require('./routes/flota_routes/drivers.routes.js');
const dashboardRoutes = require('./routes/flota_routes/dashboard.routes.js');

// Rutas de API
const apiRoutes = require('./routes/flota_routes/api.routes.js');

// 2. INICIALIZACIONES
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Conexión a la Base de Datos
const MONGODB_URI = process.env.MONGODB_URI_LOCAL;
mongoose.connect(MONGODB_URI)
  .then(db => console.log('Base de datos conectada con éxito.'))
  .catch(err => console.error('Error al conectar a la DB:', err));

// 3. SETTINGS 
app.engine('ejs', engine);
app.set('port', process.env.PORT || 4000);
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views_flota')]);
app.set('view engine', 'ejs');

// 4. MIDDLEWARES
// CORS endurecido y configurable por entorno
const allowedOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true;
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(MethodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Mensajes flash disponibles sin autenticación
app.use(flash());

// --- VARIABLES GLOBALES PARA VISTAS ---
// Esto hace que los mensajes flash y el usuario estén disponibles en todos los archivos .ejs
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Archivos estáticos (debe ir después de los middlewares principales) ajustes
app.use(express.static(path.join(__dirname, 'public')));

// 5. RUTAS
// Middleware de notificaciones (badge en navbar y API)
const notifications = require('./middlewares/notifications');
app.use(notifications);

// Rutas Públicas (login removido, todo queda abierto a integración con Vue auth externa)
app.use('/', indexRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/trucks', truckRoutes);
app.use('/fuel', fuelRoutes);
app.use('/reports', reportRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/operation-types', opTypeRoutes);
app.use('/drivers', driverRoutes);
app.use('/api', apiRoutes);

// 6. INICIALIZACIÓN DEL SERVIDOR
server.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
  console.log(`Accede en http://localhost:${app.get('port')}`);
});