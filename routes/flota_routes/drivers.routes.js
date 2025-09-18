const { Router } = require('express');
const router = Router();

const {
  listDrivers,
  renderNewDriver,
  createDriver,
  renderDriverDetails,
  renderEditDriver,
  updateDriver,
  deleteDriver,
  uploadDriverFiles
} = require('../../controllers/flota_controllers/driver.controller');

router.get('/', listDrivers);
router.get('/new', renderNewDriver);
router.post('/new', uploadDriverFiles, createDriver);
router.get('/:id', renderDriverDetails);
router.get('/:id/edit', renderEditDriver);
router.put('/:id', uploadDriverFiles, updateDriver);
router.delete('/:id', deleteDriver);

module.exports = router;


