// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  // 1. Buscar si existe un usuario con ese email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return done(null, false, { message: 'Usuario no encontrado.' });
  }

  // 2. Si existe, comparar la contraseña
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return done(null, false, { message: 'Contraseña incorrecta.' });
  }
  
  // 3. Si todo coincide, devolver el usuario
  return done(null, user);
}));

// Guarda el ID del usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Usa el ID de la sesión para obtener los datos completos del usuario
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).lean();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});