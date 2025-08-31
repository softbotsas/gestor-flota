// routes/fuel.routes.js
const { Router } = require('express');
const router = Router();
const upload = require('../libs/storage'); // Reutilizamos la configuración de multer

const { 
  renderFuelPage,
  createFuelRecord,
  updateFuelRecord,
  deleteFuelRecord
} = require('../controllers/fuel.controller');

// Ruta principal para mostrar la página de combustible
router.get('/', renderFuelPage);

// Ruta para procesar el formulario de una nueva recarga
router.post('/add', upload, createFuelRecord);

// Ruta para actualizar un registro existente
router.put('/update/:id', upload, updateFuelRecord);

// Ruta para el borrado suave de un registro
router.delete('/delete/:id', deleteFuelRecord);

module.exports = router;