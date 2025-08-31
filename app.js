// app.js (VERSIÓN FINAL Y CORREGIDA)

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

require('dotenv').config(); 

// Importo rutas aqui
const indexRoutes = require('./routes/index.routes');
const truckRoutes = require('./routes/trucks.routes');
const maintenanceRoutes = require('./routes/maintenance.routes.js');
const opTypeRoutes = require('./routes/operationType.routes.js');

// 2. INICIALIZACIONES
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

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

// ===================================================================
// ================ ¡CORRECCIÓN CLAVE APLICADA AQUÍ! =================
// ===================================================================
// Usamos la forma de función de MethodOverride para máxima compatibilidad.
// Le decimos a MethodOverride que busque '_method' en la URL (query string).
app.use(MethodOverride('_method'));

// Configuración de la Sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI })
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 5. RUTAS
app.use('/', indexRoutes);
app.use('/trucks', truckRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/operation-types', opTypeRoutes);

// 6. INICIALIZACIÓN DEL SERVIDOR
server.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
  console.log(`Accede en http://localhost:${app.get('port')}`);
});