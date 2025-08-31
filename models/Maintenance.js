// models/Maintenance.js
// VERSIÓN FINAL Y COMPLETA CON EL CAMPO PARA "SOFT DELETE"

const { Schema, model } = require('mongoose');

const MaintenanceSchema = new Schema({
  // Referencia al camión al que pertenece este mantenimiento.
  truck: {
    type: Schema.Types.ObjectId,
    ref: 'Truck', // Hace referencia al modelo 'Truck'
    required: true
  },
  // El tipo de operación (ej: "Cambio de Aceite"). Ya no es un enum.
  type: {
    type: String,
    required: true,
  },
  // La marca del repuesto utilizado (ej: "Casarella").
  brand: {
    type: String,
    required: false, // Opcional, ya que no siempre aplica.
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
  // Fecha para el próximo servicio (opcional, para recordatorios).
  nextServiceDate: {
    type: Date,
    required: false
  },
  
  // =======================================================
  // ============= CAMPO CLAVE PARA EL BORRADO SUAVE =======
  // =======================================================
  // Este campo determinará si el registro es visible para el usuario.
  isActive: {
    type: Boolean,
    default: true // Por defecto, todos los nuevos registros estarán activos.
  }
}, {
  // Esto añade automáticamente los campos createdAt y updatedAt a cada registro.
  timestamps: true
});

module.exports = model('Maintenance', MaintenanceSchema);