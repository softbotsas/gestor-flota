// routes/index.routes.js (VERSIÓN FINAL Y SIMPLIFICADA)
const { Router } = require('express');
const router = Router();

// La única responsabilidad de este archivo es mostrar el splash screen inicial.
// No necesita estar protegido, es público.
router.get('/', (req, res) => {
  res.render('splash'); 
});

module.exports = router;