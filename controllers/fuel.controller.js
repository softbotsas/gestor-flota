// controllers/fuel.controller.js (VERSIÓN FINAL CON MONEDA)
const fuelCtrl = {};
const Fuel = require('../models/Fuel');
const Truck = require('../models/Truck');

// --- RENDERIZAR LA PÁGINA DE REGISTRO DE COMBUSTIBLE ---
fuelCtrl.renderFuelPage = async (req, res) => {
  try {
    const [fuelRecords, trucks] = await Promise.all([
      Fuel.find({ isActive: true }).populate('truck', 'placa alias').sort({ date: 'desc' }).limit(50).lean(),
      Truck.find().sort({ alias: 'asc' }).lean()
    ]);

    res.render('fuel/fuel-log', {
      layout: 'layouts/main',
      fuelRecords,
      trucks
    });
  } catch (error) {
    console.error("Error al renderizar la página de combustible:", error);
    res.send("Error al cargar la página.");
  }
};

// --- CREAR UN NUEVO REGISTRO DE COMBUSTIBLE ---
fuelCtrl.createFuelRecord = async (req, res) => {
  // Añadimos 'currency' a los datos que recibimos.
  const { truck, date, mileage, quantity, unit, cost, pricePerUnit, currency } = req.body;
  if (!req.file) { return res.status(400).send('Error: Se requiere el comprobante.'); }
  try {
    const newFuelRecord = new Fuel({
      truck, date, mileage, quantity, unit, cost, pricePerUnit,
      currency, // Guardamos el nuevo campo.
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
  // Añadimos 'currency' a los datos que recibimos.
  const { truck, date, mileage, quantity, unit, cost, pricePerUnit, currency } = req.body;
  try {
    // Añadimos 'currency' al objeto de actualización.
    let updateData = { truck, date, mileage, quantity, unit, cost, pricePerUnit, currency };
    if (req.file) { updateData.receiptImage = '/uploads/' + req.file.filename; }
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