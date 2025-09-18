// models/OperationType.js
const { Schema, model } = require('mongoose');

const OperationTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // No puede haber dos tipos con el mismo nombre
    trim: true
  }
}, {
  timestamps: true
});

module.exports = model('OperationType', OperationTypeSchema);