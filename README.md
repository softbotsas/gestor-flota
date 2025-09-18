# 🚛 Sistema de Gestión de Flota de Camiones

## 📋 Descripción General

Sistema completo de gestión de flota vehicular desarrollado en Node.js con Express, MongoDB y EJS. Diseñado para la administración integral de camiones, conductores, mantenimientos, combustible y reportes, con estructura optimizada para integración con Vue.js.

## 🏗️ Arquitectura del Sistema

### **Tecnologías Utilizadas**
- **Backend**: Node.js + Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Motor de Vistas**: EJS con EJS-Mate
- **Autenticación**: Passport.js (configurado pero no activo)
- **Subida de Archivos**: Multer
- **Reportes**: PDFMake + XLSX
- **Gráficos**: Chart.js
- **Estilos**: Bootstrap 5 + Font Awesome

### **Estructura del Proyecto**

```
sistemacamiones/
├── 📁 models/
│   └── flota_models/              # Modelos de datos
│       ├── Driver.js              # Conductores
│       ├── Fuel.js                # Registros de combustible
│       ├── Maintenance.js         # Mantenimientos
│       ├── OperationType.js       # Tipos de operación
│       ├── Truck.js               # Camiones
│       └── User.js                # Usuarios
├── 📁 controllers/
│   ├── flota_controllers/         # Controladores de flota
│   │   ├── driver.controller.js
│   │   ├── fuel.controller.js
│   │   ├── maintenance.controller.js
│   │   ├── operationType.controller.js
│   │   ├── reports.controller.js
│   │   └── truck.controller.js
│   ├── api.controller.js          # API REST
│   └── dashboard.controller.js    # Dashboard principal
├── 📁 routes/
│   └── flota_routes/              # Rutas del sistema
│       ├── api.routes.js
│       ├── dashboard.routes.js
│       ├── drivers.routes.js
│       ├── fuel.routes.js
│       ├── index.routes.js
│       ├── maintenance.routes.js
│       ├── operationType.routes.js
│       ├── reports.routes.js
│       ├── trucks.routes.js
│       └── users.routes.js
├── 📁 views_flota/                # Vistas del sistema
│   ├── layouts/                   # Plantillas base
│   ├── partials/                  # Componentes reutilizables
│   ├── users/                     # Vistas de conductores
│   ├── trucks/                    # Vistas de camiones
│   ├── fuel/                      # Vistas de combustible
│   ├── reports/                   # Vistas de reportes
│   ├── dashboard.ejs
│   ├── index.ejs
│   └── splash.ejs
├── 📁 public/                     # Archivos estáticos
├── 📁 uploads/                    # Archivos subidos
├── 📁 libs/                       # Utilidades
├── 📁 middlewares/                # Middlewares personalizados
├── 📁 config/                     # Configuraciones
└── 📄 app.js                      # Archivo principal
```

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### **Instalación**

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd sistemacamiones
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env` en la raíz del proyecto:
```env
MONGODB_URI_LOCAL=mongodb://localhost:27017/sistemacamiones
MONGODB_URI_ATLAS=mongodb+srv://usuario:password@cluster.mongodb.net/sistemacamiones
SESSION_SECRET=tu_secreto_super_seguro
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

4. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

5. **Crear usuario inicial**
```bash
npm run seed:user
```

## 📊 Funcionalidades del Sistema

### **1. Gestión de Camiones** 🚛
- **CRUD completo** de camiones
- **Información detallada**: placa, marca, modelo, año, alias
- **Documentos**: tarjeta de circulación, sticker anual
- **Estados**: activo/inactivo
- **Historial de mantenimientos** por camión
- **Subida de archivos** (imágenes/PDFs)

### **2. Gestión de Conductores** 👨‍💼
- **Información personal**: nombre, teléfono, email, fecha nacimiento
- **Información laboral**: licencia, DPI, cargo
- **Contacto de emergencia**: nombre, teléfono, parentesco
- **Dirección completa**: calle, ciudad, departamento, código postal
- **Información médica**: alergias, medicamentos, notas médicas
- **Documentos**: licencia de conducir, DPI (imágenes/PDFs)
- **Estados**: activo, vacaciones, suspendido, inactivo

### **3. Registro de Combustible** ⛽
- **Registro detallado**: fecha, kilometraje, cantidad, precio
- **Múltiples unidades**: litros/galones
- **Múltiples monedas**: GTQ/USD
- **Asignación de conductor** por recarga
- **Recibo obligatorio** (imagen/PDF)
- **Historial completo** de recargas

