// controllers/fuel.controller.js (COMPLETO Y VERIFICADO)
const fuelCtrl = {};
const Fuel = require('../../models/flota_models/Fuel');
const Truck = require('../../models/flota_models/Truck');

// --- RENDERIZAR LA PÁGINA PRINCIPAL DE COMBUSTIBLE ---
fuelCtrl.renderFuelPage = async (req, res) => {
  try {
  const [fuelRecords, trucks, drivers] = await Promise.all([
      Fuel.find({ isActive: true })
        .populate('truck', 'placa alias')
        .populate('driver', 'name')
        .sort({ date: 'desc' }).limit(50).lean(),
      Truck.find({ status: 'Activo' }).sort({ alias: 'asc' }).lean(),
      require('../../models/flota_models/Driver').find({ isActive: true }).sort({ name: 'asc' }).lean()
    ]);
    res.render('fuel/fuel-log', {
      layout: 'layouts/main',
      fuelRecords,
      trucks,
      drivers
    });
  } catch (error) {
    console.error("Error al renderizar la página de combustible:", error);
    res.send("Error al cargar la página.");
  }
};

// --- CREAR UN NUEVO REGISTRO DE COMBUSTIBLE ---
fuelCtrl.createFuelRecord = async (req, res) => {
  const { truck, driver, date, mileage, quantity, unit, cost, pricePerUnit, currency } = req.body;
  if (!driver) { return res.status(400).send('Error: Debe seleccionar un conductor.'); }
  if (!req.file) { return res.status(400).send('Error: Se requiere el comprobante.'); }
  try {
    const newFuelRecord = new Fuel({
      truck, driver, date, mileage, quantity, unit, cost, pricePerUnit, currency,
      receiptImage: '/uploads/' + req.file.filename
    });
    await newFuelRecord.save();
    res.redirect('/fuel');
  } catch (error) {
    console.error("Error al guardar registro de combustible:", error);
    res.redirect('/fuel');
  }
};

// --- ACTUALIZAR UN REGISTRO DE COMBUSTIBLE ---
fuelCtrl.updateFuelRecord = async (req, res) => {
  const { id } = req.params;
  const { truck, date, mileage, quantity, unit, cost, pricePerUnit, currency } = req.body;
  try {
    let updateData = { truck, date, mileage, quantity, unit, cost, pricePerUnit, currency };
    if (req.file) {
      // Opcional: Borrar la imagen anterior si se desea
      // const record = await Fuel.findById(id);
      // await fs.unlink(path.resolve('./public' + record.receiptImage));
      updateData.receiptImage = '/uploads/' + req.file.filename;
    }
    await Fuel.findByIdAndUpdate(id, updateData);
    res.redirect('/fuel');
  } catch (error) {
    console.error("Error al actualizar registro de combustible:", error);
    res.redirect('/fuel');
  }
};

// --- BORRADO SUAVE DE UN REGISTRO DE COMBUSTIBLE ---
fuelCtrl.deleteFuelRecord = async (req, res) => {
  const { id } = req.params;
  try {
    await Fuel.findByIdAndUpdate(id, { isActive: false });
    res.redirect('/fuel');
  } catch (error) {
    console.error("Error al eliminar registro de combustible:", error);
    res.redirect('/fuel');
  }
};

module.exports = fuelCtrl;