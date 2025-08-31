// controllers/truck.controller.js (VERSIÓN FINAL, COMPLETA Y VERIFICADA)

const truckCtrl = {};

// Importamos todos los modelos necesarios
const Truck = require('../models/Truck');
const Maintenance = require('../models/Maintenance');
const OperationType = require('../models/OperationType');

// Importamos los módulos para manejar archivos
const fs = require('fs').promises; 
const path = require('path');

// --- MÉTODO PARA RENDERIZAR LA PÁGINA PRINCIPAL DE LA FLOTA ---
truckCtrl.renderTrucksPage = async (req, res) => {
  try {
    const trucks = await Truck.find().sort({ createdAt: 'desc' }).lean();
    res.render('trucks/all-trucks', { 
      layout: 'layouts/main',
      trucks
    });
  } catch (error) {
    console.error(error);
    res.send("Error al cargar la página de camiones.");
  }
};

// --- MÉTODO PARA CREAR UN NUEVO CAMIÓN ---
truckCtrl.createTruck = async (req, res) => {
  const { placa, marca, modelo, año, alias } = req.body;
  
  try {
    const newTruck = new Truck({ placa, marca, modelo, año, alias });
    await newTruck.save();
    res.redirect('/trucks');
  } catch (error) {
    if (error.code === 11000) {
      console.log('Error: La placa ya existe.');
    } else {
      console.error(error);
    }
    res.redirect('/trucks');
  }
};

// --- MÉTODO PARA RENDERIZAR LA PÁGINA DE DETALLES DE UN CAMIÓN ---
truckCtrl.renderTruckDetails = async (req, res) => {
  try {
    const truckId = req.params.id;

    const [truck, maintenances, operationTypes] = await Promise.all([
      Truck.findById(truckId).lean(),
      Maintenance.find({ truck: truckId }).sort({ date: 'desc' }).lean(),
      OperationType.find().sort({ name: 'asc' }).lean()
    ]);

    if (!truck) {
      return res.status(404).send('Camión no encontrado');
    }

    res.render('trucks/truck-details', {
      layout: 'layouts/main',
      truck,
      maintenances,
      operationTypes
    });

  } catch (error) {
    console.error("Error en renderTruckDetails:", error);
    res.status(500).send('Error al buscar el camión.');
  }
};

// =======================================================
// ================ FUNCIONES QUE FALTABAN ================
// =======================================================

// --- MÉTODO PARA ACTUALIZAR LA INFORMACIÓN DE UN CAMIÓN ---
truckCtrl.updateTruck = async (req, res) => {
  const { id } = req.params;
  const { placa, marca, modelo, año, alias } = req.body;
  try {
    await Truck.findByIdAndUpdate(id, { placa, marca, modelo, año, alias });
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
      try {
        await fs.unlink(path.resolve('./public' + maint.receiptImage));
      } catch (err) {
        console.log(`No se pudo borrar la imagen: ${maint.receiptImage}`);
      }
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