// controllers/maintenance.controller.js
// VERSIÓN FINAL CON "SOFT DELETE", RECORDATORIOS Y MONEDA

const maintenanceCtrl = {};
const Maintenance = require('../models/Maintenance');

// --- MÉTODO PARA CREAR UN NUEVO REGISTRO ---
maintenanceCtrl.createMaintenance = async (req, res) => {
  const { truckId } = req.params;
  // Añadimos 'currency' a los datos que recibimos del formulario.
  const { type, date, cost, details, nextServiceDate, mileage, brand, reminderDays, currency } = req.body;

  if (!req.file) {
    return res.status(400).send('Error: No se ha subido ninguna imagen.');
  }

  try {
    const newMaintenance = new Maintenance({
      truck: truckId,
      type, date, cost, details,
      nextServiceDate: nextServiceDate || null,
      receiptImage: '/uploads/' + req.file.filename,
      mileage, brand,
      reminderDays: reminderDays || null,
      currency // Guardamos el nuevo campo de moneda.
    });

    await newMaintenance.save();
    res.redirect(`/trucks/${truckId}`);
  } catch (error) {
    console.error("Error al guardar el mantenimiento:", error);
    res.status(500).send("Ocurrió un error al guardar el registro.");
  }
};

// --- MÉTODO PARA ACTUALIZAR UN REGISTRO ---
maintenanceCtrl.updateMaintenance = async (req, res) => {
  const { id } = req.params;
  // Añadimos 'currency' a los datos que recibimos del formulario.
  const { type, date, cost, details, nextServiceDate, mileage, brand, reminderDays, currency } = req.body;

  try {
    const maintenanceToUpdate = await Maintenance.findById(id);
    if (!maintenanceToUpdate) {
      return res.status(404).send("Registro no encontrado para actualizar.");
    }

    // Añadimos el nuevo campo al objeto de datos a actualizar.
    let updateData = { type, date, cost, details, nextServiceDate, mileage, brand, reminderDays: reminderDays || null, currency };

    if (req.file) {
      updateData.receiptImage = '/uploads/' + req.file.filename;
    }

    await Maintenance.findByIdAndUpdate(id, updateData);
    res.redirect(`/trucks/${maintenanceToUpdate.truck}`);
  } catch (error) {
    console.error("Error al actualizar el mantenimiento:", error);
    res.status(500).send("Ocurrió un error al actualizar el registro.");
  }
};

// --- MÉTODO DE BORRADO SUAVE (SOFT DELETE) ---
maintenanceCtrl.deleteMaintenance = async (req, res) => {
  const { id } = req.params;
  try {
    const maintenance = await Maintenance.findById(id);
    
    if (maintenance) {
      await Maintenance.findByIdAndUpdate(id, { isActive: false });
      return res.redirect(`/trucks/${maintenance.truck}`);
    } else {
      return res.status(404).send('Registro no encontrado.');
    }
  } catch (error) {
    console.error("Error al realizar el borrado suave:", error);
    res.status(500).send("Ocurrió un error en el servidor.");
  }
};

module.exports = maintenanceCtrl;