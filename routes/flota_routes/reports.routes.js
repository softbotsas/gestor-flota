// routes/reports.routes.js (VERSIÓN FINAL Y COMPLETA)
const { Router } = require('express');
const router = Router();

// ¡CORRECCIÓN CLAVE! Ahora importamos las CUATRO funciones que usamos en este archivo.
const { 
  renderReportsHub, 
  renderMaintenanceReport, 
  exportToExcel, 
  exportToPdf                // <-- La función que faltaba
} = require('../../controllers/flota_controllers/reports.controller');

// RUTA 1: La página principal del "Centro de Reportes"
router.get('/', renderReportsHub);

// RUTA 2: La sub-página del "Historial y Agenda de Mantenimientos"
router.get('/maintenance', renderMaintenanceReport);

// RUTAS DE EXPORTACIÓN: Ahora ambas funciones están correctamente definidas.
router.get('/export/excel', exportToExcel);
router.get('/export/pdf', exportToPdf);

module.exports = router;