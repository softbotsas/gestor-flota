// controllers/maintenance.controller.js
// VERSIÓN FINAL, SIMPLIFICADA Y CORREGIDA. USA EL MÓDULO 'fs' NATIVO DE NODE.JS

const maintenanceCtrl = {};
const Maintenance = require('../models/Maintenance');

// Usamos el módulo 'fs' (File System) que viene con Node.js.
// '.promises' nos permite usar async/await con él, que es más limpio.
const fs = require('fs').promises; 
const path = require('path');

// --- MÉTODO PARA CREAR UN NUEVO REGISTRO ---
maintenanceCtrl.createMaintenance = async (req, res) => {
  const { truckId } = req.params;
  const { type, date, cost, details, nextServiceDate, mileage, brand } = req.body;

  if (!req.file) {
    return res.status(400).send('Error: No se ha subido ninguna imagen.');
  }

  try {
    const newMaintenance = new Maintenance({
      truck: truckId,
      type, date, cost, details,
      nextServiceDate: nextServiceDate || null,
      receiptImage: '/uploads/' + req.file.filename,
      mileage, brand
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
  const { type, date, cost, details, nextServiceDate, mileage, brand } = req.body;

  try {
    const maintenanceToUpdate = await Maintenance.findById(id);
    if (!maintenanceToUpdate) {
      return res.status(404).send("Registro no encontrado para actualizar.");
    }

    let updateData = { type, date, cost, details, nextServiceDate, mileage, brand };

    if (req.file) {
      const oldImagePath = path.resolve('./public' + maintenanceToUpdate.receiptImage);
      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        console.log("No se pudo borrar la imagen anterior:", oldImagePath);
      }
      updateData.receiptImage = '/uploads/' + req.file.filename;
    }

    await Maintenance.findByIdAndUpdate(id, updateData);
    res.redirect(`/trucks/${maintenanceToUpdate.truck}`);
  } catch (error) {
    console.error("Error al actualizar el mantenimiento:", error);
    res.status(500).send("Ocurrió un error al actualizar el registro.");
  }
};

// --- MÉTODO PARA ELIMINAR UN REGISTRO (VERSIÓN ROBUSTA) ---
maintenanceCtrl.deleteMaintenance = async (req, res) => {
  const { id } = req.params;
  let truckIdToRedirect = null;

  try {
    // 1. Buscamos el registro ANTES de borrarlo para obtener su información.
    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      return res.status(404).send('Registro no encontrado. Es posible que ya haya sido eliminado.');
    }

    // Guardamos el ID del camión para saber a dónde redirigir al final.
    truckIdToRedirect = maintenance.truck;
    const imagePath = path.resolve('./public' + maintenance.receiptImage);

    // 2. Intentamos borrar el archivo de imagen.
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      // Si el archivo no existe, no es un error crítico. Lo registramos y continuamos.
      console.log(`No se encontró el archivo de imagen para borrar: ${imagePath}`);
    }

    // 3. Borramos el registro de la base de datos.
    await Maintenance.findByIdAndDelete(id);

    // 4. Redirigimos al usuario.
    res.redirect(`/trucks/${truckIdToRedirect}`);

  } catch (error) {
    console.error("Error al eliminar el mantenimiento:", error);
    // Si algo falla, intentamos redirigir si tenemos el ID, si no, mostramos un error.
    if (truckIdToRedirect) {
      res.redirect(`/trucks/${truckIdToRedirect}`);
    } else {
      res.status(500).send("Ocurrió un error en el servidor al intentar eliminar el registro.");
    }
  }
};

module.exports = maintenanceCtrl;