### **4. Gestión de Mantenimientos** 🔧
- **Servicios programados** y completados
- **Múltiples ítems** por servicio
- **Información del mecánico**
- **Asignación de conductor**
- **Cálculo automático** de costos totales
- **Recordatorios** configurables
- **Múltiples monedas**: GTQ/USD
- **Documentos de respaldo**

### **5. Sistema de Reportes** 📈
- **Dashboard interactivo** con KPIs
- **Reportes de mantenimiento** con filtros avanzados
- **Reportes de combustible** detallados
- **Exportación a PDF** profesional
- **Exportación a Excel** con múltiples hojas
- **Gráficos dinámicos** de gastos mensuales
- **Filtros por**: fechas, camiones, tipos, conductores

### **6. API REST** 🔌
- **Endpoints completos** para todas las entidades
- **Notificaciones** en tiempo real
- **Datos para gráficos** del dashboard
- **Integración lista** para Vue.js
- **Respuestas JSON** estandarizadas

## 🛠️ API Endpoints

### **Camiones**
```
GET    /api/trucks              # Listar camiones activos
GET    /trucks                  # Vista de camiones
GET    /trucks/:id              # Detalles de camión
POST   /trucks/add              # Crear camión
PUT    /trucks/:id              # Actualizar camión
DELETE /trucks/:id              # Eliminar camión
```

### **Conductores**
```
GET    /drivers                 # Listar conductores
GET    /drivers/:id             # Detalles de conductor
GET    /drivers/new             # Formulario nuevo conductor
POST   /drivers/new             # Crear conductor
GET    /drivers/:id/edit        # Formulario editar conductor
PUT    /drivers/:id             # Actualizar conductor
DELETE /drivers/:id             # Eliminar conductor
```

### **Combustible**
```
GET    /fuel                    # Listar registros de combustible
POST   /fuel/add                # Crear registro
PUT    /fuel/update/:id         # Actualizar registro
DELETE /fuel/delete/:id         # Eliminar registro
```

### **Mantenimientos**
```
POST   /maintenance/add/:truckId    # Crear mantenimiento
PUT    /maintenance/update/:id      # Actualizar mantenimiento
DELETE /maintenance/delete/:id      # Eliminar mantenimiento
```

### **Reportes**
```
GET    /reports                 # Hub de reportes
GET    /reports/maintenance     # Reporte de mantenimientos
GET    /reports/export/excel    # Exportar a Excel
GET    /reports/export/pdf      # Exportar a PDF
```

### **API REST**
```
GET    /api/notifications       # Notificaciones activas
GET    /api/notifications/count # Contador de notificaciones
GET    /api/trucks              # Lista de camiones (JSON)
GET    /api/operation-types     # Tipos de operación (JSON)
GET    /api/charts/monthly-expenses # Datos para gráficos
```

## 📊 Modelos de Datos

### **Truck (Camión)**
```javascript
{
  placa: String,           // Placa única
  marca: String,           // Marca del vehículo
  modelo: String,          // Modelo del vehículo
  año: Number,             // Año de fabricación
  alias: String,           // Apodo identificativo
  documents: {             // Documentos
    circulationCard: String,
    yearSticker: String
  },
  status: String,          // 'Activo' | 'Inactivo'
  createdAt: Date,
  updatedAt: Date
}
```

### **Driver (Conductor)**
```javascript
{
  name: String,            // Nombre completo
  phone: String,           // Teléfono
  email: String,           // Email
  birthDate: Date,         // Fecha de nacimiento
  bloodType: String,       // Tipo de sangre
  emergencyContact: {      // Contacto de emergencia
    name: String,
    phone: String,
    relationship: String
  },
  address: {               // Dirección
    street: String,
    city: String,
    department: String,
    postalCode: String
  },
  license: String,         // Número de licencia
  licenseExpiry: Date,     // Vencimiento de licencia
  position: String,        // Cargo
  dpi: String,             // Número de DPI
  licenseFile: String,     // Archivo de licencia
  dpiFile: String,         // Archivo de DPI
  medicalInfo: {           // Información médica
    allergies: [String],
    medications: [{
      name: String,
      dosage: String
    }],
    medicalNotes: String
  },
  isActive: Boolean,       // Estado activo
  status: String,          // 'activo' | 'vacaciones' | 'suspendido' | 'inactivo'
  createdAt: Date,
  updatedAt: Date
}
```

