// routes/trucks.routes.js
const { Router } = require('express');
const router = Router();

// Importamos los métodos del controlador
const { 
  renderTrucksPage, 
  createTruck,
  renderTruckDetails // <-- AÑADIMOS EL NUEVO MÉTODO
} = require('../controllers/truck.controller');

// Ruta para mostrar la página con el formulario y la lista de camiones
router.get('/', renderTrucksPage);

// Ruta para manejar el envío del formulario y crear un nuevo camión
router.post('/add', createTruck);

// RUTA PARA VER EL DETALLE DE UN SOLO CAMIÓN <-- AÑADIMOS ESTA NUEVA RUTA
// El ':id' es un parámetro dinámico. Express capturará lo que venga en esa parte de la URL.
router.get('/:id', renderTruckDetails);

module.exports = router;