// controllers/maintenance.controller.js (ADAPTADO PARA 'mechanicName')
const maintenanceCtrl = {};
const Maintenance = require('../../models/flota_models/Maintenance');

// --- CREAR UN NUEVO SERVICIO ---
maintenanceCtrl.createMaintenance = async (req, res) => {
  const { truckId } = req.params;
  // Añadimos 'mechanicName' a la lista de datos extraídos.
  const { 
    eventName, date, mileage, currency, nextServiceDate, 
    reminderDays, serviceItems, completedServiceId, mechanicName, driver
  } = req.body;
  if (!driver) { return res.status(400).send('Error: Debe seleccionar un conductor.'); }

  try {
    const parsedItems = JSON.parse(serviceItems);
    const totalCost = parsedItems.reduce((sum, item) => sum + Number(item.cost), 0);

    const newMaintenance = new Maintenance({
      truck: truckId,
      eventName, date, mileage, currency, totalCost,
      driver,
      mechanicName, // <-- Se añade aquí
      nextServiceDate: nextServiceDate || null,
      reminderDays: reminderDays || null,
      serviceItems: parsedItems,
      receiptImage: req.file ? '/uploads/' + req.file.filename : null
    });

    await newMaintenance.save();

    if (completedServiceId) {
      await Maintenance.findByIdAndUpdate(completedServiceId, { isCompleted: true });
    }

    res.redirect(`/trucks/${truckId}`);
  } catch (error) {
    console.error("Error al guardar el servicio:", error);
    res.status(500).send("Ocurrió un error al guardar el registro.");
  }
};

// --- ACTUALIZAR UN SERVICIO ---
maintenanceCtrl.updateMaintenance = async (req, res) => {
  const { id } = req.params;
  // Añadimos 'mechanicName' a la lista.
  const { 
    eventName, date, mileage, currency, nextServiceDate, 
    reminderDays, serviceItems, mechanicName, driver
  } = req.body;

  try {
    const parsedItems = JSON.parse(serviceItems);
    const totalCost = parsedItems.reduce((sum, item) => sum + Number(item.cost), 0);

    let updateData = {
      eventName, date, mileage, currency, totalCost,
      driver: driver,
      mechanicName, // <-- Se añade aquí
      nextServiceDate: nextServiceDate || null,
      reminderDays: reminderDays || null,
      serviceItems: parsedItems
    };

    if (req.file) {
      updateData.receiptImage = '/uploads/' + req.file.filename;
    }

    const updatedMaintenance = await Maintenance.findByIdAndUpdate(id, updateData, { new: true });
    
    res.redirect(`/trucks/${updatedMaintenance.truck}`);
  } catch (error) {
    console.error("Error al actualizar el servicio:", error);
    res.status(500).send("Ocurrió un error al actualizar el registro.");
  }
};

// --- BORRADO SUAVE DE UN SERVICIO ---
maintenanceCtrl.deleteMaintenance = async (req, res) => {
  const { id } = req.params;
  try {
    const eventToDelete = await Maintenance.findById(id);
    
    if (eventToDelete) {
      await Maintenance.findByIdAndUpdate(id, { isActive: false });
      return res.redirect(`/trucks/${eventToDelete.truck}`);
    } else {
      return res.status(404).send('Servicio no encontrado.');
    }
  } catch (error) {
    console.error("Error al realizar el borrado suave:", error);
    res.status(500).send("Ocurrió un error en el servidor.");
  }
};

module.exports = maintenanceCtrl;