// models/Truck.js

const { Schema, model } = require('mongoose');

const TruckSchema = new Schema({
  placa: {
    type: String,
    required: true,
    unique: true, // No puede haber dos camiones con la misma placa
    trim: true      // Elimina espacios en blanco al inicio y al final
  },
  marca: {
    type: String,
    required: true,
    trim: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  año: {
    type: Number,
    required: true
  },
  alias: { // Un apodo para identificarlo fácilmente
    type: String,
    required: false, // Este campo es opcional
    trim: true
  }
}, {
  timestamps: true // Esto añade automáticamente los campos createdAt y updatedAt
});

module.exports = model('Truck', TruckSchema);