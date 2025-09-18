// models/Driver.js
const { Schema, model } = require('mongoose');

const DriverSchema = new Schema({
  // Información Personal Básica
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: false, trim: true },
  email: { type: String, required: false, trim: true, lowercase: true },
  birthDate: { type: Date, required: false },
  bloodType: { 
    type: String, 
    required: false, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
  },
  
  // Contacto de Emergencia
  emergencyContact: {
    name: { type: String, required: false, trim: true },
    phone: { type: String, required: false, trim: true },
    relationship: { type: String, required: false, trim: true }
  },
  
  // Información de Dirección
  address: {
    street: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    department: { type: String, required: false, trim: true },
    postalCode: { type: String, required: false, trim: true }
  },
  
  // Información Laboral
  license: { type: String, required: true, unique: true, trim: true },
  licenseExpiry: { type: Date, required: false },
  position: { type: String, required: false, trim: true, default: 'Conductor' },
  
  // Documentos de Identificación
  dpi: { type: String, required: true, unique: true, trim: true },
  
  // Archivos adjuntos (imagen o PDF)
  licenseFile: { type: String, required: false },
  dpiFile: { type: String, required: false },
  
  // Información Médica
  medicalInfo: {
    allergies: [{ type: String, trim: true }],
    medications: [{
      name: { type: String, trim: true },
      dosage: { type: String, trim: true }
    }],
    medicalNotes: { type: String, trim: true }
  },
  
  // Estado del Conductor
  isActive: { type: Boolean, default: true },
  status: { 
    type: String, 
    enum: ['activo', 'vacaciones', 'suspendido', 'inactivo'], 
    default: 'activo' 
  }
}, { timestamps: true });

module.exports = model('Driver', DriverSchema);


