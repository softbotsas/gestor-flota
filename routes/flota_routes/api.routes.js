// routes/api.routes.js (VERSIÓN FINAL Y COMPLETA)
const { Router } = require('express');
const router = Router();

// --- Importación desde el Controlador de la API ---
// Aquí importamos las funciones que solo LEEN datos.
const { 
  getActiveNotifications, 
  getNotificationCount, 
  getMaintenanceDetails,
  getTrucks,
  getOperationTypes,
  getMonthlyExpensesChartData 
} = require('../../controllers/api.controller');

// --- Importación desde el Controlador de Tipos de Operación ---
// Aquí importamos la función que CREA datos.
const { createOperationType } = require('../../controllers/flota_controllers/operationType.controller');


// === Rutas de LECTURA (GET) ===
router.get('/notifications', getActiveNotifications);
router.get('/notifications/count', getNotificationCount);
router.get('/maintenance/:id', getMaintenanceDetails);
router.get('/trucks', getTrucks);
router.get('/operation-types', getOperationTypes);

// ¡NUEVA RUTA! Para obtener los datos del gráfico del dashboard
router.get('/charts/monthly-expenses', getMonthlyExpensesChartData);

// =======================================================
// ============= ¡RUTA QUE FALTABA AÑADIDA AQUÍ! =========
// =======================================================
// === Ruta de ESCRITURA (POST) ===
// Cuando el frontend envíe datos para crear un nuevo tipo, esta ruta se activará.
router.post('/operation-types/add', createOperationType);

module.exports = router;