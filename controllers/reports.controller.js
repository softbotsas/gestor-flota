// controllers/reports.controller.js
const reportsCtrl = {};
const Maintenance = require('../models/Maintenance');
const Truck = require('../models/Truck');
const OperationType = require('../models/OperationType');

reportsCtrl.renderMaintenanceReport = async (req, res) => {
  try {
    // Obtenemos los parámetros de los filtros desde la URL (query string)
    const { truck, type, startDate, endDate } = req.query;

    // Construimos el objeto de consulta para MongoDB de forma dinámica
    let query = { isActive: true }; // Siempre filtramos por registros activos

    if (truck) query.truck = truck;
    if (type) query.type = type;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Usamos Promise.all para hacer todas las búsquedas a la vez
    const [
      allMaintenances, 
      trucks, 
      operationTypes,
      upcomingServices
    ] = await Promise.all([
      // Buscamos los mantenimientos aplicando los filtros
      Maintenance.find(query).populate('truck', 'placa alias').sort({ date: 'desc' }).lean(),
      // Buscamos todos los camiones para llenar el select del filtro
      Truck.find().sort({ alias: 'asc' }).lean(),
      // Buscamos todos los tipos de operación para el select del filtro
      OperationType.find().sort({ name: 'asc' }).lean(),
      // ¡NUEVO! Búsqueda específica para los próximos servicios
      Maintenance.find({ 
        isActive: true, 
        nextServiceDate: { $gte: new Date() } // Donde la fecha sea hoy o en el futuro
      }).populate('truck', 'placa alias').sort({ nextServiceDate: 'asc' }).lean()
    ]);

    // Calculamos el costo total de los mantenimientos filtrados
    const totalCost = allMaintenances.reduce((sum, maint) => sum + maint.cost, 0);

    res.render('reports/maintenance-report', {
      layout: 'layouts/main',
      maintenances: allMaintenances,
      trucks,
      operationTypes,
      totalCost,
      upcomingServices,
      // Pasamos los valores actuales de los filtros para que se mantengan seleccionados
      filters: req.query
    });

  } catch (error) {
    console.error("Error al generar el reporte de mantenimiento:", error);
    res.send("Error al generar el reporte.");
  }
};

module.exports = reportsCtrl;