### **Fuel (Combustible)**
```javascript
{
  truck: ObjectId,         // Referencia al camión
  driver: ObjectId,        // Referencia al conductor
  date: Date,              // Fecha de recarga
  mileage: Number,         // Kilometraje
  quantity: Number,        // Cantidad
  unit: String,            // 'Litros' | 'Galones'
  pricePerUnit: Number,    // Precio por unidad
  cost: Number,            // Costo total
  currency: String,        // 'USD' | 'GTQ'
  receiptImage: String,    // Imagen del recibo
  isActive: Boolean,       // Estado activo
  createdAt: Date,
  updatedAt: Date
}
```

### **Maintenance (Mantenimiento)**
```javascript
{
  truck: ObjectId,         // Referencia al camión
  driver: ObjectId,        // Referencia al conductor
  eventName: String,       // Nombre del servicio
  mechanicName: String,    // Nombre del mecánico
  date: Date,              // Fecha del servicio
  mileage: Number,         // Kilometraje
  totalCost: Number,       // Costo total
  currency: String,        // 'USD' | 'GTQ'
  serviceItems: [{         // Ítems del servicio
    type: String,
    brand: String,
    cost: Number,
    details: String
  }],
  receiptImage: String,    // Imagen del recibo
  nextServiceDate: Date,   // Próximo servicio
  reminderDays: Number,    // Días de recordatorio
  isCompleted: Boolean,    // Servicio completado
  isActive: Boolean,       // Estado activo
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Características de la Interfaz

### **Dashboard Principal**
- **KPIs en tiempo real**: camiones activos, gastos mensuales
- **Agenda de servicios**: próximos 5 mantenimientos
- **Gráficos interactivos**: gastos mensuales últimos 6 meses
- **Notificaciones**: alertas de servicios próximos

### **Diseño Responsivo**
- **Bootstrap 5** para diseño responsive
- **Font Awesome** para iconografía
- **Tema profesional** con colores corporativos
- **Navegación intuitiva** con menú lateral

### **Funcionalidades Avanzadas**
- **Búsqueda y filtros** en todas las secciones
- **Paginación** para listas largas
- **Subida de archivos** con validación
- **Validación de formularios** en tiempo real
- **Mensajes de confirmación** y error

## 🔧 Scripts Disponibles

```bash
npm start              # Iniciar servidor en producción
npm run dev            # Iniciar servidor en desarrollo (nodemon)
npm run seed:user      # Crear usuario inicial
npm test               # Ejecutar pruebas (configurado pero vacío)
```

## 🌐 Configuración para Producción

### **Variables de Entorno Requeridas**
```env
NODE_ENV=production
MONGODB_URI_ATLAS=mongodb+srv://usuario:password@cluster.mongodb.net/sistemacamiones
SESSION_SECRET=secreto_super_seguro_produccion
PORT=4000
CORS_ORIGIN=https://tu-dominio.com
```

### **Consideraciones de Seguridad**
- Configurar HTTPS en producción
- Implementar rate limiting
- Configurar CORS apropiadamente
- Usar variables de entorno para secretos
- Implementar autenticación JWT para API

## 🚀 Integración con Vue.js

### **Estructura Preparada**
- **API REST completa** en `/api/*`
- **Separación clara** entre frontend y backend
- **Modelos organizados** en `*_flota` folders
- **CORS configurado** para integración

### **Endpoints para Vue**
```
GET /api/trucks              # Lista de camiones
GET /api/drivers             # Lista de conductores
GET /api/fuel                # Registros de combustible
GET /api/maintenance         # Mantenimientos
GET /api/reports             # Datos de reportes
```

## 📝 Notas de Desarrollo

### **Próximas Mejoras**
- [ ] Implementar autenticación JWT
- [ ] Agregar sistema de roles
- [ ] Implementar notificaciones push
- [ ] Agregar geolocalización
- [ ] Crear app móvil
- [ ] Integrar con sistemas de GPS

### **Mantenimiento**
- **Logs**: Revisar logs del servidor regularmente
- **Backup**: Configurar respaldos automáticos de MongoDB
- **Monitoreo**: Implementar monitoreo de rendimiento
- **Actualizaciones**: Mantener dependencias actualizadas

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: Septiembre 2025  
**Desarrollado por**: SoftBot  
**Desarrollado con ❤️ para la gestión eficiente de flotas vehiculares**
