// models/User.js
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Método para encriptar la contraseña ANTES de guardarla
UserSchema.methods.encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Método para comparar la contraseña del login con la encriptada en la BD
UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model('User', UserSchema);