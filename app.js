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
const passport = require('passport'); // <-- NUEVO
const flash = require('connect-flash');   // <-- NUEVO

require('dotenv').config(); 
require('./config/passport'); // <-- NUEVO: Inicializa la configuración de Passport

// Importo rutas aqui
const indexRoutes = require('./routes/index.routes');
const usersRoutes = require('./routes/users.routes.js'); // <-- NUEVO
const truckRoutes = require('./routes/trucks.routes');
const maintenanceRoutes = require('./routes/maintenance.routes.js');
const opTypeRoutes = require('./routes/operationType.routes.js');
const reportRoutes = require('./routes/reports.routes.js'); 
const fuelRoutes = require('./routes/fuel.routes.js');
const apiRoutes = require('./routes/api.routes.js'); 

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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 4. MIDDLEWARES
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(MethodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 día de sesión
}));

// --- INICIALIZACIÓN DE PASSPORT (ORDEN CRÍTICO) ---
app.use(passport.initialize());
app.use(passport.session());
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

// Archivos estáticos (debe ir después de los middlewares principales)
app.use(express.static(path.join(__dirname, 'public')));

// 5. RUTAS
// Importamos el helper de autenticación
const { isAuthenticated } = require('./helpers/auth');

// Rutas Públicas (Cualquiera puede acceder)
app.use('/', indexRoutes); // Splash screen
app.use('/users', usersRoutes);   // Login y Logout

// Rutas Protegidas (Solo usuarios logueados pueden acceder)
app.use('/dashboard', isAuthenticated, require('./routes/dashboard.routes')); // Asumiendo que tendrás un dashboard.routes.js
app.use('/trucks', isAuthenticated, truckRoutes);
app.use('/fuel', isAuthenticated, fuelRoutes);
app.use('/reports', isAuthenticated, reportRoutes);
app.use('/maintenance', isAuthenticated, maintenanceRoutes);
app.use('/operation-types', isAuthenticated, opTypeRoutes);
app.use('/api', isAuthenticated, apiRoutes); 

// 6. INICIALIZACIÓN DEL SERVIDOR
server.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
  console.log(`Accede en http://localhost:${app.get('port')}`);
});