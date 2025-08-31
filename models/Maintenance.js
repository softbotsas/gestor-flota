// models/Maintenance.js
// VERSIÓN FINAL Y COMPLETA CON "SOFT DELETE" Y RECORDATORIOS

const { Schema, model } = require('mongoose');

const MaintenanceSchema = new Schema({
  // Referencia al camión al que pertenece este mantenimiento.
  truck: {
    type: Schema.Types.ObjectId,
    ref: 'Truck',
    required: true
  },
  // El tipo de operación (ej: "Cambio de Aceite").
  type: {
    type: String,
    required: true,
  },
  // La marca del repuesto utilizado.
  brand: {
    type: String,
    required: false,
    trim: true
  },
  // El kilometraje del vehículo en el momento del servicio.
  mileage: {
    type: Number,
    required: true
  },
  // La fecha en que se realizó la operación.
  date: {
    type: Date,
    required: true
  },
  // El costo de la operación.
  cost: {
    type: Number,
    required: true
  },
    // ¡NUEVO CAMPO! Para la moneda
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'GTQ'], // Dólares Americanos, Quetzales de Guatemala
    default: 'GTQ'
  },
  // Notas o detalles adicionales.
  details: {
    type: String,
    trim: true
  },
  // La ruta a la imagen del comprobante/factura.
  receiptImage: {
    type: String,
    required: true
  },
  // Fecha para el próximo servicio (opcional).
  nextServiceDate: {
    type: Date,
    required: false
  },
  
  // ¡NUEVO! Días de anticipación para el recordatorio.
  reminderDays: {
    type: Number,
    required: false
  },
  
  // Campo para el borrado suave (soft delete).
  isActive: {
    type: Boolean,
    default: true // Por defecto, todos los nuevos registros estarán activos.
  }
}, {
  // Añade automáticamente los campos createdAt y updatedAt.
  timestamps: true
});

module.exports = model('Maintenance', MaintenanceSchema);