// libs/storage.js
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Usaremos UUID para nombres de archivo únicos

// Instalamos uuid: npm install uuid

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'), // La carpeta donde se guardarán las imágenes
  filename: (req, file, cb) => {
    // Generamos un nombre de archivo único para evitar conflictos
    cb(null, uuidv4() + path.extname(file.originalname).toLocaleLowerCase());
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 2MB por archivo
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: El archivo debe ser una imagen válida (jpeg, jpg, png, gif)");
  }
}).single('image'); // 'image' es el nombre del campo <input type="file" name="image"> en el formulario

module.exports = upload;