// controllers/reports.controller.js (COMPLETO, VERIFICADO Y SIN OMISIONES)
const reportsCtrl = {};
const Maintenance = require('../models/Maintenance');
const Fuel = require('../models/Fuel');
const Truck = require('../models/Truck');
const OperationType = require('../models/OperationType');
const xlsx = require('xlsx');
const PdfPrinter = require('pdfmake');
const fs = require('fs'); // ¡LÍNEA CRÍTICA CORREGIDA!
const path = require('path');

// =======================================================
// === FUNCIÓN PARA EL HUB DE REPORTES (/reports)
// =======================================================
reportsCtrl.renderReportsHub = async (req, res) => {
  try {
    const { 
      expenseType = 'all',
      truck = '',
      opType = '',
      startDate = '', 
      endDate = '' 
    } = req.query;

    let maintenanceQuery = { isActive: true };
    let fuelQuery = { isActive: true };
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      const dateFilter = { date: { $gte: start, $lte: end } };
      maintenanceQuery.date = dateFilter.date;
      fuelQuery.date = dateFilter.date;
    }
    
    if (truck) {
      maintenanceQuery.truck = truck;
      fuelQuery.truck = truck;
    }

    if (expenseType === 'maintenance' && opType) {
      maintenanceQuery['serviceItems.type'] = opType;
    }
    
    let maintenanceRecords = [];
    let fuelRecords = [];

    if (expenseType === 'all' || expenseType === 'maintenance') {
      maintenanceRecords = await Maintenance.find(maintenanceQuery).populate('truck', 'placa alias').lean();
    }
    if (expenseType === 'all' || expenseType === 'fuel') {
      fuelRecords = await Fuel.find(fuelQuery).populate('truck', 'placa alias').lean();
    }

    const allRecords = [...maintenanceRecords, ...fuelRecords].sort((a, b) => new Date(b.date) - new Date(a.date));

    const KPIs = {
      maintenanceCost: { GTQ: 0, USD: 0 },
      fuelCost: { GTQ: 0, USD: 0 },
      maintenanceCount: maintenanceRecords.length,
      fuelCount: fuelRecords.length
    };
    maintenanceRecords.forEach(m => KPIs.maintenanceCost[m.currency] = (KPIs.maintenanceCost[m.currency] || 0) + m.totalCost);
    fuelRecords.forEach(f => KPIs.fuelCost[f.currency] = (KPIs.fuelCost[f.currency] || 0) + f.cost);
    
    const [allTrucks, allOpTypes] = await Promise.all([
      Truck.find({}).sort({ alias: 'asc' }).lean(),
      OperationType.find().sort({ name: 'asc' }).lean()
    ]);
    
    res.render('reports/reports-hub', {
      layout: 'layouts/main',
      records: allRecords,
      KPIs,
      allTrucks,
      allOpTypes,
      filters: req.query
    });

  } catch (error) {
    console.error("Error al renderizar el hub de reportes:", error);
    res.send("Error al cargar el centro de reportes.");
  }
};

// =========================================================================
// === FUNCIÓN PARA LA PÁGINA HISTORIAL DE MANTENIMIENTOS (/reports/maintenance)
// =========================================================================
reportsCtrl.renderMaintenanceReport = async (req, res) => {
  try {
    const { truck, type, eventName, startDate, endDate } = req.query;
    let query = { isActive: true };
    if (truck) query.truck = truck;
    if (type) query['serviceItems.type'] = type;
    if (eventName && eventName.trim() !== '') query.eventName = new RegExp(eventName, 'i');
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
    const allMaintenances = await Maintenance.find(query).populate('truck', 'placa alias').sort({ date: 'desc' }).lean();
    const totalCosts = allMaintenances.reduce((totals, maint) => {
      const currency = maint.currency || 'GTQ';
      if (!totals[currency]) { totals[currency] = 0; }
      totals[currency] += maint.totalCost;
      return totals;
    }, {});
    const [trucks, operationTypes, upcomingServices] = await Promise.all([
      Truck.find({}).sort({ alias: 'asc' }).lean(),
      OperationType.find().sort({ name: 'asc' }).lean(),
      Maintenance.find({ isActive: true, isCompleted: false, nextServiceDate: { $gte: new Date() } }).populate('truck', 'placa alias').sort({ nextServiceDate: 'asc' }).lean()
    ]);
    res.render('reports/maintenance-report', { layout: 'layouts/main', maintenances: allMaintenances, trucks, operationTypes, totalCosts, upcomingServices, filters: req.query });
  } catch (error) {
    console.error("Error al generar el reporte de mantenimiento:", error);
    res.send("Error al generar el reporte.");
  }
};

