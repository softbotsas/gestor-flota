// controllers/truck.controller.js (CÓDIGO FINAL Y CORREGIDO)

const truckCtrl = {};

// Importamos todos los modelos que necesitamos en este archivo
const Truck = require('../models/Truck');
const Maintenance = require('../models/Maintenance');
const OperationType = require('../models/OperationType');

// Método para renderizar la página principal de la flota
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

// Método para crear un nuevo camión
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


// MÉTODO PARA RENDERIZAR LA PÁGINA DE DETALLES DE UN CAMIÓN
truckCtrl.renderTruckDetails = async (req, res) => {
  try {
    const truckId = req.params.id;

    // Usamos Promise.all para hacer las búsquedas en paralelo (más eficiente)
    const [truck, maintenances, operationTypes] = await Promise.all([
      Truck.findById(truckId).lean(),
      // =======================================================
      // ================ ¡CORRECCIÓN APLICADA AQUÍ! ===========
      // =======================================================
      // Eliminamos el filtro 'isActive: true' para que encuentre TODOS los registros.
      Maintenance.find({ truck: truckId }).sort({ date: 'desc' }).lean(),
      OperationType.find().sort({ name: 'asc' }).lean()
    ]);

    if (!truck) {
      return res.status(404).send('Camión no encontrado');
    }

    // Ahora la variable 'maintenances' contendrá la lista correcta de registros.
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


module.exports = truckCtrl;