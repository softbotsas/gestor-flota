// routes/users.routes.js
const { Router } = require('express');
const router = Router();
const passport = require('passport');

// Rutas para mostrar el formulario de Login (GET)
router.get('/login', (req, res) => {
  res.render('users/login', { layout: 'layouts/auth' });
});

// Ruta para procesar el Login (POST)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard', // Si el login es exitoso, llévalo al dashboard
  failureRedirect: '/users/login',  // Si falla, llévalo de nuevo al login
  failureFlash: true             // Activa los mensajes de error
}));

// Ruta para Cerrar Sesión
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'Has cerrado sesión correctamente.');
    res.redirect('/users/login');
  });
});

module.exports = router;