// ===========================================================
// === FUNCIÓN PARA EXPORTAR DATOS FILTRADOS A EXCEL      ====
// ===========================================================
reportsCtrl.exportToExcel = async (req, res) => {
    try {
        const { expenseType = 'all', truck = '', opType = '', startDate = '', endDate = '' } = req.query;
        let maintenanceQuery = { isActive: true }; let fuelQuery = { isActive: true };
        if (startDate && endDate) { const start = new Date(startDate); const end = new Date(endDate); end.setUTCHours(23, 59, 59, 999); maintenanceQuery.date = { $gte: start, $lte: end }; fuelQuery.date = { $gte: start, $lte: end }; }
        if (truck) { maintenanceQuery.truck = truck; fuelQuery.truck = truck; }
        if (expenseType === 'maintenance' && opType) { maintenanceQuery['serviceItems.type'] = opType; }
        let maintenanceRecords = []; let fuelRecords = [];
        if (expenseType === 'all' || expenseType === 'maintenance') { maintenanceRecords = await Maintenance.find(maintenanceQuery).populate('truck', 'placa alias').lean(); }
        if (expenseType === 'all' || expenseType === 'fuel') { fuelRecords = await Fuel.find(fuelQuery).populate('truck', 'placa alias').lean(); }
        
        const maintenanceDataForSheet = maintenanceRecords.flatMap(event => event.serviceItems.map(item => ({ 'Camión': event.truck.alias || event.truck.placa, 'Nombre del Servicio': event.eventName, 'Fecha': new Date(event.date).toLocaleDateString('es-ES'), 'Kilometraje': event.mileage, 'Mecánico': event.mechanicName || 'N/A', 'Ítem de Servicio': item.type, 'Marca del Ítem': item.brand || 'N/A', 'Costo del Ítem': item.cost, 'Moneda': event.currency, 'Detalles del Ítem': item.details || '' })));
        const fuelDataForSheet = fuelRecords.map(rec => ({ 'Camión': rec.truck.alias || rec.truck.placa, 'Fecha': new Date(rec.date).toLocaleDateString('es-ES'), 'Kilometraje': rec.mileage, 'Cantidad': rec.quantity, 'Unidad': rec.unit, 'Precio por Unidad': rec.pricePerUnit, 'Costo Total': rec.cost, 'Moneda': rec.currency }));
        
        const workbook = xlsx.utils.book_new();
        if (maintenanceDataForSheet.length > 0) { const ws = xlsx.utils.json_to_sheet(maintenanceDataForSheet); xlsx.utils.book_append_sheet(workbook, ws, "Mantenimientos"); }
        if (fuelDataForSheet.length > 0) { const ws = xlsx.utils.json_to_sheet(fuelDataForSheet); xlsx.utils.book_append_sheet(workbook, ws, "Combustible"); }
        
        const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, -5);
        const filename = `Reporte_Flota_${timestamp}.xlsx`;
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        console.error("Error al exportar a Excel:", error);
        res.status(500).send("No se pudo generar el archivo de Excel.");
    }
};

