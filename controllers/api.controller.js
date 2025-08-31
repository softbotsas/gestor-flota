// controllers/api.controller.js (COMPLETO Y CORREGIDO)

const apiCtrl = {};
const Maintenance = require('../models/Maintenance');

// --- MÉTODO PARA OBTENER LA LISTA COMPLETA DE NOTIFICACIONES ---
apiCtrl.getActiveNotifications = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Estandarizamos a la medianoche de hoy

  try {
    // Buscamos todos los servicios que tengan una fecha futura.
    const upcomingServices = await Maintenance.find({
      isActive: true, // Asegurándonos de no incluir registros "borrados"
      nextServiceDate: { $gte: today }
    }).populate('truck', 'placa alias').sort({ nextServiceDate: 'asc' }).lean(); // Ordenamos por el más próximo

    const activeNotifications = [];

    // Filtramos para encontrar solo aquellos que están dentro de su período de recordatorio.
    upcomingServices.forEach(service => {
      if (service.reminderDays) {
        const reminderDate = new Date(service.nextServiceDate);
        reminderDate.setDate(reminderDate.getDate() - service.reminderDays);
        if (today >= reminderDate) {
          activeNotifications.push(service);
        }
      }
    });
    
    // Devolvemos la respuesta en formato JSON con la lista de notificaciones.
    res.json({ success: true, notifications: activeNotifications });

  } catch (error) {
    console.error("Error en la API de notificaciones:", error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// --- MÉTODO PARA OBTENER SOLO EL CONTEO DE NOTIFICACIONES ---
apiCtrl.getNotificationCount = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const upcomingServices = await Maintenance.find({
      isActive: true,
      nextServiceDate: { $gte: today }
    }).lean();

    let notificationCount = 0;
    
    upcomingServices.forEach(service => {
      if (service.reminderDays) {
        const reminderDate = new Date(service.nextServiceDate);
        reminderDate.setDate(reminderDate.getDate() - service.reminderDays);
        if (today >= reminderDate) {
          notificationCount++;
        }
      }
    });
    
    // Devolvemos la respuesta en JSON solo con el conteo.
    res.json({ success: true, count: notificationCount });

  } catch (error) {
    console.error("Error en la API de conteo de notificaciones:", error);
    res.status(500).json({ success: false, count: 0 });
  }
};

module.exports = apiCtrl;