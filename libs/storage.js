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
  limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB por archivo
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: El archivo debe ser una imagen válida (jpeg, jpg, png, gif)");
  }
}).single('image'); // 'image' es el nombre del campo <input type="file" name="image"> en el formulario

// Helper para múltiples campos
const uploadFields = (fields) => multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb("Error: El archivo debe ser una imagen o PDF válidos");
  }
}).fields(fields);

module.exports = upload;
module.exports.uploadSingle = upload;
module.exports.uploadFields = uploadFields;