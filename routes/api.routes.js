// routes/api.routes.js (ACTUALIZADO)
const { Router } = require('express');
const router = Router();

// Importamos el nuevo método que crearemos
const { getActiveNotifications, getNotificationCount } = require('../controllers/api.controller');

// Ruta para obtener la lista completa de notificaciones (para el modal)
router.get('/notifications', getActiveNotifications);

// ¡NUEVA RUTA! Para obtener solo el número de notificaciones
router.get('/notifications/count', getNotificationCount);

module.exports = router;