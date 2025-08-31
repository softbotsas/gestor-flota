// models/Fuel.js

const { Schema, model } = require('mongoose');

const FuelSchema = new Schema({
  // Referencia al camión al que pertenece esta recarga.
  truck: {
    type: Schema.Types.ObjectId,
    ref: 'Truck',
    required: true
  },
  // La fecha en que se realizó la recarga.
  date: {
    type: Date,
    required: true
  },
  // El kilometraje del vehículo en el momento de la recarga.
  mileage: {
    type: Number,
    required: true
  },
  // Cantidad de combustible añadido.
  quantity: {
    type: Number,
    required: true
  },
  // Unidad de medida (para flexibilidad futura).
  unit: {
    type: String,
    required: true,
    enum: ['Litros', 'Galones'],
    default: 'Galones'
  },
  // El costo total de la recarga.
  cost: {
    type: Number,
    required: true
  },
  // El precio por unidad (litro/galón).
  pricePerUnit: {
    type: Number,
    required: true
  },
    // ¡NUEVO CAMPO! Para la moneda
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'GTQ'],
    default: 'GTQ'
  },
  // La ruta a la imagen del comprobante/factura.
  receiptImage: {
    type: String,
    required: true
  },
  // Campo para el borrado suave (soft delete).
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = model('Fuel', FuelSchema);