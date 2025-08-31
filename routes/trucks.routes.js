// routes/trucks.routes.js (CORREGIDO)

const { Router } = require('express');
const router = Router();

const { 
  renderTrucksPage, 
  createTruck,
  renderTruckDetails,
  updateTruck,      // <-- AHORA SÍ ESTÁ IMPORTADO
  deleteTruck       // <-- AHORA SÍ ESTÁ IMPORTADO
} = require('../controllers/truck.controller');


// --- Rutas que ya tenías ---
router.get('/', renderTrucksPage);
router.post('/add', createTruck);
router.get('/:id', renderTruckDetails);

// --- Nuevas rutas ---
// Ahora, cuando se use 'updateTruck' y 'deleteTruck', ya no serán 'undefined'.
router.put('/update/:id', updateTruck);
router.delete('/delete/:id', deleteTruck);

module.exports = router;