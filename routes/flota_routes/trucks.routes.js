// routes/trucks.routes.js (CORREGIDO)

const { Router } = require('express');
const router = Router();

const { 
  renderTrucksPage, 
  createTruck,
  renderTruckDetails,
  updateTruck,      // <-- AHORA SÍ ESTÁ IMPORTADO
  deleteTruck       // <-- AHORA SÍ ESTÁ IMPORTADO
} = require('../../controllers/flota_controllers/truck.controller');

// Soporte de subida de documentos del camión
const { uploadFields } = require('../../libs/storage');


// --- Rutas que ya tenías ---
router.get('/', renderTrucksPage);
router.post('/add', createTruck);
router.get('/:id', renderTruckDetails);

// --- Nuevas rutas ---
// Ahora, cuando se use 'updateTruck' y 'deleteTruck', ya no serán 'undefined'.
// Permite actualizar ficha y, opcionalmente, adjuntar documentos (tarjeta/calcomanía)
router.put('/update/:id', uploadFields([
  { name: 'circulationCard', maxCount: 1 },
  { name: 'yearSticker', maxCount: 1 }
]), updateTruck);
router.delete('/delete/:id', deleteTruck);

module.exports = router;