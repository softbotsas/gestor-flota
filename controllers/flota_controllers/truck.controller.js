// controllers/truck.controller.js (VERSIÓN FINAL Y COMPLETA)

const truckCtrl = {};

// Importamos todos los modelos necesarios
const Truck = require('../../models/flota_models/Truck');
const Maintenance = require('../../models/flota_models/Maintenance');
const OperationType = require('../../models/flota_models/OperationType');
const Driver = require('../../models/flota_models/Driver');

// Importamos los módulos para manejar archivos
const fs = require('fs').promises; 
const path = require('path');
const { uploadFields } = require('../../libs/storage');

// --- MÉTODO PARA RENDERIZAR LA PÁGINA PRINCIPAL DE LA FLOTA ---
truckCtrl.renderTrucksPage = async (req, res) => {
  try {
    const { show_inactive } = req.query; // Leemos el parámetro de la URL
    let query = { status: 'Activo' }; // Por defecto, solo mostramos los activos

    if (show_inactive === 'true') {
      query = {}; // Si el parámetro existe, eliminamos el filtro para mostrarlos todos
    }

    const trucks = await Truck.find(query).sort({ createdAt: 'desc' }).lean();
    
    res.render('trucks/all-trucks', { 
      layout: 'layouts/main',
      trucks,
      showingInactive: show_inactive === 'true'
    });
  } catch (error) {
    console.error("Error al cargar la página de camiones:", error);
    res.send("Error al cargar la página de camiones.");
  }
};

// --- MÉTODO PARA CREAR UN NUEVO CAMIÓN ---
truckCtrl.createTruck = async (req, res) => {
  // El status se asigna por defecto como "Activo" desde el modelo.
  const { placa, marca, modelo, año, alias } = req.body;
  try {
    const newTruck = new Truck({ placa, marca, modelo, año, alias });
    await newTruck.save();
    res.redirect('/trucks');
  } catch (error) {
    if (error.code === 11000) { console.log('Error: La placa ya existe.'); } 
    else { console.error(error); }
    res.redirect('/trucks');
  }
};

// --- MÉTODO PARA RENDERIZAR LA PÁGINA DE DETALLES DE UN CAMIÓN ---
truckCtrl.renderTruckDetails = async (req, res) => {
  try {
    const truckId = req.params.id;
    const [truck, maintenances, operationTypes, drivers] = await Promise.all([
      Truck.findById(truckId).lean(),
      Maintenance.find({ truck: truckId, isActive: true }).populate('driver','name').sort({ date: 'desc' }).lean(),
      OperationType.find().sort({ name: 'asc' }).lean(),
      Driver.find({ isActive: true }).sort({ name: 'asc' }).lean()
    ]);

    if (!truck) {
      return res.status(404).send('Camión no encontrado');
    }
    res.render('trucks/truck-details', {
      layout: 'layouts/main',
      truck,
      maintenances,
      operationTypes,
      drivers
    });
  } catch (error) {
    console.error("Error en renderTruckDetails:", error);
    res.status(500).send('Error al buscar el camión.');
  }
};

// --- MÉTODO PARA ACTUALIZAR LA INFORMACIÓN DE UN CAMIÓN ---
truckCtrl.updateTruck = async (req, res) => {
  const { id } = req.params;
  // Añadimos 'status' para que se guarde desde el formulario de edición.
  const { placa, marca, modelo, año, alias, status } = req.body;
  try {
    const update = { placa, marca, modelo, año, alias, status };
    // Manejo de documentos si vienen en la petición (cuando se usa el modal de documentos)
    if (req.files && (req.files.circulationCard || req.files.yearSticker)) {
      update.documents = {};
      if (req.files.circulationCard && req.files.circulationCard[0]) {
        update.documents.circulationCard = '/uploads/' + req.files.circulationCard[0].filename;
      }
      if (req.files.yearSticker && req.files.yearSticker[0]) {
        update.documents.yearSticker = '/uploads/' + req.files.yearSticker[0].filename;
      }
    }
    await Truck.findByIdAndUpdate(id, update);
    res.redirect(`/trucks/${id}`);
  } catch (error) {
    console.error("Error al actualizar el camión:", error);
    res.redirect(`/trucks/${id}`);
  }
};

// --- MÉTODO PARA ELIMINAR UN CAMIÓN Y TODOS SUS DATOS ASOCIADOS ---
truckCtrl.deleteTruck = async (req, res) => {
  const { id } = req.params;
  try {
    const maintenances = await Maintenance.find({ truck: id });
    await Promise.all(maintenances.map(async (maint) => {
      try { await fs.unlink(path.resolve('./public' + maint.receiptImage)); } 
      catch (err) { console.log(`No se pudo borrar la imagen: ${maint.receiptImage}`); }
    }));
    await Maintenance.deleteMany({ truck: id });
    await Truck.findByIdAndDelete(id);
    res.redirect('/trucks');
  } catch (error) {
    console.error("Error al eliminar el camión y sus datos:", error);
    res.redirect('/trucks');
  }
};

module.exports = truckCtrl;