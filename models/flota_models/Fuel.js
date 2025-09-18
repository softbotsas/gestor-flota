// models/Fuel.js (VERSIÓN FINAL Y COMPLETA)
const { Schema, model } = require('mongoose');

const FuelSchema = new Schema({
  truck: {
    type: Schema.Types.ObjectId,
    ref: 'Truck',
    required: true
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: false
  },
  date: {
    type: Date,
    required: true
  },

  mileage: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['Litros', 'Galones'],
    default: 'Galones'
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'GTQ'],
    default: 'GTQ'
  },
  receiptImage: {
    type: String,
    required: true // El recibo será obligatorio para los registros de combustible
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = model('Fuel', FuelSchema);