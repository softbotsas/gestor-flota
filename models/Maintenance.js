// models/Maintenance.js (CON NOMBRE DE MECÁNICO SIMPLIFICADO)
const { Schema, model } = require('mongoose');

// Definimos primero el esquema para los ítems de servicio individuales
const ServiceItemSchema = new Schema({
  type: { type: String, required: true },
  brand: { type: String },
  cost: { type: Number, required: true },
  details: { type: String }
}, { _id: false });

const MaintenanceSchema = new Schema({
  truck: {
    type: Schema.Types.ObjectId,
    ref: 'Truck',
    required: true
  },
  eventName: {
    type: String,
    required: true,
    trim: true,
    default: 'Mantenimiento General'
  },
  
  // ¡NUEVO Y SIMPLIFICADO! Un simple campo de texto para el nombre del mecánico.
  mechanicName: {
    type: String,
    trim: true,
    required: false // Opcional
  },

  date: { type: Date, required: true },
  mileage: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'GTQ'],
    default: 'GTQ'
  },
  serviceItems: [ServiceItemSchema],
  receiptImage: { type: String, required: false },
  nextServiceDate: { type: Date, required: false },
  reminderDays: { type: Number, required: false },
  isCompleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = model('Maintenance', MaintenanceSchema);