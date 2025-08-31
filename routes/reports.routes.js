// routes/reports.routes.js
const { Router } = require('express');
const router = Router();

const { renderMaintenanceReport } = require('../controllers/reports.controller');

// Ruta para la página principal de mantenimientos/reportes
router.get('/maintenance', renderMaintenanceReport);

module.exports = router;