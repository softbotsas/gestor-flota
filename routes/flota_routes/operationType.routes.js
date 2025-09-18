// routes/operationType.routes.js
const { Router } = require('express');
const router = Router();

const { createOperationType } = require('../../controllers/flota_controllers/operationType.controller');

// Esta ruta manejará la petición AJAX para crear un nuevo tipo
router.post('/add', createOperationType);

module.exports = router;