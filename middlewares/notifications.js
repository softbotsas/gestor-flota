// middlewares/notifications.js
const Maintenance = require('../models/Maintenance');

const notificationsMiddleware = async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Estandarizamos a la medianoche de hoy

  try {
    const upcomingServices = await Maintenance.find({
      nextServiceDate: { $gte: today } // Traemos todos los servicios futuros
    }).lean();

    let notificationCount = 0;
    const activeNotifications = [];

    upcomingServices.forEach(service => {
      if (service.reminderDays) {
        const reminderDate = new Date(service.nextServiceDate);
        reminderDate.setDate(reminderDate.getDate() - service.reminderDays);

        if (today >= reminderDate) {
          notificationCount++;
          activeNotifications.push(service); // Podríamos usar esto en el futuro
        }
      }
    });

    // Hacemos el contador accesible en TODAS las vistas EJS
    res.locals.notificationCount = notificationCount;
    next(); // Continuamos con la siguiente función en la cadena

  } catch (error) {
    console.error("Error en el middleware de notificaciones:", error);
    res.locals.notificationCount = 0;
    next();
  }
};

module.exports = notificationsMiddleware;