// routes/index.routes.js (ACTUALIZADO)
const { Router } = require('express');
const router = Router();

// La ruta raíz ('/') ahora renderiza nuestra nueva pantalla de carga.
router.get('/', (req, res) => {
  res.render('splash');
});

module.exports = router;