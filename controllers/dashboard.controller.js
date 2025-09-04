// controllers/dashboard.controller.js (COMPLETO Y VERIFICADO)
const dashboardCtrl = {};
const Truck = require('../models/Truck');
const Maintenance = require('../models/Maintenance');
const Fuel = require('../models/Fuel');
const moment = require('moment'); // Asegúrate de haber hecho 'npm install moment'

// --- FUNCIÓN PRINCIPAL PARA RENDERIZAR EL DASHBOARD ---
dashboardCtrl.renderDashboard = async (req, res) => {
  try {
    // --- Definir el rango de fechas para el mes actual ---
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    // --- Usamos Promise.all para ejecutar todas las consultas en paralelo ---
    const [
      activeTrucksCount,
      upcomingServices,
      monthlyMaintenance,
      monthlyFuel
    ] = await Promise.all([
      Truck.countDocuments({ status: 'Activo' }),
      Maintenance.find({
        isActive: true,
        isCompleted: false,
        nextServiceDate: { $gte: new Date() }
      }).populate('truck', 'placa alias').sort({ nextServiceDate: 'asc' }).limit(5).lean(),
      Maintenance.find({
        isActive: true,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      }),
      Fuel.find({
        isActive: true,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      })
    ]);

    // --- Procesamos los resultados de las consultas ---

    // 1. Costos de Mantenimiento por moneda
    const maintenanceCosts = monthlyMaintenance.reduce((totals, s) => {
      const currency = s.currency || 'GTQ';
      if (!totals[currency]) totals[currency] = 0;
      totals[currency] += s.totalCost;
      return totals;
    }, {});

    // 2. Costos de Combustible por moneda
    const fuelCosts = monthlyFuel.reduce((totals, f) => {
      const currency = f.currency || 'GTQ';
      if (!totals[currency]) totals[currency] = 0;
      totals[currency] += f.cost;
      return totals;
    }, {});

    // 3. ¡NUEVO! Conteo de registros de combustible del mes
    const fuelRecordsCount = monthlyFuel.length;

    // --- Renderizamos la vista con todos los datos procesados ---
    res.render('dashboard', {
      layout: 'layouts/main',
      activeTrucksCount,
      upcomingServices,
      maintenanceCosts,
      fuelCosts,
      fuelRecordsCount // <-- Pasamos el nuevo dato a la vista
    });

  } catch (error) {
    console.error("Error al cargar el dashboard:", error);
    res.send("Error al cargar el panel de control.");
  }
};

module.exports = dashboardCtrl;