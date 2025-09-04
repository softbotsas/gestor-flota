// helpers/auth.js
const helpers = {};
helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'No autorizado. Por favor, inicia sesión.');
  res.redirect('/users/login');
};
module.exports = helpers;