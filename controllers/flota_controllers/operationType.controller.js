// controllers/operationType.controller.js
const opTypeCtrl = {};
const OperationType = require('../../models/flota_models/OperationType');

opTypeCtrl.createOperationType = async (req, res) => {
  const { name } = req.body;

  try {
    // Verificamos si ya existe para no tener duplicados
    const existingType = await OperationType.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingType) {
      return res.status(400).json({ success: false, message: 'Este tipo de operación ya existe.' });
    }

    const newOperationType = new OperationType({ name });
    await newOperationType.save();

    // Enviamos una respuesta exitosa con el nuevo objeto creado
    res.status(201).json({ success: true, newType: newOperationType });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor al crear el tipo de operación.' });
  }
};

module.exports = opTypeCtrl;