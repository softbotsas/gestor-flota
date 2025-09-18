// routes/dashboard.routes.js (NUEVO ARCHIVO)
const { Router } = require('express');
const router = Router();
const { renderDashboard } = require('../../controllers/dashboard.controller');

// Esta ruta ya está protegida por 'isAuthenticated' en app.js
router.get('/', renderDashboard);

module.exports = router;