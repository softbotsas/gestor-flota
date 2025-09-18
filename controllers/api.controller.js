// controllers/api.controller.js (COMPLETO Y VERIFICADO)
const apiCtrl = {};
const Maintenance = require('../models/flota_models/Maintenance');
const Fuel = require('../models/flota_models/Fuel');
const Truck = require('../models/flota_models/Truck');
const OperationType = require('../models/flota_models/OperationType');
const moment = require('moment');

// --- Obtiene la lista de notificaciones activas ---
apiCtrl.getActiveNotifications = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const upcomingServices = await Maintenance.find({
      isActive: true,
      isCompleted: false,
      nextServiceDate: { $gte: today }
    }).populate('truck', 'placa alias').sort({ nextServiceDate: 'asc' }).lean();
    
    const activeNotifications = [];
    upcomingServices.forEach(service => {
      if (service.reminderDays) {
        const reminderDate = new Date(service.nextServiceDate);
        reminderDate.setDate(reminderDate.getDate() - service.reminderDays);
        if (today >= reminderDate) { activeNotifications.push(service); }
      }
    });
    res.json({ success: true, notifications: activeNotifications });
  } catch (error) {
    console.error("Error en la API de notificaciones:", error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// --- Obtiene solo el número de notificaciones activas ---
apiCtrl.getNotificationCount = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const upcomingServices = await Maintenance.find({
      isActive: true,
      isCompleted: false,
      nextServiceDate: { $gte: today }
    }).lean();
    
    let notificationCount = 0;
    upcomingServices.forEach(service => {
      if (service.reminderDays) {
        const reminderDate = new Date(service.nextServiceDate);
        reminderDate.setDate(reminderDate.getDate() - service.reminderDays);
        if (today >= reminderDate) { notificationCount++; }
      }
    });
    res.json({ success: true, count: notificationCount });
  } catch (error) {
    console.error("Error en la API de conteo de notificaciones:", error);
    res.status(500).json({ success: false, count: 0 });
  }
};

// --- Obtiene los detalles de un único registro de mantenimiento ---
apiCtrl.getMaintenanceDetails = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id).lean();
    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }
    res.json({ success: true, maintenance });
  } catch (error) {
    console.error("Error al obtener detalles del mantenimiento:", error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// --- Obtiene la lista de todos los camiones activos ---
apiCtrl.getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({ status: 'Activo' }).sort({ alias: 'asc' }).lean();
    res.json({ success: true, trucks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cargar camiones' });
  }
};

// --- Obtiene la lista de todos los tipos de operación ---
apiCtrl.getOperationTypes = async (req, res) => {
  try {
    const operationTypes = await OperationType.find().sort({ name: 'asc' }).lean();
    res.json({ success: true, operationTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cargar tipos de operación' });
  }
};

// --- Prepara los datos para el gráfico de gastos mensuales del dashboard ---
apiCtrl.getMonthlyExpensesChartData = async (req, res) => {
  try {
    const sixMonthsAgo = moment().subtract(6, 'months').startOf('month').toDate();

    const maintenanceData = await Maintenance.aggregate([
      { $match: { date: { $gte: sixMonthsAgo }, isActive: true } },
      { $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" }, currency: "$currency" },
          total: { $sum: "$totalCost" }
      }}
    ]);

    const fuelData = await Fuel.aggregate([
      { $match: { date: { $gte: sixMonthsAgo }, isActive: true } },
      { $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" }, currency: "$currency" },
          total: { $sum: "$cost" }
      }}
    ]);

    const chartData = {
      labels: [],
      datasets: [
        { label: 'Mantenimiento (GTQ)', data: [], backgroundColor: 'rgba(231, 74, 59, 0.7)', stack: 'GTQ' },
        { label: 'Combustible (GTQ)', data: [], backgroundColor: 'rgba(28, 200, 138, 0.7)', stack: 'GTQ' },
        { label: 'Mantenimiento (USD)', data: [], backgroundColor: 'rgba(231, 74, 59, 0.5)', stack: 'USD' },
        { label: 'Combustible (USD)', data: [], backgroundColor: 'rgba(28, 200, 138, 0.5)', stack: 'USD' },
      ]
    };
    
    for (let i = 5; i >= 0; i--) {
      chartData.labels.push(moment().subtract(i, 'months').format('MMM YYYY'));
    }
    
    // Inicializar todos los datasets con ceros
    chartData.datasets.forEach(ds => ds.data = new Array(6).fill(0));

    const processData = (sourceData, isMaintenance) => {
        sourceData.forEach(item => {
            const currency = item._id.currency;
            let datasetIndex;
            if (currency === 'GTQ') { datasetIndex = isMaintenance ? 0 : 1; } 
            else if (currency === 'USD') { datasetIndex = isMaintenance ? 2 : 3; }
            else return; // Ignorar otras monedas si las hubiera

            const monthLabel = moment(`${item._id.year}-${item._id.month}-01`).format('MMM YYYY');
            const index = chartData.labels.indexOf(monthLabel);
            if (index > -1) {
                chartData.datasets[datasetIndex].data[index] += item.total;
            }
        });
    }

    processData(maintenanceData, true); // Procesar mantenimientos
    processData(fuelData, false);     // Procesar combustible
    
    // Opcional: Filtrar datasets que no tienen datos para no mostrarlos en la leyenda.
    chartData.datasets = chartData.datasets.filter(ds => ds.data.some(d => d > 0));

    res.json({ success: true, chartData });

  } catch (error) {
    console.error("Error al generar datos para el gráfico:", error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};


module.exports = apiCtrl;