// ===========================================================
// === FUNCIÓN PARA EXPORTAR DATOS FILTRADOS A PDF        ====
// ===========================================================
reportsCtrl.exportToPdf = async (req, res) => {
    try {
        const { expenseType = 'all', truck = '', opType = '', startDate = '', endDate = '' } = req.query;
        let maintenanceQuery = { isActive: true }; let fuelQuery = { isActive: true };
        if (startDate && endDate) { const start = new Date(startDate); const end = new Date(endDate); end.setUTCHours(23, 59, 59, 999); maintenanceQuery.date = { $gte: start, $lte: end }; fuelQuery.date = { $gte: start, $lte: end }; }
        if (truck) { maintenanceQuery.truck = truck; fuelQuery.truck = truck; }
        if (expenseType === 'maintenance' && opType) { maintenanceQuery['serviceItems.type'] = opType; }
        
        let maintenanceRecords = []; let fuelRecords = [];
        if (expenseType === 'all' || expenseType === 'maintenance') { maintenanceRecords = await Maintenance.find(maintenanceQuery).populate('truck', 'placa alias').lean(); }
        if (expenseType === 'all' || expenseType === 'fuel') { fuelRecords = await Fuel.find(fuelQuery).populate('truck', 'placa alias').lean(); }
        
        const fonts = { Roboto: { normal: path.join(process.cwd(), 'fonts/Roboto-Regular.ttf'), bold: path.join(process.cwd(), 'fonts/Roboto-Medium.ttf'), italics: path.join(process.cwd(), 'fonts/Roboto-Italic.ttf'), bolditalics: path.join(process.cwd(), 'fonts/Roboto-MediumItalic.ttf') }};
        const printer = new PdfPrinter(fonts);
        
        const logoPath = path.join(process.cwd(), 'public/img/logo-light.png');
        let logoBase64 = null;
        if (fs.existsSync(logoPath)) {
            logoBase64 = fs.readFileSync(logoPath).toString('base64');
        } else {
            console.warn(`Advertencia: No se encontró el archivo del logo en ${logoPath}`);
        }
        
        const maintenanceBody = maintenanceRecords.flatMap(event => event.serviceItems.map(item => [{ text: event.truck.alias || event.truck.placa }, { text: event.eventName }, { text: new Date(event.date).toLocaleDateString('es-ES') }, { text: item.type }, { text: item.cost.toFixed(2), alignment: 'right' }, { text: event.currency, alignment: 'center' }]));
        const fuelBody = fuelRecords.map(rec => [{ text: rec.truck.alias || rec.truck.placa }, { text: new Date(rec.date).toLocaleDateString('es-ES') }, { text: `${rec.quantity.toFixed(2)} ${rec.unit}` }, { text: rec.cost.toFixed(2), alignment: 'right' }, { text: rec.currency, alignment: 'center' }]);
        
        const docDefinition = {
            header: { columns: [ logoBase64 ? { image: `data:image/png;base64,${logoBase64}`, width: 60, margin: [40, 20, 0, 0] } : {text: ''}, { text: 'Reporte de Gastos de Flota', style: 'header', alignment: 'right', margin: [0, 25, 40, 0] } ]},
            content: [ { text: `Reporte generado el: ${new Date().toLocaleString('es-ES')}`, alignment: 'right', style: 'subheader' } ],
            footer: function(currentPage, pageCount) { return { text: `Página ${currentPage.toString()} de ${pageCount}`, alignment: 'center', style: 'footer' }; },
            styles: { header: { fontSize: 18, bold: true }, h2: { fontSize: 14, bold: true, margin: [0, 20, 0, 8] }, subheader: { fontSize: 8, italics: true, margin: [0, 0, 40, 20] }, footer: { fontSize: 8, margin: [0,10,0,10] } },
            defaultStyle: { font: 'Roboto', fontSize: 10, color: '#333' }
        };
        
        if (maintenanceRecords.length > 0) {
            docDefinition.content.push({ text: 'Mantenimientos', style: 'h2' });
            docDefinition.content.push({ table: { headerRows: 1, widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'], body: [[{text: 'Camión', bold: true}, {text: 'Servicio', bold: true}, {text: 'Fecha', bold: true}, {text: 'Ítem', bold: true}, {text: 'Costo', bold: true, alignment: 'right'}, {text: 'Moneda', bold: true, alignment: 'center'}], ...maintenanceBody] }, layout: 'lightHorizontalLines' });
        }
        if (fuelRecords.length > 0) {
            if (maintenanceRecords.length > 0) docDefinition.content.push({ text: '', pageBreak: 'before' });
            docDefinition.content.push({ text: 'Combustible', style: 'h2' });
            docDefinition.content.push({ table: { headerRows: 1, widths: ['*', 'auto', 'auto', 'auto', 'auto'], body: [[{text: 'Camión', bold: true}, {text: 'Fecha', bold: true}, {text: 'Cantidad', bold: true}, {text: 'Costo', bold: true, alignment: 'right'}, {text: 'Moneda', bold: true, alignment: 'center'}], ...fuelBody] }, layout: 'lightHorizontalLines' });
        }
        if(maintenanceRecords.length === 0 && fuelRecords.length === 0) {
            docDefinition.content.push({ text: 'No se encontraron registros para los filtros seleccionados.', alignment: 'center', margin: [0, 50, 0, 0], fontSize: 12 });
        }
        
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks = [];
        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => {
            const result = Buffer.concat(chunks);
            const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0,-5);
            const filename = `Reporte_PDF_Flota_${timestamp}.pdf`;
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(result);
        });
        pdfDoc.end();
    } catch (error) {
        console.error("Error al exportar a PDF:", error);
        if (error.message.includes('not found in VFS')) {
            return res.status(500).send("Error del servidor: No se encontraron los archivos de fuentes. Asegúrate de que la carpeta 'fonts' exista en la raíz con los archivos .ttf de Roboto.");
        }
        res.status(500).send("No se pudo generar el archivo PDF.");
    }
};

module.exports = reportsCtrl;