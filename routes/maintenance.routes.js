// routes/maintenance.routes.js

const { Router } = require('express');
const router = Router();
const upload = require('../libs/storage');
const { 
  createMaintenance,
  updateMaintenance, // <-- Nos aseguramos de que se importa
  deleteMaintenance 
} = require('../controllers/maintenance.controller');

// Ruta para añadir (POST)
router.post('/add/:truckId', upload, createMaintenance);

// ¡RUTA CLAVE! Ruta para actualizar (PUT)
// Debe escuchar en el método PUT para que method-override funcione.
router.put('/update/:id', upload, updateMaintenance);

// Ruta para eliminar (DELETE)
router.delete('/delete/:id', deleteMaintenance);

module.exports = router;