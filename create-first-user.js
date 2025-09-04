// create-first-user.js
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const email = 'admin@tucajaexpress.com'; 
const password = '12345678'; 

const MONGODB_URI = process.env.MONGODB_URI_LOCAL;

async function createUser() {
  await mongoose.connect(MONGODB_URI);
  console.log('Base de datos conectada.');
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('El usuario ya existe.');
    await mongoose.disconnect();
    return;
  }
  
  const newUser = new User({ email, password });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();
  
  console.log('¡Usuario administrador creado con éxito!');
  console.log('Email:', email);
  
  await mongoose.disconnect();
}

createUser().catch(err => console.error(err));