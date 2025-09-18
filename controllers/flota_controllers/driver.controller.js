const Driver = require('../../models/flota_models/Driver');
const { uploadFields } = require('../../libs/storage');

const driverCtrl = {};

driverCtrl.listDrivers = async (req, res) => {
  const drivers = await Driver.find({}).sort({ createdAt: 'desc' }).lean();
  res.render('users/drivers-list', { layout: 'layouts/main', drivers });
};

driverCtrl.renderNewDriver = (req, res) => {
  res.render('users/driver-new', { layout: 'layouts/main' });
};

driverCtrl.createDriver = async (req, res) => {
  const { 
    name, phone, email, birthDate, bloodType, status,
    emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
    addressStreet, addressCity, addressDepartment, addressPostalCode,
    license, licenseExpiry, dpi, position,
    allergies, medicalNotes
  } = req.body;
  const files = (req.files || {});

  try {
    // Procesar alergias (convertir string separado por comas a array)
    const allergiesArray = allergies ? allergies.split(',').map(a => a.trim()).filter(a => a) : [];

    const newDriver = new Driver({ 
      name, 
      phone, 
      email, 
      birthDate: birthDate ? new Date(birthDate) : undefined,
      bloodType,
      status: status || 'activo',
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
        relationship: emergencyContactRelationship
      },
      address: {
        street: addressStreet,
        city: addressCity,
        department: addressDepartment,
        postalCode: addressPostalCode
      },
      license, 
      licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
      dpi, 
      position: position || 'Conductor',
      medicalInfo: {
        allergies: allergiesArray,
        medicalNotes
      },
      licenseFile: files.licenseFile && files.licenseFile[0] ? '/uploads/' + files.licenseFile[0].filename : undefined,
      dpiFile: files.dpiFile && files.dpiFile[0] ? '/uploads/' + files.dpiFile[0].filename : undefined
    });

    await newDriver.save();
    req.flash('success_msg', 'Conductor creado con éxito.');
    res.redirect('/drivers');
  } catch (error) {
    console.error("Error al crear conductor:", error);
    if (error.code === 11000) {
      req.flash('error_msg', 'Ya existe un conductor con esa licencia o DPI.');
    } else {
      req.flash('error_msg', 'Error al crear el conductor.');
    }
    res.redirect('/drivers/new');
  }
};

driverCtrl.renderDriverDetails = async (req, res) => {
  const driver = await Driver.findById(req.params.id).lean();
  if (!driver) return res.status(404).send('Conductor no encontrado');
    res.render('users/driver-details', { layout: 'layouts/main', driver });
};

driverCtrl.renderEditDriver = async (req, res) => {
  const driver = await Driver.findById(req.params.id).lean();
  if (!driver) return res.status(404).send('Conductor no encontrado');
    res.render('users/driver-edit', { layout: 'layouts/main', driver });
};

driverCtrl.updateDriver = async (req, res) => {
  const { 
    name, phone, email, birthDate, bloodType, status,
    emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
    addressStreet, addressCity, addressDepartment, addressPostalCode,
    license, licenseExpiry, dpi, position,
    allergies, medicalNotes
  } = req.body;
  const files = (req.files || {});

  try {
    // Procesar alergias (convertir string separado por comas a array)
    const allergiesArray = allergies ? allergies.split(',').map(a => a.trim()).filter(a => a) : [];

    const update = { 
      name, 
      phone, 
      email, 
      birthDate: birthDate ? new Date(birthDate) : undefined,
      bloodType,
      status: status || 'activo',
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
        relationship: emergencyContactRelationship
      },
      address: {
        street: addressStreet,
        city: addressCity,
        department: addressDepartment,
        postalCode: addressPostalCode
      },
      license, 
      licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
      dpi, 
      position: position || 'Conductor',
      medicalInfo: {
        allergies: allergiesArray,
        medicalNotes
      }
    };

    // Manejar archivos subidos
    if (files.licenseFile && files.licenseFile[0]) {
      update.licenseFile = '/uploads/' + files.licenseFile[0].filename;
    }
    if (files.dpiFile && files.dpiFile[0]) {
      update.dpiFile = '/uploads/' + files.dpiFile[0].filename;
    }

    await Driver.findByIdAndUpdate(req.params.id, update);
    req.flash('success_msg', 'Conductor actualizado con éxito.');
    res.redirect(`/drivers/${req.params.id}`);
  } catch (error) {
    console.error("Error al actualizar conductor:", error);
    if (error.code === 11000) {
      req.flash('error_msg', 'Ya existe un conductor con esa licencia o DPI.');
    } else {
      req.flash('error_msg', 'Error al actualizar el conductor.');
    }
    res.redirect(`/drivers/${req.params.id}/edit`);
  }
};

// Middlewares para subir archivos desde rutas
driverCtrl.uploadDriverFiles = uploadFields([
  { name: 'licenseFile', maxCount: 1 },
  { name: 'dpiFile', maxCount: 1 }
]);

driverCtrl.deleteDriver = async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.redirect('/drivers');
};

module.exports = driverCtrl;


